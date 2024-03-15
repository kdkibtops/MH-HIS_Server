import { dataTypesEntry } from './../TypesTrial/RequestTypes';
import { dataTypes } from '../TypesTrial/RequestTypes';
import { DBTablesMap, serviceStatus } from '../config/LocalConfiguration';
import { SELECTSQLQUERY } from '../helpers/filtersSQL';
import { numberMatch, stringMatch, stringORNull } from '../config/types';
import getPGClient from '../getPGClient';
function createSearchFunction(tableName: string): Function {
	const searchFunction = async (
		entry: dataTypesEntry,
		callBackErr?: Function,
		match?: '=',
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
			const filterColumn = unusualPrimaryKey
				? unusualPrimaryKey
				: DBTablesMap[tableName as keyof typeof DBTablesMap].UID_Column;
			if (filterColumn) {
				const filterValue = entry[filterColumn as keyof typeof entry];
				const SQL = new SELECTSQLQUERY();
				SQL.SELECT(
					{ tablesNames: tableName, columnsNames: '*', asColumnsName: null },
					schemaName,
					tableName
				).String_WHERE_SingleColumnSingleValue(
					[tableName],
					[filterColumn],
					[filterValue],
					[match ? match : '=']
				);
				const sql = SQL.BUILDSQL();
				console.log('Seaarch sql:');
				console.log(sql[0]);
				const result = await getPGClient(sql[0], [], new Error().stack);
				const res = await getPGClient(sql[1], [], new Error().stack);
				const entCount = res ? res.rowCount : 0;
				return {
					feedback: serviceStatus.success,
					entCount: entCount,
					data: result ? result.rows : [],
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
