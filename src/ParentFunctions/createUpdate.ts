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
import getPGClient from '../getPGClient';
import { createSQLupdate } from '../helpers/createSQLString';

function createUpdateFunction(tableName: string): Function {
	const updateFunction = async (
		reqBody: REQBODY,
		callBackErr?: Function,
		unusualPrimaryKey?: string
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

			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			const filterColumn = unusualPrimaryKey
				? unusualPrimaryKey
				: DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			const createEntry = () => {
				switch (`${schemaName}.${tableName}`) {
					case 'main.studies':
						originalEntry = reqBody.studies;
						return new STUDY(originalEntry);
					case 'main.orders':
						originalEntry = reqBody.orders;
						return new ORDER(originalEntry);
					case 'main.patients':
						originalEntry = reqBody.patients;
						return new PATIENT(originalEntry);
					case 'main.users':
						originalEntry = reqBody.users;
						return new USER(originalEntry);
					default:
						return null;
				}
			};
			const entry = createEntry();

			if (entry && originalEntry && filterColumn) {
				const columnNames = Object.keys(entry).filter(
					(col) =>
						col !== 'ind' &&
						entry[col as keyof typeof entry] !== ('' || (undefined as unknown))
				);
				const values = Object.keys(entry)
					.filter(
						(col) =>
							col !== 'ind' &&
							entry[col as keyof typeof entry] !==
								('' || (undefined as unknown))
					)
					.map((col) => entry[col as keyof typeof entry]) as unknown[];
				columnNames.push('last_update');
				values.push(getDateInEgypt());
				const SQL = createSQLupdate(
					`${schemaName}.${tableName}`,
					columnNames,
					values as string[],
					filterColumn,
					entry[filterColumn as keyof typeof entry]
				);
				console.log(originalEntry);
				console.log(entry);
				const result = await getPGClient(SQL, [], new Error().stack);
				return {
					feedback: LocalAConfig.serviceStatus.success,
					entCount: result ? result.rowCount : 0,
					data: result ? result.rows : [],
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(`Can't create update function for ${tableName}`);
					return {
						feedback: LocalAConfig.serviceStatus.failed,
						entCount: 0,
						data: new Error(`Can't create update function for ${tableName}`),
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
	return updateFunction;
}
export default createUpdateFunction;
