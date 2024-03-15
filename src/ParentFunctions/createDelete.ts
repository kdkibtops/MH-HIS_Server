import { dataTypes, dataTypesEntry } from '../TypesTrial/RequestTypes';
import { DBTablesMap, serviceStatus } from '../config/LocalConfiguration';
import client from '../database';
import getPGClient from '../getPGClient';
import { createSQLdelete } from '../helpers/createSQLString';

function createDeleteFunction(tableName: string): Function {
	const deleteFunction = async (
		entry: dataTypesEntry,
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
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			const filterColumn = unusualPrimaryKey
				? unusualPrimaryKey
				: DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			if (filterColumn) {
				const filterValue = entry[filterColumn as keyof typeof entry];
				const SQL = createSQLdelete(
					`${schemaName}.${tableName}`,
					filterColumn,
					filterValue
				);
				const result = await getPGClient(SQL, [], new Error().stack);
				return {
					feedback: serviceStatus.success,
					entCount: result ? result.rowCount : 0,
					data: result ? result.rows : [],
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(`Can't create delete function for ${tableName}`);
					return {
						feedback: serviceStatus.failed,
						entCount: 0,
						data: new Error(`Can't create delete function for ${tableName}`),
					};
				})();
			}
		} catch (error) {
			if (callBackErr) {
				callBackErr(error as Error);
				return {
					feedback: serviceStatus.failed,
					entCount: 0,
					data: error as Error,
				};
			} else {
				console.log(`Error: ${error}`);
				return {
					feedback: serviceStatus.failed,
					entCount: 0,
					data: error as Error,
				};
			}
		}
	};
	return deleteFunction;
}
export default createDeleteFunction;
