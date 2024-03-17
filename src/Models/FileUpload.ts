import path from 'path';
import client from '../database';
import {
	createSQLinsert,
	createSQLshowOneOnly,
	createSQLupdate,
} from '../helpers/createSQLString';
import { Order } from './Orders';
import { Patient } from './Patients';
import fs from 'fs';
import { selectOptionsValues } from '../config/selectOption';
import getPGClient from '../getPGClient';
import { SELECTSQLQUERY } from '../helpers/filtersSQL';
import { getDateInEgypt } from '../config/getDate';
import { OrderReport } from '../Handlers/FileUploadHandler';

export const getOrderPatientData = async (
	order_ind: number
): Promise<{ patient: Patient | null; order: Order | null }> => {
	try {
		const sqlCreate = new SELECTSQLQUERY();
		sqlCreate
			.SELECT(
				{ tablesNames: 'orders', columnsNames: '*', asColumnsName: null },
				'main',
				'orders'
			)
			.Number_WHERE_SingleColumnSingleValue(
				[null],
				['ind'],
				[order_ind],
				['=']
			);
		const sqlGetOrder = sqlCreate.BUILDSQL()[0];
		const res = await getPGClient(sqlGetOrder, [], new Error().stack);

		const order = res && res.rowCount > 0 ? res.rows[0] : null;
		sqlCreate
			.SELECT(
				{ tablesNames: 'patients', columnsNames: '*', asColumnsName: null },
				'main',
				'patients'
			)
			.String_WHERE_SingleColumnSingleValue(
				[null],
				['mrn'],
				[order.mrn],
				['matchWholeWordOnly']
			);
		const sqlGePatient = sqlCreate.BUILDSQL()[0];
		const resPatient = await getPGClient(sqlGePatient, [], new Error().stack);
		const patient =
			order && resPatient && resPatient.rowCount > 0
				? resPatient.rows[0]
				: null;
		return { patient: patient, order: order };
	} catch (error) {
		console.log(`${error}`);
		return { patient: null, order: null };
	}
};

export const insertPathToDB = async (
	order_ind: number,
	order_id: string,
	filePath: string,
	fileName: string,
	category: string
): Promise<Order | null> => {
	try {
		const sqlInsert = createSQLinsert(
			'orders_schema.paperwork',
			[
				'order_ind',
				'order_id',
				'paperwork_name',
				'paperwork_path',
				'category',
				'updated_by',
				'last_update',
			],
			[
				order_ind,
				order_id,
				fileName,
				filePath,
				category,
				'admin',
				getDateInEgypt(),
			]
		);
		const res = await getPGClient(sqlInsert, [], new Error().stack);
		const insertReport = res ? res.rows[0] : null;
		const updateOrderToCompleted = `UPDATE main.orders SET report_status = '${selectOptionsValues.report_status.completed}' WHERE ind = ${order_ind};`;
		getPGClient(updateOrderToCompleted, [], new Error().stack);
		return insertReport;
	} catch (error) {
		console.log(`${error}`);
		return null;
	}
};

export const deletePathFromDB = async (
	reportToDelete: OrderReport
): Promise<Order | null> => {
	try {
		const deletSQL = `DELETE FROM orders_schema.paperwork WHERE ind = ${reportToDelete.ind} RETURNING *;`;
		const res = await getPGClient(deletSQL, [], new Error().stack);
		const result = res ? res.rows[0] : null;
		const reportsCountSQL = `SELECT COUNT (ind) AS reports_count FROM orders_schema.paperwork WHERE order_ind = ${reportToDelete.order_ind}`;
		const resCount = await getPGClient(reportsCountSQL, [], new Error().stack);
		const reprotsCount = resCount
			? Number(resCount.rows[0]['reports_count'])
			: 0;
		console.log(reprotsCount);
		if (reprotsCount === 0) {
			console.log('update order to pending report');
			const updateOrderToPendingReport = `UPDATE main.orders SET report_status = '${selectOptionsValues.report_status.pending}' WHERE ind = ${reportToDelete.order_ind}`;
			getPGClient(updateOrderToPendingReport, [], new Error().stack);
		}
		return result;
	} catch (error) {
		console.log(`${error}`);
		return null;
	}
};

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
