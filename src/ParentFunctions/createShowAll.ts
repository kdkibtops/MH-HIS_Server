import { dataTypes } from '../TypesTrial/RequestTypes';
import { DBTablesMap, serviceStatus } from '../config/LocalConfiguration';
import client from '../database';
import { createSQLshowAll } from '../helpers/createSQLString';

function createShowAllFunction(tableName: string): Function {
	const showAllFunction = async (
		limited: boolean,
		callBackErr?: Function
	): Promise<
		| {
				feedback: serviceStatus.success;
				enteries: number;
				data: dataTypes | unknown[];
		  }
		| {
				feedback: serviceStatus.failed;
				enteries: 0;
				data: Error;
		  }
	> => {
		try {
			let columnsArr: string[] = [];
			let limitedArr: string[];
			let extraSQL = ''; //use to write any extra sql we need
			const schemaName =
				DBTablesMap[tableName as keyof typeof DBTablesMap].shcema;
			switch (tableName) {
				case 'studies':
					limitedArr = [
						'study_id',
						'modality',
						'study_name',
						'arabic_name',
						'price',
					];
					break;
				case 'orders':
					limitedArr = ['order_id', 'radiologist'];
					extraSQL = `
					 LEFT JOIN main.patients
					ON main.patients.mrn = main.orders.mrn
					LEFT JOIN main.studies
					ON main.studies.study_id = main.orders.study
					ORDER BY o_date DESC LIMIT 50`;
					break;
				case 'patients':
					limitedArr = ['patient_name', 'mrn', 'national_id'];
					break;
				case 'users':
					columnsArr = [
						'user_id',
						'username',
						'user_role',
						'job',
						'email',
						'full_name',
					];
					limitedArr = ['user_id', 'full_name', 'username', 'user_role', 'job'];
					break;
				case 'procedures':
					columnsArr = [
						'procedure_id',
						'procedure_name',
						'laboratory',
						'imaging',
						'recommended_material',
						'paperwork',
						'updated_by',
						'last_update',
					];
					limitedArr = ['procedure_id', 'procedure_name'];
					extraSQL = ``;
				default:
					break;
			}
			const SQL = createSQLshowAll(`${schemaName}.${tableName}`, columnsArr);
			const conn = await client.connect();
			const result = await conn.query(SQL);
			conn.release();

			if (limited) {
				return {
					feedback: serviceStatus.success,
					enteries: result.rowCount,
					// create new object with the limited keys needed
					data: result.rows.map((entry) => {
						return limitedArr.reduce((accumulator, key) => {
							return { ...accumulator, [key]: entry[key] };
						}, {});
					}),
				};
			} else {
				return {
					feedback: serviceStatus.success,
					enteries: result.rowCount,
					data: result.rows,
				};
			}
		} catch (error) {
			if (callBackErr) {
				callBackErr(error as Error);
				return {
					feedback: serviceStatus.failed,
					enteries: 0,
					data: error as Error,
				};
			} else {
				console.log(`Error: ${error}`);
				return {
					feedback: serviceStatus.failed,
					enteries: 0,
					data: error as Error,
				};
			}
		}
	};
	return showAllFunction;
}
export default createShowAllFunction;
