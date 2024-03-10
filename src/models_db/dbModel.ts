import {
	LocalAConfig,
	serviceAction,
	serviceStatus,
} from '../config/LocalConfiguration';
import client from '../database';
import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
} from 'fs';
import path from 'path';
import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { sendServerError } from '../ResponseHandler/ServerError';
import { selectOptionsValues } from '../config/selectOption';

//  take care that the following array must be written in order of dependant table on database, if not foreign key violation error will occur
export const allowedBulkUploadTables = [
	{
		schemaName: 'main',
		tableName: 'users',
		hintText: 'no Text',
		buttonTitle: 'Users',
	},
	{
		schemaName: 'main',
		tableName: 'studies',
		hintText: `Table name: Studies-
	Columns as follow: [-
		"study_id" VARCHAR(150) PRIMARY KEY,-
		"modality" VARCHAR(10),-
		"study_name" VARCHAR(100),-
		"arabic_name" VARCHAR,-
		"price" float,-
		"updated_by" VARCHAR(50),-
		"last_update" VARCHAR(75)-
]
	`,
		buttonTitle: 'Studies',
	},
	{
		schemaName: 'main',
		tableName: 'patients',
		hintText: `Table name: Patients-
	Columns as follow: [-
		"mrn" VARCHAR(150) PRIMARY KEY,-
		"patient_name" VARCHAR(100),-
		"national_id" VARCHAR(14),-
		"dob" VARCHAR(50),-
		"age" float,-
		"gender" VARCHAR,-
		"contacts" VARCHAR,-
		"email" VARCHAR(150),-
		"updated_by" VARCHAR(50),-
		"last_update" VARCHAR(75)-
	]
	`,
		buttonTitle: 'Patients',
	},
	{
		schemaName: 'main',
		tableName: 'orders',
		hintText: `Table name: Orders-
	Columns as follow: [-
		"order_id" VARCHAR(100),-
		"mrn" VARCHAR(150),-
		"study" VARCHAR(150),-
		"o_date" date,-
		"o_status" VARCHAR(20),-
		"report" text[],-
		"radiologist" VARCHAR(75),-
		"report_status" VARCHAR(50),-
		"critical"  VARCHAR(50),-
		"radiation_dose" float,-
		"study_instance_uid" VARCHAR UNIQUE,-
		"series_count" INTEGER,-
		"updated_by" VARCHAR(50),-
		"last_update" VARCHAR(75)-
	]
	`,
		buttonTitle: 'Orders',
	},
	{
		schemaName: 'inventory',
		tableName: 'categories',
		hintText: `Table name: Inventory categories-
	Columns as follow: [-
		"category_id" VARCHAR(50) PRIMARY KEY,
		"category_name" VARCHAR(100),
		"updated_by" VARCHAR(50),
		"last_update" VARCHAR(50)
	]
	`,
		buttonTitle: 'Inventory categories',
	},
	{
		schemaName: 'inventory',
		tableName: 'stores',
		hintText: `Table name: Stores-
	Columns as follow: [-

	]
	`,
		buttonTitle: 'Inventory stores',
	},
	{
		schemaName: 'inventory',
		tableName: 'materials',
		hintText: `Table name: inventory materials-
	Columns as follow: [-
		"item_id" VARCHAR(50) PRIMARY KEY,-
		"item_name" VARCHAR(100),-
		"category" VARCHAR(50),-
		"store_id" VARCHAR(50),-
		"price" float,-
		"stock" INTEGER,-
		"updated_by" VARCHAR(50),-
		"last_update" VARCHAR(50)-
	]
	`,
		buttonTitle: 'Inventory materials',
	},

	{
		schemaName: 'main',
		tableName: 'procedures',
		hintText: `Table name: IR Procedures-
	Columns as follow: [-
		"procedure_id" VARCHAR(50) PRIMARY KEY,-
		"procedure_name" VARCHAR(100),-
		"laboratory" VARCHAR(50)[],-
		"imaging" VARCHAR(50)[],-
		"recommended_material" VARCHAR(150)[],-
		"paperwork" json,-
		"updated_by" VARCHAR(50),-
		"last_update" VARCHAR(50)-
	]
	`,
		buttonTitle: 'IR Procedures',
	},
];
async function getCSVFileColumns(
	path: string,
	callBackErr?: Function
): Promise<string[]> {
	try {
		console.log(path);
		const csvText = readFileSync(path, {
			encoding: 'utf8',
			flag: 'r',
		});
		const columnsArr = csvText.split('\r')[0].split(',');
		let str = columnsArr.map((col) => `"${col as string}",`);
		str[str.length - 1] = str[str.length - 1].slice(0, -1);
		return str;
	} catch (err) {
		const error = err as Error;
		if (callBackErr) {
			callBackErr(error as Error);
			return [''];
		} else {
			console.log(`Error: ${error.message}`);
			return [''];
		}
	}
}
export async function getTableColumnsFromDatabase(
	schemaName: string,
	tableName: string,
	callBackErr?: Function
): Promise<
	| {
			data: {
				columnName: string;
				dataType: string;
				udtName: string;
				characterMaxLength: string;
			}[];
			udtNameValues: string;
			columnsNammeString: string;
			createColumnsString: string;
			err: null;
	  }
	| { data: []; err: Error }
