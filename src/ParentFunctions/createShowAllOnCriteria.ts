import { dataTypes } from '../TypesTrial/RequestTypes';
import { LocalAConfig, serviceStatus } from '../config/LocalConfiguration';
import {
	GROUPBYObject,
	JOINObject,
	REQBODY,
	SEARCHCRITERIA,
	aggregationMETHOD,
	joinDirection,
	newSEARCHCRITERIA,
	tableObject,
} from '../config/types';
import client from '../database';
import { createSQLshowAll } from '../helpers/createSQLString';
import {
	SELECTSQLQUERY,
	legacy_trialAddFilterSQL,
} from '../helpers/filtersSQL';

function createShowAllOnCriteriaFunction(tableName: string): Function {
	const showAllOnCriteria = async (
		criteria: newSEARCHCRITERIA,
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
			const sqlQuery = new SELECTSQLQUERY();
			let tableObject!: tableObject;
			let GROUPBYObject!: GROUPBYObject;
			let JOINObjects!: JOINObject[];
			switch (tableName) {
				case 'studies':
					tableObject = {
						use: true,
						columns: {
							tablesNames: [
								'studies',
								'studies',
								'studies',
								'studies',
								'studies',
								'studies',
								'studies',
								'studies',
							],
							columnsNames: [
								'ind',
								'study_id',
								'modality',
								'study_name',
								'arabic_name',
								'price',
								'last_update',
								'updated_by',
							],
							asColumnsName: [
								'studies_ind',
								'study_id',
								'modality',
								'study_name',
								'arabic_name',
								'price',
								'last_update',
								'updated_by',
								'average_radiation_dose',
							],
						},
						FROMschemaName: 'main',
						FROMtableName: 'studies',
					};
					GROUPBYObject = {
						use: true,
						aggregationMETHOD: 'AVG',
						aggregationTable: 'orders',
						aggregationColumn: 'radiation_dose',
						groupBYtableName: 'studies',
						groupBYcolumnName: 'study_id',
						asColumnName: 'average_radiation_dose',
					};
					JOINObjects = [
						{
							use: true,
							joinDirection: 'LEFT',
							table2SchemaName: 'main',
							table2Name: 'orders',
							table1Fkey: 'study_id',
							table2FKey: 'study_id',
						},
					];
					break;
				case 'orders':
					tableObject = {
						use: true,
						columns: {
							tablesNames: [
								'orders',
								'orders',
								'patients',
								'studies',
								'studies',
								'studies',
								'studies',
								'studies',
							],
							columnsNames: [
								'*',
								'ind',
								'*',
								'study_id',
								'study_name',
								'arabic_name',
								'modality',
								'price',
							],
							asColumnsName: [
								null,
								'orders_ind',
								null,
								null,
								null,
								null,
								null,
								null,
							],
						},
						FROMschemaName: 'main',
						FROMtableName: 'orders',
					};
					JOINObjects = [
						{
							use: true,
							joinDirection: 'LEFT',
							table2SchemaName: 'main',
							table2Name: 'patients',
							table1Fkey: 'mrn',
							table2FKey: 'mrn',
						},
						{
							use: true,
							joinDirection: 'LEFT',
							table2SchemaName: 'main',
							table2Name: 'studies',
							table1Fkey: 'study_id',
							table2FKey: 'study_id',
						},
					];
					break;
				case 'patients':
					tableObject = {
						use: true,
						columns: {
							tablesNames: [
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
								'patients',
							],
							columnsNames: [
								'ind',
								'mrn',
								'patient_name',
								'national_id',
								'age',
								'dob',
								'gender',
								'contacts',
								'email',
								'updated_by',
								'last_update',
							],
							asColumnsName: [
								'patients_ind',
								'mrn',
								'patient_name',
								'national_id',
								'age',
								'dob',
								'gender',
								'contacts',
								'email',
								'updated_by',
								'last_update',
							],
						},
						FROMschemaName: 'main',
						FROMtableName: 'patients',
					};
					GROUPBYObject = {
						use: true,
						aggregationMETHOD: 'SUM',
						aggregationTable: 'orders',
						aggregationColumn: 'radiation_dose',
						groupBYtableName: 'patients',
						groupBYcolumnName: 'mrn',
						asColumnName: 'cumulative_dose',
					};
					JOINObjects = [
						{
							use: true,
							joinDirection: 'LEFT',
							table2SchemaName: 'main',
							table2Name: 'orders',
							table1Fkey: 'mrn',
							table2FKey: 'mrn',
						},
					];
					break;
				case 'users':
					tableObject = {
						use: true,
						columns: {
							tablesNames: [
								'users',
								'users',
								'users',
								'users',
								'users',
								'users',
								'users',
								'users',
							],
							columnsNames: [
								'ind',
								'user_id',
								'username',
								'full_name',
								'user_role',
								'job',
								'email',
								'last_update',
							],
							asColumnsName: [
								'users_ind',
								'user_id',
								'username',
								'full_name',
								'user_role',
								'job',
								'email',
								'last_update',
							],
						},
						FROMschemaName: 'main',
						FROMtableName: 'users',
					};
					GROUPBYObject = {
						use: true,
						aggregationMETHOD: 'COUNT',
						aggregationTable: 'orders',
						aggregationColumn: 'radiologist',
						groupBYtableName: 'users',
						groupBYcolumnName: 'username',
						asColumnName: 'reports_count',
					};
					JOINObjects = [
						{
							use: true,
							joinDirection: 'LEFT',
							table2SchemaName: 'main',
							table2Name: 'orders',
							table1Fkey: 'username',
							table2FKey: 'radiologist',
						},
					];
					break;
			}
			tableObject &&
				sqlQuery.SELECT(
					tableObject.columns,
					tableObject.FROMschemaName,
					tableObject.FROMtableName
				);
			JOINObjects &&
				JOINObjects.forEach((JOINObject) => {
					JOINObject.use &&
						sqlQuery.JOIN(
							JOINObject.joinDirection as joinDirection,
							JOINObject.table2SchemaName,
							JOINObject.table2Name,
							JOINObject.table1Fkey,
							JOINObject.table2FKey
						);
				});
			GROUPBYObject &&
				GROUPBYObject.use &&
				sqlQuery.GROUPBY(
					GROUPBYObject.aggregationMETHOD as aggregationMETHOD,
					GROUPBYObject.aggregationTable,
					GROUPBYObject.aggregationColumn,
					GROUPBYObject.asColumnName,
					GROUPBYObject.groupBYtableName,
					GROUPBYObject.groupBYcolumnName
				);
			const filters =
				criteria.otherFilters &&
				criteria.otherFilters.filter(
					(f) =>
						f.checked &&
						f.multipleColumns.length > 0 &&
						f.multipleValues.length > 0
				);

			if (filters) {
				filters.forEach((filt, ind) => {
					switch (filt.type) {
						case 'string':
							sqlQuery[`${filt.WHEREStatement}`](
								filt.tablesName,
								filt.multipleColumns,
								filt.multipleValues,
								filt.match
							);
							break;
						case 'number':
							sqlQuery[`${filt.WHEREStatement}`](
								filt.tablesName,
								filt.multipleColumns,
								filt.multipleValues,
								filt.match
							);
							break;
						case 'date':
							//Process data first as dates before doing the query
							const processedDates = filt.multipleValues.map(
								(d) =>
									`${new Date(d).getFullYear()}-${
										new Date(d).getMonth() + 1
									}-${new Date(d).getDate()}`
							);
							sqlQuery[`${filt.WHEREStatement}`](
								filt.tablesName,
								filt.multipleColumns,
								processedDates,
								filt.match
							);
							break;
					}
					if (ind < filters.length - 1) {
						console.log(filt.next);
						if (filt.next === 'AND') sqlQuery.AND_in_WHERE_statement();
						if (filt.next === 'OR') sqlQuery.OR_in_WHERE_statement();
					}
				});
			}
			criteria.lastEntryInd &&
				sqlQuery
					.AND_in_WHERE_statement()
					.Number_WHERE_SingleColumnSingleValue(
						[tableName],
						['ind'],
						[criteria.lastEntryInd],
						['<']
					);
			// console.log(`Last Entry Index = ${criteria.lastEntryInd}`);
			criteria.LIMIT &&
				sqlQuery.LIMIT(criteria.LIMIT).ORDERBY(tableName, 'ind', 'DESC');

			let indexKey = tableObject.columns.asColumnsName[0]
				? tableObject.columns.asColumnsName[0]
				: '';
			const SQL = sqlQuery.BUILDSQL();
			if (SQL) {
				console.log(SQL);
				const conn = await client.connect();
				const result = await conn.query(SQL);
				conn.release();
				const updatedArr = result.rows.map((r) => {
					return { ...r, ind: r[indexKey] };
				});
				return {
					feedback: LocalAConfig.serviceStatus.success,
					enteries: result.rowCount,
					data: updatedArr,
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(
						`Can't create showAllOnCriteria function for ${tableName}`
					);
					return {
						feedback: LocalAConfig.serviceStatus.failed,
						enteries: 0,
						data: new Error(
							`Can't create showAllOnCriteria function for ${tableName}`
						),
					};
				})();
			}
		} catch (error) {
			console.log(error);
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
	return showAllOnCriteria;
}
export default createShowAllOnCriteriaFunction;

