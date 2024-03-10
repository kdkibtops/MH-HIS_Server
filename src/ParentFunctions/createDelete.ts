import { dataTypes, dataTypesEntry } from '../TypesTrial/RequestTypes';
import { DBTablesMap, serviceStatus } from '../config/LocalConfiguration';
import client from '../database';
import { createSQLdelete } from '../helpers/createSQLString';

function createDeleteFunction(tableName: string): Function {
	const deleteFunction = async (
		entry: dataTypesEntry,
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
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			const filterColumn =
				DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			if (filterColumn) {
				const filterValue = entry.primaryKey
					? entry.primaryKey
					: (entry[filterColumn as keyof typeof entry] as string);
				const SQL = createSQLdelete(
					`${schemaName}.${tableName}`,
					filterColumn,
					filterValue
				);
				const conn = await client.connect();
				const result = await conn.query(SQL);
				conn.release();
				return {
					feedback: serviceStatus.success,
					entCount: result.rowCount,
					data: result.rows,
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