> {
	try {
		const SQL = `SELECT 
		TABLE_SCHEMA,
		TABLE_NAME,
		COLUMN_NAME, 
		DATA_TYPE,
		UDT_NAME,
		CHARACTER_MAXIMUM_LENGTH
		FROM INFORMATION_SCHEMA.COLUMNS
		where TABLE_NAME = '${tableName}' AND TABLE_SCHEMA='${schemaName}'`;
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		const columns = result.rows
			.filter((c) => c.column_name !== 'ind')
			.map((c) => {
				return {
					columnName: c.column_name as string,
					dataType: c.data_type as string,
					udtName: c.udt_name as string,
					characterMaxLength: c.character_maximum_length,
				};
			});

		const columnsNammeString = new String()
			.concat(...columns.map((c) => ` "${c.columnName}",`))
			.slice(0, -1);
		const createColumnsString = new String()
			.concat(
				...columns.map(
					(c) =>
						`"${c.columnName}" ${c.udtName} ${
							c.characterMaxLength ? `(${c.characterMaxLength}),\n` : ',\n'
						}`
				)
			)
			.slice(0, -2);
		const udtNameValues = new String()
			.concat(
				...columns.map(
					(c) =>
						`${c.udtName} ${
							c.characterMaxLength ? `(${c.characterMaxLength}),` : ','
						}`
				)
			)
			.slice(0, -1);
		return {
			data: columns,
			columnsNammeString: columnsNammeString,
			createColumnsString: createColumnsString,
			udtNameValues: udtNameValues,
			err: null,
		};
	} catch (error) {
		if (callBackErr) {
			callBackErr(error as Error);
			return { data: [], err: error as Error };
		} else {
			return { data: [], err: error as Error };
		}
	}
}
export async function insertDataFromCSVtoDB(
	createColumnsString: string,
	columnsNammeString: string,
	schemaName: string,
	tableName: string,
	folderPath: string,
	callBackErr?: Function
	// connection: PoolClient
): Promise<QueryResult | boolean> {
	try {
		const updateSQL = `	
CREATE TEMP TABLE temp_table_${tableName} (
${createColumnsString}
);
COPY temp_table_${tableName} ( ${columnsNammeString} ) FROM '${String(
			path.join(folderPath, `${schemaName}-${tableName}.csv`)
		)}'
DELIMITER ','
CSV
HEADER
ENCODING 'UTF-8';
INSERT INTO ${schemaName}.${tableName}
( ${columnsNammeString} )
SELECT ${columnsNammeString}
FROM temp_table_${tableName} ON CONFLICT DO NOTHING;
UPDATE ${schemaName}.${tableName} SET last_update = NOW() WHERE last_update IS NULL ;
${
	schemaName === 'main' && tableName !== 'users'
		? `UPDATE ${schemaName}.${tableName} SET updated_by = 'admin' WHERE updated_by IS NULL ; `
		: '\n'
}
${
	schemaName === 'main' && tableName === 'orders'
		? `UPDATE ${schemaName}.${tableName} SET critical = '${selectOptionsValues.critical.notCritical}' WHERE critical IS NULL ; 
		   UPDATE ${schemaName}.${tableName} SET o_status = '${selectOptionsValues.o_status.completed}' WHERE o_status IS NULL ; `
		: '\n'
}
`;
		console.log(`found ${tableName} csv data`);
		// const result = connection
		const conn = await client.connect();
		const result = conn
			.query(updateSQL)
			.then((res) => res)
			.catch((err) => {
				console.log(updateSQL);
				console.error(err);
				return false;
			});
		conn.release();
		return result;
	} catch (error) {
		if (callBackErr) {
			callBackErr(error as Error);
			return false;
		} else {
			return false;
		}
	}
}
export type dbFile = {
	primaryKey?: string;
	path: string;
	fileName: string;
};

