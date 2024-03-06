import { Patient } from './Models/Patients';
import sqlite3, { OPEN_CREATE } from 'sqlite3';
import { open } from 'sqlite';
import client from './database';
import path from 'path';

const updateDB = async () => {
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
		const SQL = `SELECT * FROM change_log WHERE proccessed = 0`;
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
					`SELECT * FROM patient WHERE id = ${row.row_id}`,
					(err, result: { PatientName: string }) => {
						if (err) {
							console.error(err);
						}
						console.log('Patient: ', result);
						patient = result;
					}
				);
				await db.each(
					`SELECT * FROM study WHERE StudyInstanceUID = '${row.StudyInstanceUID}'`,
					(err, result) => {
						if (err) {
							console.error(err);
						}
						console.log('Order: ', result);
						order = result;
					}
				);
				series = await db.all(
					`SELECT * FROM series WHERE referenceID = '${row.row_id}'`
				);
				const numSeries = series.length;
				const modality = series.filter((s) =>
					expectedModalities.includes(s['Modality'])
				)[0]['Modality'];
				console.log(modality);
				const DoseReport = series.filter((s) => s['Modality'] === 'SR').length
					? 123
					: false;

				if (patient && order && series) {
					const conn = await client.connect();
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
					const createStudySQL = `INSERT INTO main.studies 
						(study_id, study_name,modality,updated_by) 
						VALUES (LOWER('${StudyID}'), '${order['StudyDescription']}','${
						modality ? modality : 'Undefined'
					}', 'admin')
						ON CONFLICT DO NOTHING`;

					const createPatientSQL = `INSERT INTO main.patients 
						(patient_name, mrn, dob,age,gender,updated_by) 
						VALUES ('${String(PatientName).replaceAll(
							'^',
							' '
						)}',LOWER('${PatientID}'),'${dob}','${age}' ,'${gender}','admin')
						ON CONFLICT DO NOTHING`;

					await conn.query(createStudySQL);
					await conn.query(createPatientSQL);

					series.forEach(async (ser) => {
						const { Modality } = ser;
						const radiationDose =
							// find a logic to read the radiation dose from the SR dose report file
							Modality === 'SR' ? [', radiation_dose', ` ${123}`] : ['', ''];
						const createOrderSQL = `INSERT INTO main.orders 
								(order_id, mrn,study_id,o_date, o_status,report_status,updated_by, study_instance_uid, series_count${
									radiationDose[0]
								}) 
								VALUES(LOWER('${
									AccessionNumber ? AccessionNumber : `${StudyDate}${StudyTime}`
								}'),LOWER('${PatientID}'),LOWER('${StudyID}'),'${StudyDate}','Completed','Pending','admin','${StudyInstanceUID}', ${Number(
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
						await conn.query(createOrderSQL);
					});
					conn.release();
					await db.run(
						`UPDATE change_log SET proccessed = true , last_update = (datetime('now','localtime')) WHERE row_id = ${row.row_id}`
					);
				}
			});
			// await db.close();
		}
	} catch (error) {
		console.error('Error');
		console.error(`${error}`);
	}
};

/**Still under development */
export const deleteStudyMySQL = async (accessionNumber: string) => {
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

		const selectStudyID = `SELECT id FROM study WHERE AccessionNumber='${accessionNumber}'`;
		await db.each(selectStudyID, (err, result: { id: string }) => {
			if (err) console.error(err);
			if (!err) {
				studyID = result.id;
				console.log(result);
			}
		});
		console.log(studyID);
		const selectSeriesID = `SELECT id FROM Series WHERE referenceId='${studyID}'`;
		await db.each(selectStudyID, (err, result: { id: string }) => {
			if (err) console.error(err);
			if (!err) {
				seriesID = result.id;
				console.log(result);
			}
		});
		console.log(seriesID);
		const deleteSQL = `
		DELETE FROM image WHERE referenceId= '${seriesID}';
		DELETE FROM series WHERE referenceId= '${studyID}';
		DELETE FROM study WHERE id= '${studyID}';
		`;
		await db.each(deleteSQL, (err, result: { id: string }) => {
			if (err) console.error(err);
			if (!err) {
				seriesID = result.id;
				console.log(result);
			}
		});
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export default updateDB;
