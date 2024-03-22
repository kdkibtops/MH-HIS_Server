import { ORDER } from '../Models/Orders';
import { PATIENT } from '../Models/Patients';
import { PROCEDURE } from '../Models/Procedures';
import { STUDY } from '../Models/Studies';
import { USER } from '../Models/Users';
import { dataTypes } from '../TypesTrial/RequestTypes';
import {
	DBTablesMap,
	JSONData,
	LocalAConfig,
	UID_Columns,
	serviceStatus,
} from '../config/LocalConfiguration';
import { getDateInEgypt } from '../config/getDate';
import { REQBODY } from '../config/types';
import getPGClient from '../getPGClient';
import { createSQLinsert } from '../helpers/createSQLString';

function createInsertFunction(tableName: string): Function {
	const createFunction = async (
		reqBody: REQBODY,
		callBackErr?: Function
	): Promise<
		| {
				feedback: serviceStatus.success;
				entCount: number;
				data: dataTypes;
		  }
		| {
				feedback: serviceStatus.failed;
				entCount: 0;
				data: Error;
		  }
	> => {
		try {
			let originalEntry;
			let entry;
			switch (tableName) {
				case 'studies':
					originalEntry = reqBody.studies;
					entry = new STUDY(originalEntry);
					break;
				case 'orders':
					originalEntry = reqBody.orders;
					entry = new ORDER(originalEntry);
					break;
				case 'patients':
					originalEntry = reqBody.patients;
					entry = new PATIENT(originalEntry);
					break;
				case 'users':
					originalEntry = reqBody.users;
					entry = new USER(originalEntry);
					break;
				case 'procedures':
					originalEntry = reqBody.procedure;
					entry = new PROCEDURE(originalEntry);
					break;
				default:
					originalEntry = null;
					entry = null;
					break;
			}
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			if (entry && originalEntry) {
				for (const i in entry) {
					if (
						!entry[i as keyof typeof entry] ||
						entry[i as keyof typeof entry] === ''
					) {
						delete entry[i as keyof typeof entry];
					}
				}
				const columnNames = Object.keys(entry);
				const values = Object.values(entry);
				// Stringify all JSON columns before inserting
				columnNames.forEach((col, index) => {
					if (JSONData.includes(col)) {
						values[index] = JSON.stringify(values[index]);
						// convert all UID columns to lower case before inserting
					} else if (UID_Columns.includes(col)) {
						values[index] = values[index].toLowerCase();
					}
				});
				columnNames.push('last_update');
				values.push(getDateInEgypt());
				const SQL = createSQLinsert(
					`${schemaName}.${tableName}`,
					columnNames,
					values
				);
				console.log(SQL);
				const result = await getPGClient(SQL, [], new Error().stack);
				return {
					feedback: LocalAConfig.serviceStatus.success,
					entCount: result?.rowCount || 0,
					data: result ? result.rows : [],
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(`Can't create insert function for ${tableName}`);
					return {
						feedback: LocalAConfig.serviceStatus.failed,
						entCount: 0,
						data: new Error(`Can't create insert function for ${tableName}`),
					};
				})();
			}
		} catch (error) {
			if (callBackErr) {
				callBackErr(error as Error);
				return {
					feedback: LocalAConfig.serviceStatus.failed,
					entCount: 0,
					data: error as Error,
				};
			} else {
				console.log(`Error: ${error}`);
				return {
					feedback: LocalAConfig.serviceStatus.failed,
					entCount: 0,
					data: error as Error,
				};
			}
		}
	};
	return createFunction;
}

export default createInsertFunction;