/**
 *
 * @param folderPath the folder that contains the CSV data
 * @param callBackErr call back fucntion to invoke in case of error
 * @returns the tables that was either succeeded or failed in the target folder
 */
export const dbUpdate_fromCSV = async (
	folderPath: string,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: { failed: string[]; succeeded: string[] }[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> => {
	try {
		console.log('updating database');
		let failed: string[] = [];
		let succeeded: string[] = [];
		for (let i = 0; i < allowedBulkUploadTables.length; ) {
			console.log(i);
			const file = allowedBulkUploadTables[i];
			console.log(`${file.schemaName}-${file.tableName}.csv`);
			if (
				existsSync(
					path.join(folderPath, `${file.schemaName}-${file.tableName}.csv`)
				)
			) {
				console.log(`found ${file.schemaName}-${file.tableName}.csv`);
				const getColumns = await getTableColumnsFromDatabase(
					file.schemaName,
					file.tableName
				);
				if (!getColumns.err) {
					const { columnsNammeString, createColumnsString } = getColumns;
					const { schemaName, tableName } = file;
					await insertDataFromCSVtoDB(
						createColumnsString,
						columnsNammeString,
						schemaName,
						tableName,
						folderPath
						// conn
					)
						.then((res) => {
							if (res) {
								succeeded.push(tableName);
							} else {
								failed.push(tableName);
							}
							console.log(
								`updating ${tableName} ${res ? 'succeeded' : 'failed'}`
							);
						})
						.catch((err) => {
							failed.push(tableName);
							console.log(err);
						})
						.then(() => i++)
						.catch((err) => {
							console.error(`updating ${tableName} failed:${err}`);
							i++;
						});
				}
			} else {
				i++;
			}
		}
		return {
			feedback: LocalAConfig.serviceStatus.success,
			enteries: 0,
			data: [{ failed: failed, succeeded: succeeded }],
		};
	} catch (error) {
		if (callBackErr) {
			callBackErr(error as Error);
			console.log(error);
			return {
				feedback: LocalAConfig.serviceStatus.failed,
				enteries: 0,
				data: error as Error,
			};
		} else {
			console.log(`Error: ${error}`);
			return {
				feedback: LocalAConfig.serviceStatus.failed,
				enteries: 0,
				data: error as Error,
			};
		}
	}
};

/**
 *
 * @param schemaName string
 * @param tableName string
 * @param res send a template CSF to the client to facilitate uploading the data
 */
export const creatTemplateCSVFile = async (
	schemaName: string,
	tableName: string,
	res: Response,
	callBackErr?: Function
) => {
	try {
		const getColumns = await getTableColumnsFromDatabase(schemaName, tableName);
		const tempFolderPath = path.join(
			__dirname,
			'../../application_files',
			'temp'
		);
		const tempFilePath = path.join(
			tempFolderPath,
			`${schemaName}-${tableName}.csv`
		);
		if (!getColumns.err) {
			const { columnsNammeString, udtNameValues } = getColumns;
			if (!existsSync(tempFolderPath)) {
				mkdirSync(tempFolderPath, { recursive: true });
			}
			const exportTempTableSQL = `COPY (SELECT ${columnsNammeString} FROM ${schemaName}.${tableName} LIMIT 0) TO '${tempFilePath}' DELIMITER ',' CSV HEADER ENCODING 'UTF-8'`;
			const conn = await client.connect();
			await conn.query(exportTempTableSQL);
			conn.release();
			appendFileSync(tempFilePath, udtNameValues, 'utf-8');
			// send file;
			res.status(200).download(tempFilePath, (err) => {
				if (!err) {
					if (existsSync(tempFilePath)) unlinkSync(tempFilePath);
				}
			});
		}
	} catch (error) {
		{
			if (callBackErr) {
				callBackErr(error as Error);
				return {
					feedback: serviceStatus.failed,
					entCount: 0,
					data: error as Error,
				};
			} else
				sendServerError(
					res,
					{ accessToken: '', data: {}, action: serviceAction.failed },
					error as Error
				);
		}
	}
};
