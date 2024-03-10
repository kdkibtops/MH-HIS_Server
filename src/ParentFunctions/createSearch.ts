import { dataTypesEntry } from './../TypesTrial/RequestTypes';
import { dataTypes } from '../TypesTrial/RequestTypes';
import { DBTablesMap, serviceStatus } from '../config/LocalConfiguration';
import { createSQLshowOneOnly } from '../helpers/createSQLString';
import client from '../database';
import { SELECTSQLQUERY } from '../helpers/filtersSQL';
import { stringMatch, stringORNull } from '../config/types';
function createSearchFunction(tableName: string): Function {
	const searchFunction = async (
		entry: dataTypesEntry,
		callBackErr?: Function,
		match?: stringMatch
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
			let columns: {
				tablesNames: string[];
				columnsNames: string[];
				asColumnsName: stringORNull[];
			};
			switch (tableName) {
				case 'main.users':
					columns = {
						tablesNames: [
							'main',
							'main',
							'main',
							'main',
							'main',
							'main',
							'main',
							'main',
							'main',
							'main',
						],

						columnsNames: [
							'ind',
							'user_id',
							'username',
							'email',
							'job',
							'user_role',
							'full_name',
							'last_update',
							'user_config',
							'uploads',
						],
						asColumnsName: [null],
					};

					break;
				default:
					break;
			}
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			const filterColumn =
				DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			if (filterColumn) {
				const filterValue = entry.primaryKey
					? entry.primaryKey
					: (entry[filterColumn as keyof typeof entry] as string);
				const SQL = new SELECTSQLQUERY();
				SQL.SELECT(
					{ tablesNames: tableName, columnsNames: '*', asColumnsName: null },
					schemaName,
					tableName
				).String_WHERE_SingleColumnSingleValue(
					[tableName],
					[filterColumn],
					[filterValue],
					[match ? match : 'exactMatchAll']
				);
				const sql = SQL.BUILDSQL();
				const conn = await client.connect();
				const result = await conn.query(sql[0]);
				const entCount = (await conn.query(sql[1])).rowCount;
				conn.release();
				return {
					feedback: serviceStatus.success,
					entCount: entCount,
					data: result.rows,
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(`Can't create search function for ${tableName}`);
					return {
						feedback: serviceStatus.failed,
						entCount: 0,
						data: new Error(`Can't create search function for ${tableName}`),
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
	return searchFunction;
}

export default createSearchFunction;
