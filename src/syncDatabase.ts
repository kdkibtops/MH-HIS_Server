import { Patient } from './Models/Patients';
import sqlite3, { OPEN_CREATE } from 'sqlite3';
import { open } from 'sqlite';
import client from './database';
import path from 'path';
import { existsSync, rm } from 'fs';
import { DICOMSTORAGEFOLDER } from './DICOM/DICOMServer';
import { logError } from './helpers/errorLogging';

const updateDB = async (callBackErr?: Function) => {
	try {
		const db = await open({
			filename: path.join(
				__dirname,
				'../application_files',
				'dicom',
				'image.db'
			),
			driver: sqlite3.cached.Database,
		});
		const SQL = `SELECT * FROM change_log WHERE processed = 0`;
		const result = await db.all(SQL);
		console.log(result);
		if (result.length > 0) {
			result.forEach(async (row) => {
				console.log('retrieving new data');
				let patient;
				let order;
				let series;
				const expectedModalities = ['CT', 'MR', 'US', 'CR', 'DR', 'XA'];
				await db.each(
					`SELECT * FROM patient WHERE id = ${row.patient_id}`,
					(err, result: { PatientName: string }) => {
						if (err) {
							console.error(err);
						}
						// console.log('Patient: ', result);
						patient = result;
					}
				);
				await db.each(
					`SELECT * FROM study WHERE StudyInstanceUID = '${row.StudyInstanceUID}'`,
					(err, result) => {
						if (err) {
							console.error(err);
						}
						// console.log('Order: ', result);
						order = result;
					}
				);
				series = await db.all(
					`SELECT * FROM series WHERE referenceID = '${row.study_id}'`
				);
				console.log(`SERIES FOUND ${series.length}`);
				const numSeries = series.length;
				const modality = series.length
					? series.filter((s) => expectedModalities.includes(s['Modality']))[0][
							'Modality'
					  ]
					: 'Undefined Modality';
				const DoseReport = series.filter((s) => s['Modality'] === 'SR').length
					? 123
					: false;

				if (patient && order && series) {
					console.log('Processing new data');

					const { PatientID, PatientName, PatientBirthDate, PatientSex } =
						patient;
					const {
						AccessionNumber,
						StudyID,
						StudyDate,
						StudyTime,
						StudyInstanceUID,
					} = order;

					const dob = `${String(PatientBirthDate).slice(0, 4)}-${String(
						PatientBirthDate
					).slice(4, 6)}-${String(PatientBirthDate).slice(6, 8)}`;

					const age: any = (
						(Date.now() - Number(new Date(dob))) /
						1000 /
						60 /
						60 /
						24 /
						365.25
					).toFixed(1);

					const gender = `${
						PatientSex === 'M'
							? 'Male'
							: PatientSex === 'F'
							? 'Female'
							: 'Undefined'
					}`;
					// Check study in postgreSQL DB, if found retrieve study code else insert new study, this is becasue in study only I search for study
					// by study name not study_id to avoid duplication of name as much as possible, if the name is present I should use the same study code
					// instead of creating new study with the same name
					const checkStudyFoundSQL = `SELECT * FROM main.studies WHERE LOWER(study_name)=LOWER('${order['StudyDescription']}')`;
					const stuConn = await client.connect();
					const study = await stuConn.query(checkStudyFoundSQL);
					const studyFound = study.rowCount;
					const retrievedStudyCode =
						studyFound !== 0 ? study.rows[0]['study_id'] : null;
					if (studyFound === 0 || order['StudyDescription'] === null) {
						const createStudySQL = `INSERT INTO main.studies 
							(study_id, study_name,modality,updated_by) 
							VALUES (LOWER('${modality}${StudyID}'), '${
							order['StudyDescription']
						}${StudyID}','${modality ? modality : 'Undefined'}', 'admin')
							ON CONFLICT DO NOTHING`;
						try {
							console.log('inserting study from MYSQL');
							await stuConn.query(createStudySQL);
							stuConn.release();
						} catch (err) {
							const error = err as Error;
							await db
								.each(
									`UPDATE change_log SET processed = 1 , Err = 'Name: ${JSON.stringify(
										error.name
									)} - Message: ${
										error.message
									}', last_update = (datetime('now','localtime')) WHERE id = ${
										row.id
									}`,
									() => console.log('update succeeded')
								)
								.catch((err) => logError(err));
							logError(error);
							console.log(`Error in inserting new patient to postgreSQL`);
							logError(err as Error);
						}
					}

					// Inserting patient to postgreSQL
					const createPatientSQL = `INSERT INTO main.patients 
						(patient_name, mrn, dob,gender,updated_by) 
						VALUES ('${String(PatientName).replaceAll(
							'^',
							' '
						)}',LOWER('${PatientID}'),'${dob}' ,'${gender}','admin')
						ON CONFLICT DO NOTHING`;
					try {
						console.log('inserting patient from MYSQL');
						const patConn = await client.connect();
						await patConn.query(createPatientSQL);
						patConn.release();
					} catch (err) {
						const error = err as Error;
						await db
							.each(
								`UPDATE change_log SET processed = 1 , Err = 'Name: ${JSON.stringify(
									error.name
								)} - Message: ${
									error.message
								}', last_update = (datetime('now','localtime')) WHERE id = ${
									row.id
								}`,
								() => console.log('update succeeded')
							)
							.catch((err) => logError(err));
						logError(error);
						console.log(`Error in inserting new patient to postgreSQL`);
						logError(err as Error);
					}

					series.forEach(async (ser) => {
						console.log('inserting order from MYSQL');
						// if the study found, may be study_id is different, so to avoid fkey constraint error, we use the study_id retrieved from the found study
						const studyCodeInLowerCase =
							studyFound === 0
								? `LOWER('${modality}${StudyID}')`
								: `'${retrievedStudyCode}'`;

						const { Modality } = ser;
						const radiationDose =
							// find a logic to read the radiation dose from the SR dose report file
							Modality === 'SR' ? [', radiation_dose', ` ${123}`] : ['', ''];
						const createOrderSQL = `INSERT INTO main.orders 
								(order_id, mrn,study_id,o_date, o_status,report_status,age ,updated_by, study_instance_uid, series_count${
									radiationDose[0]
								}) 
								VALUES(LOWER('${
									AccessionNumber ? AccessionNumber : `${StudyDate}${StudyTime}`
								}'),LOWER('${PatientID}'),${studyCodeInLowerCase},'${StudyDate}','Completed','Pending',${age} ,'admin','${StudyInstanceUID}', ${Number(
							numSeries
						)}${radiationDose[1] === '' ? '' : ',' + radiationDose[1]})
								ON CONFLICT ON CONSTRAINT orders_pkey DO 
								UPDATE SET 	
								series_count = ${Number(numSeries)},
								study_instance_uid = '${StudyInstanceUID}'
								${radiationDose[0]}${ser['Modality'] === 'SR' ? '=' : ''}${radiationDose[1]}
								WHERE LOWER(orders.order_id) = LOWER('${AccessionNumber}')
								`;
						console.log(createOrderSQL);

						try {
							const serConn = await client.connect();
							const insertedTOPGDB = await serConn.query(createOrderSQL);
							serConn.release();
							if (insertedTOPGDB) {
								await db
									.each(
										`UPDATE change_log SET processed = true , Err = null ,last_update = (datetime('now','localtime')) WHERE id = ${row.id}`,
										() => console.log('update succeeded')
									)
									.catch((err) => logError(err));
							} else {
								await db
									.each(
										`UPDATE change_log SET processed = 1 , Err = 'Error at inserting order to postgreSQL' , last_update = (datetime('now','localtime')) WHERE id = ${row.id}`,
										() => console.log('update succeeded')
									)
									.catch((err) => logError(err));
							}
						} catch (err) {
							const error = err as Error;
							console.log(`Error in inserting new order to postgreSQL`);
							await db
								.each(
									`UPDATE change_log SET processed = 1 , Err = 'Name: ${JSON.stringify(
										error.name
									)} - Message: ${
										error.message
									}', last_update = (datetime('now','localtime')) WHERE id = ${
										row.id
									}`,
									() => console.log('update succeeded')
								)
								.catch((err) => logError(err));
							logError(error as Error);
						}
					});
				} else {
					db.each(
						`UPDATE change_log SET processed = true , last_update = (datetime('now','localtime')) WHERE id = ${row.id}`,
						() => console.log('update succeeded')
					).catch((err) => logError(err));
				}
			});
		}
	} catch (error) {
		if (callBackErr) {
			callBackErr(error);
		} else {
			console.error('Error');
			logError(error as Error);
		}
	}
};

