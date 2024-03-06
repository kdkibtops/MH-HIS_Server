import formidable from 'formidable';
import createInsertFunction from '../ParentFunctions/createInsert';
import createShowAllFunction from '../ParentFunctions/createShowAll';
import {
	DBTablesMap,
	serviceAction,
	serviceStatus,
} from '../config/LocalConfiguration';
import { REQBODY } from '../config/types';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { sendAcceptedCreatedResponse } from '../ResponseHandler/SuccessfulResponse';
import { Request, Response } from 'express';
import client from '../database';
import { sendServerError } from '../ResponseHandler/ServerError';
import { createSQLshowOneOnly } from '../helpers/createSQLString';
import { dataTypes } from '../TypesTrial/RequestTypes';

export type Procedure = {
	primaryKey?: string;
	procedure_id: string;
	procedure_name?: string;
	laboratory?: string[];
	imaging?: string[];
	recommended_material?: string[];
	paperwork?: {
		reports: { name: string; path: string }[];
		consents: { name: string; path: string }[];
		others: { name: string; path: string }[];
	}[];
	reports?: string[];
	updated_by?: string;
	last_update?: string;
};
export class PROCEDURE {
	public procedure_id: string;
	public procedure_name: string;
	public laboratory: string[];
	public imaging: string[];
	public recommended_material: string[];
	public paperwork: {
		reports: { name: string; path: string }[];
		consents: { name: string; path: string }[];
		others: { name: string; path: string }[];
	}[];
	public reports: string[];
	public updated_by: string;

	public constructor(data: Procedure) {
		this.procedure_id = data.procedure_id;
		this.procedure_name = data.procedure_name || '';
		this.laboratory = data.laboratory || [];
		this.imaging = data.imaging || [];
		this.recommended_material = data.recommended_material || [];
		this.paperwork = data.paperwork || [];
		this.reports = data.reports || [];
		this.updated_by = data.updated_by || '';
	}
}
const { shcema, tableName, UID_Column } = DBTablesMap.procedures;

export async function showAllProcedures(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Procedure[];
			error: null;
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: null;
			error: Error;
	  }
> {
	console.log(`Using the new fucntion to showAll procedures`);
	const func = createShowAllFunction(tableName);
	const x = func(limited, callBackErr);
	return x;
}

export async function insertProcedure(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Procedure[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	const insert_procedures = createInsertFunction(tableName);
	return insert_procedures(req, callBackErr);
}

export function createRecieveFileAndSaveFunction(
	documentCategory: string,
	filePath: string,
	procedureID: string,
	fileName: string,
	directoryName: string,
	mainPath: string
) {
	const recieveFileAndProcess = (req: Request, res: Response): void | Error => {
		const newToken = req.body.token || '';
		try {
			const filePath = path.join(mainPath, directoryName);
			const fileName = req.params.fileName;
			if (!existsSync(filePath)) {
				mkdirSync(filePath, { recursive: true });
			}
			const form = formidable({
				uploadDir: filePath,
				multiples: true,
				keepExtensions: true,
				filename: (name, ext, part, form) => {
					return `${name.replaceAll(' ', '_')}_${new Date()
						.toISOString()
						.replaceAll(':', '_')}${ext}`;
				},
			});
			form.parse(req, (err, fields, files) => {});
			form.on('file', async (form, file) => {
				console.log('Document saved success');
				const conn = await client.connect();
				const SQL = `
				SELECT "paperwork" FROM main.procedures WHERE procedure_id = '${procedureID}';
				`;
				const result = await client.query(SQL);
				const { paperwork } = result.rows[0];
				// Create this class that contains all relevant keys in the paperwork column, in case that paper work coulmn is null,
				//  this object will avoid the error occuring due to dealing with null
				class TEMP_OBJ {
					public reports: object[];
					public consents: object[];
					public others: object[];
					constructor(prev: {
						reports: object[];
						consents: object[];
						others: object[];
					}) {
						this.reports = prev && prev.reports ? prev.reports : [];
						this.consents = prev && prev.consents ? prev.consents : [];
						this.others = prev && prev.others ? prev.others : [];
					}
				}
				const temp_obj = new TEMP_OBJ(paperwork);
				const selectedCategory =
					temp_obj[documentCategory as keyof typeof temp_obj];
				const updateSelectedCategory = [
					...selectedCategory,
					{ name: fileName, path: file.filepath },
				];
				temp_obj[documentCategory as keyof typeof temp_obj] =
					updateSelectedCategory;
				const updateSQL = `UPDATE main.procedures
SET paperwork = '${JSON.stringify(temp_obj)}'
WHERE procedure_id ='${procedureID}';
`;
				await conn.query(updateSQL);
				conn.release();
				console.log('Updated DB');
				sendAcceptedCreatedResponse(res, newToken, [
					{ name: fileName, path: file.filepath },
				]);
			});
		} catch (error) {
			const result = error as Error;
			sendServerError(
				res,
				{ accessToken: newToken, data: [], action: serviceAction.failed },
				result
			);
			return result;
		}
	};
	return recieveFileAndProcess;
}

export const genericDeletePathFromDB = async (
	tableName: string,
	filterColumn: string,
	filterValue: string,
	deleteFromColumn: string,
	filePath: string,
	dataCategory: string
): Promise<
	| { feedback: serviceStatus.success; enteries: number; data: dataTypes }
	| { feedback: serviceStatus.failed; enteries: number; data: Error }
> => {
	const conn = await client.connect();
	try {
		const SQL_query = createSQLshowOneOnly(
			`${shcema}.${tableName}`,
			filterColumn,
			filterValue,
			[deleteFromColumn],
			filterColumn
		);
		const result = await conn.query(SQL_query);
		const columnData = result.rows[0].paperwork;
		// Create this class that contains all relevant keys in the paperwork column, in case that paper work coulmn is null,
		//  this object will avoid the error occuring due to dealing with null
		class TEMP_OBJ {
			public reports: object[];
			public consents: object[];
			public others: object[];
			constructor(paperworkData: {
				reports: object[];
				consents: object[];
				others: object[];
			}) {
				this.reports =
					paperworkData && paperworkData.reports ? paperworkData.reports : [];
				this.consents =
					paperworkData && paperworkData.consents ? paperworkData.consents : [];
				this.others =
					paperworkData && paperworkData.others ? paperworkData.others : [];
			}
		}
		const temp_obj = new TEMP_OBJ(columnData);
		const dataCategoryToDeletePathFrom =
			temp_obj[dataCategory as keyof typeof temp_obj];
		const newDataArr = dataCategoryToDeletePathFrom.filter((e) => {
			return e['path' as keyof typeof e] !== filePath;
		});
		const updateSelectedCategory = [...newDataArr];
		temp_obj[dataCategory as keyof typeof temp_obj] = updateSelectedCategory;
		const updateSQL = `UPDATE main.procedures
SET paperwork = '${JSON.stringify(temp_obj)}'
WHERE LOWER(procedure_id) = LOWER('${filterValue}') RETURNING paperwork;
`;
		await conn.query(updateSQL);
		conn.release();
		return {
			feedback: serviceStatus.success,
			enteries: 1,
			data: [{ path: filePath }],
		};
	} catch (error) {
		const err = error as Error;
		return { feedback: serviceStatus.failed, data: err, enteries: 1 };
	} finally {
		conn.release();
	}
};
