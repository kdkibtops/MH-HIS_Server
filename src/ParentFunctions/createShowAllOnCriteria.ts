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
import getPGClient from '../getPGClient';
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
								'patients',
								'patients',
								'patients',
							],
							columnsNames: [
								'ind',
								'mrn',
								'rank',
								'category',
								'status',
								'patient_name',
								'national_id',
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
								null,
								null,
								null,
								'patient_name',
								'national_id',
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
			criteria.LIMIT &&
				sqlQuery.LIMIT(criteria.LIMIT).ORDERBY(tableName, 'ind', 'DESC');

			let indexKey = tableObject.columns.asColumnsName[0]
				? tableObject.columns.asColumnsName[0]
				: '';
			const SQL = sqlQuery.BUILDSQL();
			if (SQL) {
				console.log(SQL[0]);
				const result = await getPGClient(SQL[0], [], new Error().stack);
				const res = await getPGClient(SQL[1], [], new Error().stack);
				const entCount = res ? res.rowCount : 0;
				const updatedArr = result
					? result.rows.map((r) => {
							return { ...r, ind: r[indexKey] };
					  })
					: [];
				return {
					feedback: LocalAConfig.serviceStatus.success,
					entCount: entCount,
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
						entCount: 0,
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
	return showAllOnCriteria;
}
export default createShowAllOnCriteriaFunction;