export const deleteStudyMySQL = async (
	StudyInstanceUID: string,
	callBackErr?: Function
) => {
	try {
		const db = await open({
			filename: path.join(
				__dirname,
				'../application_files',
				'dicom',
				'image.db'
			),
			driver: sqlite3.cached.Database,
		});
		let studyID;
		let seriesID;
		let imageID;

		const selectStudyID = `SELECT id FROM study WHERE StudyInstanceUID='${StudyInstanceUID}'`;
		await db.each(selectStudyID, (err, result: { id: string }) => {
			if (err) console.error(err);
			if (!err) {
				studyID = result.id;
				console.log(result);
			}
		});
		console.log(studyID);
		const selectSeriesID = `SELECT id FROM Series WHERE referenceId='${studyID}'`;
		const x = await db.all(selectSeriesID);
		if (x.length > 0) {
			x.forEach((ser) => {
				const deleteImage = `DELETE FROM image WHERE referenceId= '${ser.id}';`;
				const deleteSeries = `DELETE FROM series WHERE id= '${ser.id}';`;
				console.log(deleteImage);
				console.log(deleteSeries);
				db.each(deleteImage, () => console.log('deleted images'))
					.then(() => {
						console.log(deleteSeries);
						db.each(deleteSeries, () => console.log('deleted series'));
					})
					.catch((err) => logError(err));
			});
		}
		const deleteStudy = `DELETE FROM study WHERE id= '${studyID}';`;
		db.run(deleteStudy)
			.then(() => {
				console.log('Deleting folder');
				StudyInstanceUID;
				if (StudyInstanceUID) {
					if (existsSync(path.join(DICOMSTORAGEFOLDER, StudyInstanceUID))) {
						rm(
							path.join(DICOMSTORAGEFOLDER, StudyInstanceUID),
							{ recursive: true },
							(err) => {
								console.log(err);
							}
						);
					}
				}
			})
			.catch((err) => logError(err));
		return true;
	} catch (error) {
		if (callBackErr) {
			callBackErr(error);
		} else {
			console.error(error);
			logError(error as Error);
		}
		return false;
	}
};

// export default updateDB;
