import path from 'path';
import client from '../database';
import {
	createSQLshowOneOnly,
	createSQLupdate,
} from '../helpers/createSQLString';
import { Order } from './Orders';
import { Patient } from './Patients';
import fs from 'fs';
import { selectOptionsValues } from '../config/selectOption';
import { dataTypes } from '../TypesTrial/RequestTypes';
import { Procedure } from './Procedures';
import { serviceStatus } from '../config/LocalConfiguration';
export const getOrderPatientData = async (
	order_id: string
): Promise<{ patient: Patient | null; order: Order | null }> => {
	try {
		const SQL_order = createSQLshowOneOnly(
			'main.orders',
			'order_id',
			order_id,
			[],
			'order_id'
		);
		const conn = await client.connect();
		const order = (await conn.query(SQL_order)).rows[0];
		const SQL_patient = createSQLshowOneOnly(
			'main.patients',
			'mrn',
			order.mrn,
			[],
			'mrn'
		);
		const patient = (await conn.query(SQL_patient)).rows[0];
		conn.release();
		return { patient: patient, order: order };
	} catch (error) {
		console.log(`${error}`);
		return { patient: null, order: null };
	}
};

export const insertPathToDB = async (
	tableName: string,
	filterColumn: string,
	filterValue: string,
	insertColumn: string,
	filePath: string
): Promise<Order | null> => {
	try {
		const SQL_query = createSQLshowOneOnly(
			tableName,
			filterColumn,
			filterValue,
			[],
			filterColumn
		);

		const conn = await client.connect();
		const entry = (await conn.query(SQL_query)).rows[0];
		const reports = entry[insertColumn];

		let SQL_INSERT = `UPDATE ${tableName} 
        SET ${insertColumn} 
        = (ARRAY [`;
		// this will run only if there's reports saved to avoid iterating over null if no reports
		if (reports) {
			reports.forEach((element: string) => {
				SQL_INSERT += `'${element}',`;
			});
		}
		SQL_INSERT += `'${filePath}'] )
        WHERE ${filterColumn}='${filterValue}'`;
		// if the report status is pending, update it to completed otherwise leave it as it is
		if (entry.report_status === 'Pending') {
			await conn.query(
				`UPDATE ${tableName} SET report_status = '${selectOptionsValues.report_status.completed}' , o_status = '${selectOptionsValues.o_status.reported}' WHERE ${filterColumn}='${filterValue}'`
			);
		}
		const result = (await conn.query(SQL_INSERT)).rows[0];
		conn.release();
		return result;
	} catch (error) {
		console.log(`${error}`);
		return null;
	}
};

export const deletePathFromDB = async (
	tableName: string,
	filterColumn: string,
	filterValue: string,
	insertColumn: string,
	filePath: string
): Promise<Order | null> => {
	try {
		const SQL_query = createSQLshowOneOnly(
			tableName,
			filterColumn,
			filterValue,
			[insertColumn],
			filterColumn
		);
		const conn = await client.connect();
		const reports = (await conn.query(SQL_query)).rows[0][insertColumn];
		const pathToDelete = reports.find((p: string) => p === filePath);
		reports.forEach((element: string) => {
			// console.log(pathToDelete !== element);
		});
		const filteredArray = reports.filter((e: string) => e !== pathToDelete);
		let SQL_INSERT = `UPDATE ${tableName} 
		SET ${insertColumn} `;
		// this will run only if there's reports saved to avoid iterating over null if no reports
		if (filteredArray.length > 0) {
			SQL_INSERT += `= (ARRAY [`;
			filteredArray.forEach((element: string) => {
				SQL_INSERT += `'${element}',`;
			});
			SQL_INSERT = SQL_INSERT.slice(0, -1);
			SQL_INSERT += `] )
			WHERE ${filterColumn}='${filterValue}' RETURNING *`;
		} else if (filteredArray.length < 1 || !filteredArray) {
			SQL_INSERT = `UPDATE ${tableName} SET ${insertColumn}=NULL WHERE ${filterColumn}='${filterValue}' RETURNING *`;
		}
		console.log(SQL_INSERT);
		const result = (await conn.query(SQL_INSERT)).rows[0];
		if (!result[insertColumn]) {
			await conn.query(
				`UPDATE ${tableName} SET report_status = '${selectOptionsValues.report_status.pending}', o_status='${selectOptionsValues.o_status.completed}'  WHERE ${filterColumn}='${filterValue}' `
			);
		}
		conn.release();
		return result;
	} catch (error) {
		console.log(`${error}`);
		return null;
	}
};