function legacy_createShowAllOnCriteriaFunction(tableName: string): Function {
	const showAllOnCriteria = async (
		criteria: SEARCHCRITERIA,
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
			let indexKey: string;
			let SQL: string | null;
			switch (tableName) {
				case 'main.studies':
					indexKey = 'studies_ind';
					SQL = createSQLshowAll(
						'main.studies',
						[
							'main.studies.ind',
							'main.studies.study_id',
							'main.studies.modality',
							'main.studies.study_name',
							'main.studies.arabic_name',
							'main.studies.price',
							'main.studies.last_update',
							'main.studies.updated_by',
							'AVG (main.orders.radiation_dose)',
						],
						undefined,
						[
							'studies_ind',
							'study_id',
							'modality',
							'study_name',
							'arabic_name',
							'price',
							'last_update',
							'updated_by',
							'average_radiation_dose',
						]
					);
					SQL += `
                    LEFT JOIN main.orders 
                    ON main.orders.study_id=main.studies.study_id 
                    `;
					// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
					// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
					SQL += criteria.lastEntryInd
						? ` WHERE main.studies.ind < ${criteria.lastEntryInd} 
            `
						: '';
					const filterStudies =
						criteria.otherFilters &&
						criteria.otherFilters.filter((f) => f.checked);
					if (filterStudies) {
						// addFiltersSql(filterStudies, criteria.lastEntryInd)?.forEach(
						// 	(sql) => (SQL += sql)
						// );
						SQL += legacy_trialAddFilterSQL(
							filterStudies,
							criteria.lastEntryInd
						);
					}
					SQL += `
                            GROUP BY main.studies.study_id
                            ORDER BY studies.ind DESC
                    `;
					if (criteria.LIMIT) {
						SQL += `LIMIT ${criteria.LIMIT} `;
					}

					break;
				case 'main.orders':
					indexKey = 'orders_ind';
					SQL = createSQLshowAll(
						'main.orders',
						[
							'main.orders.*',
							'main.orders.ind',
							'main.patients.*',
							'main.studies.study_id',
							'main.studies.study_name',
							'main.studies.arabic_name',
							'main.studies.modality',
							'main.studies.price',
						],
						undefined,
						[null, 'orders_ind', null, null, null, null, null, null]
					);
					SQL += ` 
            LEFT JOIN main.patients
            ON main.patients.mrn = main.orders.mrn 
            `;
					SQL += `LEFT JOIN main.studies
            ON main.studies.study_id = main.orders.study_id
            `;
					// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
					// Becasuse order are orderd in descending order according to the ind so I am using less than operator instead of greater than
					SQL += criteria.lastEntryInd
						? `WHERE main.orders.ind< ${criteria.lastEntryInd} 
            `
						: '';
					const filterOrders =
						criteria.otherFilters &&
						criteria.otherFilters.filter((f) => f.checked);
					if (filterOrders) {
						// addFiltersSql(filterOrders, criteria.lastEntryInd)?.forEach(
						// 	(sql) => {
						// 		SQL += sql;
						// 	}
						// );
						SQL += legacy_trialAddFilterSQL(
							filterOrders,
							criteria.lastEntryInd
						);
					}

					SQL += `ORDER BY orders.ind DESC 
            `;
					if (criteria.LIMIT) {
						SQL += `LIMIT ${criteria.LIMIT} `;
					}

					const newSQL = (SQL.split('FROM')[0] +=
						`,main.studies.updated_by AS study_updated_by FROM` +
						SQL.split('FROM')[1]);

					break;
				case 'main.patients':
					indexKey = 'patients_ind';
					SQL = createSQLshowAll(
						'main.patients',
						[
							'main.patients.ind',
							'main.patients.mrn',
							'main.patients.patient_name',
							'main.patients.national_id',
							'main.patients.age',
							'main.patients.dob',
							'main.patients.gender',
							'main.patients.contacts',
							'main.patients.email',
							'main.patients.updated_by',
							'main.patients.last_update',
							'SUM(main.orders.radiation_dose)',
						],
						undefined,
						[
							'patients_ind',
							'mrn',
							'patient_name',
							'national_id',
							'age',
							'dob',
							'gender',
							'contacts',
							'email',
							'updated_by',
							'last_update',
							'cumulative_dose',
						]
					);
					SQL += `
                    LEFT JOIN main.orders 
                    ON main.orders.mrn=main.patients.mrn 
                    `;
					// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
					// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
					SQL += criteria.lastEntryInd
						? ` WHERE main.patients.ind < ${criteria.lastEntryInd} 
            `
						: '';

					const filterPatients =
						criteria.otherFilters &&
						criteria.otherFilters.filter((f) => f.checked);
					if (filterPatients) {
						// addFiltersSql(filterPatients, criteria.lastEntryInd)?.forEach(
						// 	(sql) => (SQL += sql)
						// );
						SQL += legacy_trialAddFilterSQL(
							filterPatients,
							criteria.lastEntryInd
						);
					}
					SQL += `
                    GROUP BY main.patients.mrn
                    ORDER BY patients.ind DESC 
            `;
					if (criteria.LIMIT) {
						SQL += `LIMIT ${criteria.LIMIT} `;
					}
					break;
				case 'main.users':
					indexKey = 'users_ind';
					SQL = createSQLshowAll(
						'main.users',
						[
							'main.users.ind',
							'main.users.user_id',
							'main.users.username',
							'main.users.full_name',
							'main.users.user_role',
							'main.users.job',
							'main.users.email',
							// 'main.users.user_config',
							// 'main.users.uploads',
							'main.users.last_update',
							'COUNT(main.orders.radiologist)',
						],
						undefined,
						[
							'users_ind',
							'user_id',
							'username',
							'full_name',
							'user_role',
							'job',
							'email',
							// 'user_config',
							// 'uploads',
							'last_update',
							'reports_count',
						]
					);

					// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
					// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
					// no need for last entry index here because we need to get all users each time
					// 		SQL += criteria.lastEntryInd
					// 			? ` WHERE main.users.ind < ${criteria.lastEntryInd}
					// `
					// 			: '';
					// I will use left join to get all users even if they don't have reports
					SQL += `
            LEFT JOIN main.orders
            ON main.orders.radiologist=main.users.username
            `;
					// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
					// Becasuse order are orderd in descending order according to the ind so I am using less than operator instead of greater than
					SQL += criteria.lastEntryInd
						? `WHERE main.orders.ind< ${criteria.lastEntryInd} 
            `
						: '';
					const filterUsers =
						criteria.otherFilters &&
						criteria.otherFilters.filter((f) => f.checked);
					if (filterUsers) {
						// addFiltersSql(filterUsers, criteria.lastEntryInd)?.forEach(
						// 	(sql) => (SQL += sql)
						// );
						SQL += legacy_trialAddFilterSQL(filterUsers, criteria.lastEntryInd);
					}
					SQL += `
                        GROUP BY main.users.username
                        ORDER BY users.ind DESC
                `;
					if (criteria.LIMIT) {
						SQL += `LIMIT ${criteria.LIMIT} `;
					}
					break;
				default:
					SQL = null;
					break;
			}
			if (SQL) {
				console.log(SQL);
				const conn = await client.connect();
				const result = await conn.query(SQL);
				conn.release();

				const updatedArr = result.rows.map((r) => {
					return { ...r, ind: r[indexKey] };
				});
				return {
					feedback: LocalAConfig.serviceStatus.success,
					enteries: result.rowCount,
					data: updatedArr,
				};
			} else {
				// wE SHOULD NOT REACH THIS POINT, SO IT IS WRITTEN ONLY TO AVOID RETURN ERRORS
				return (() => {
					console.error(
						`Can't create showAllOnCriteria function for ${tableName}`
					);
					return {
						feedback: LocalAConfig.serviceStatus.failed,
						enteries: 0,
						data: new Error(
							`Can't create showAllOnCriteria function for ${tableName}`
						),
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
	return showAllOnCriteria;
}
