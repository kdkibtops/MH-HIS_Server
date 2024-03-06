import { ORDER } from '../Models/Orders';
import { PATIENT } from '../Models/Patients';
import { STUDY } from '../Models/Studies';
import { USER } from '../Models/Users';
import { dataTypes } from '../TypesTrial/RequestTypes';
import {
	DBTablesMap,
	LocalAConfig,
	serviceStatus,
} from '../config/LocalConfiguration';
import { getDateInEgypt } from '../config/getDate';
import { REQBODY } from '../config/types';
import client from '../database';
import { createSQLupdate } from '../helpers/createSQLString';

function createUpdateFunction(tableName: string): Function {
	const updateFunction = async (
		reqBody: REQBODY,
		callBackErr?: Function
	): Promise<
		| {
				feedback: serviceStatus.success;
				enteries: number;
				data: dataTypes;
		  }
		| {
				feedback: serviceStatus.failed;
				enteries: 0;
				data: Error;
		  }
	> => {
		try {
			let originalEntry;
			let entry;
			let primaryKey;
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			const filterColumn =
				DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			switch (`${schemaName}.${tableName}`) {
				case 'main.studies':
					originalEntry = reqBody.studies;
					entry = new STUDY(originalEntry);
					primaryKey = originalEntry.primaryKey;
					break;
				case 'main.orders':
					originalEntry = reqBody.orders;
					entry = new ORDER(originalEntry);
					primaryKey = originalEntry.primaryKey;

					break;
				case 'main.patients':
					originalEntry = reqBody.patients;
					entry = new PATIENT(originalEntry);
					primaryKey = originalEntry.primaryKey;
					break;
				case 'main.users':
					originalEntry = reqBody.users;
					entry = new USER(originalEntry);
					primaryKey = originalEntry.primaryKey;
					break;
				default:
					originalEntry = null;
					entry = null;
					break;
			}
			if (entry && originalEntry && filterColumn) {
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
				columnNames.push('last_update');
				values.push(getDateInEgypt());
				const SQL = createSQLupdate(
					`${schemaName}.${tableName}`,
					columnNames,
					values,
					filterColumn,
					primaryKey ? primaryKey : entry[filterColumn as keyof typeof entry]
				);
				const conn = await client.connect();
				const result = await conn.query(SQL);
				console.log(SQL);
				conn.release();
				return {
					feedback: LocalAConfig.serviceStatus.success,
					enteries: result.rowCount,
					data: result.rows,
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(`Can't create update function for ${tableName}`);
					return {
						feedback: LocalAConfig.serviceStatus.failed,
						enteries: 0,
						data: new Error(`Can't create update function for ${tableName}`),
					};
				})();
			}
		} catch (error) {
			if (callBackErr) {
				callBackErr(error as Error);
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
	return updateFunction;
}
export default createUpdateFunction;