// Copied to Procedures.ts
// export const genericDeletePathFromDB = async (
// 	tableName: string,
// 	filterColumn: string,
// 	filterValue: string,
// 	deleteFromColumn: string,
// 	filePath: string,
// 	dataCategory: string
// ): Promise<
// 	| { feedback: serviceStatus.success; enteries: number; data: dataTypes }
// 	| { feedback: serviceStatus.failed; enteries: number; data: Error }
// > => {
// 	try {
// 		const conn = await client.connect();
// 		const SQL_query = createSQLshowOneOnly(
// 			tableName,
// 			filterColumn,
// 			filterValue,
// 			[deleteFromColumn],
// 			filterColumn
// 		);
// 		const columnData = (await conn.query(SQL_query)).rows[0][deleteFromColumn];
// 		// Create this class that contains all relevant keys in the paperwork column, in case that paper work coulmn is null,
// 		//  this object will avoid the error occuring due to dealing with null
// 		class TEMP_OBJ {
// 			public reports: object[];
// 			public consents: object[];
// 			public others: object[];
// 			constructor(prev: {
// 				reports: object[];
// 				consents: object[];
// 				others: object[];
// 			}) {
// 				this.reports = prev && prev.reports ? prev.reports : [];
// 				this.consents = prev && prev.consents ? prev.consents : [];
// 				this.others = prev && prev.others ? prev.others : [];
// 			}
// 		}
// 		const temp_obj = new TEMP_OBJ(columnData);
// 		const dataCategoryToDeletePathFrom =
// 			temp_obj[dataCategory as keyof typeof temp_obj];
// 		const newDataArr = dataCategoryToDeletePathFrom.filter((e) => {
// 			return e['path' as keyof typeof e] !== filePath;
// 		});

// 		const updateSelectedCategory = [...newDataArr];
// 		temp_obj[dataCategory as keyof typeof temp_obj] = updateSelectedCategory;
// 		const updateSQL = `UPDATE main.procedures
// SET paperwork = '${JSON.stringify(temp_obj)}'
// WHERE procedure_id = '${filterValue}' RETURNING paperwork;
// `;
// 		const result = (await conn.query(updateSQL)).rows[0];
// 		conn.release();
// 		return { feedback: serviceStatus.success, data: [result], enteries: 1 };
// 	} catch (error) {
// 		const err = error as Error;
// 		return { feedback: serviceStatus.failed, data: err, enteries: 1 };
// 	}
// };

export const genericInsertPathToDB = async (
	schemaNname: string,
	tableName: string,
	filterColumn: string,
	filterValue: string,
	insertColumn: string,
	pathKeyName: string,
	filePath: string,
	replacePrevious: boolean,
	filePathPrefixFolder?: string
): Promise<Order | null> => {
	try {
		if (replacePrevious) {
			// it will replace the path of file found in the database under the pathKeyName and deletes the file from local folder
			const SQL_query = createSQLshowOneOnly(
				`${schemaNname}.${tableName}`,
				filterColumn,
				filterValue,
				[insertColumn],
				filterColumn
			);

			const conn = await client.connect();
			const pathesFound = (await conn.query(SQL_query)).rows[0][insertColumn];
			console.log('paths found: ');
			console.log(pathesFound);
			let SQL_INSERT = `UPDATE ${schemaNname}.${tableName}
        SET ${insertColumn} 
        = "`;
			// this will run only if there's reports saved to avoid iterating over null if no reports
			let newPaths: string;
			if (pathesFound) {
				newPaths = JSON.stringify({ ...pathesFound, [pathKeyName]: filePath });
			} else {
				newPaths = JSON.stringify({ [pathKeyName]: filePath });
			}
			const SQL = createSQLupdate(
				`${schemaNname}.${tableName}`,
				[insertColumn],
				[newPaths],
				filterColumn,
				filterValue
			);

			SQL_INSERT += `${newPaths}"
        WHERE ${filterColumn}='${filterValue}'`;
			console.log(SQL);
			const result = (await conn.query(SQL)).rows[0];
			conn.release();
			if (result) {
				fs.unlinkSync(
					path.join(filePathPrefixFolder as string, pathesFound[pathKeyName])
				);
			}
			return result;
		} else {
			// Find a logic to append files instead of replacing
			return null;
		}
	} catch (error) {
		console.log(`${error}`);
		return null;
	}
};
