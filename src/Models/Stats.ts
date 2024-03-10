import createShowAllOnCriteriaFunction from '../ParentFunctions/createShowAllOnCriteria';
import {
	DBTablesMap,
	LocalAConfig,
	serviceStatus,
} from '../config/LocalConfiguration';
import {
	GROUPBYObject,
	JOINObject,
	SEARCHCRITERIA,
	joinDirection,
	newSEARCHCRITERIA,
	tableObject,
} from '../config/types';
import client from '../database';
import { SELECTSQLQUERY } from '../helpers/filtersSQL';
import { STATSQUERY } from '../helpers/statsSQL';

export type Stats = {
	count_reports_Pending: number;
	count_reports_Completed: number;
	count_reports_Verified: number;
	count_reports_Printed: number;
	count_reports_Delivered: number;
	count_males: number;
	count_females: number;
	count_CT: number;
	count_MRI: number;
	count_CR: number;
	count_US: number;
	count_order_schedueled: number;
	count_order_completed: number;
	count_order_reported: number;
	count_critical: number;
	count_non_critical: number;
	count_non_radiologist: number;
	count_non_patient_name: number;
};

export class STATS {
	public count_reports_Pending: number;
	public count_reports_Completed: number;
	public count_reports_Verified: number;
	public count_reports_Printed: number;
	public count_reports_Delivered: number;
	public count_males: number;
	public count_females: number;
	public count_CT: number;
	public count_MRI: number;
	public count_CR: number;
	public count_US: number;
	public count_order_schedueled: number;
	public count_order_completed: number;
	public count_order_reported: number;
	public count_critical: number;
	public count_non_critical: number;
	public count_non_radiologist: number;
	public count_non_patient_name: number;
	constructor(data: Stats) {
		this.count_reports_Pending = data.count_reports_Pending;
		this.count_reports_Completed = data.count_reports_Completed;
		this.count_reports_Verified = data.count_reports_Verified;
		this.count_reports_Printed = data.count_reports_Printed;
		this.count_reports_Delivered = data.count_reports_Delivered;
		this.count_males = data.count_males;
		this.count_females = data.count_females;
		this.count_CT = data.count_CT;
		this.count_MRI = data.count_MRI;
		this.count_CR = data.count_CR;
		this.count_US = data.count_US;
		this.count_order_schedueled = data.count_order_schedueled;
		this.count_order_completed = data.count_order_completed;
		this.count_order_reported = data.count_order_reported;
		this.count_critical = data.count_critical;
		this.count_non_critical = data.count_non_critical;
		this.count_non_radiologist = data.count_non_radiologist;
		this.count_non_patient_name = data.count_non_patient_name;
	}
}

const [tableName, shcema] = ['stats', 'main'];
export async function getStats(
	criteria: newSEARCHCRITERIA,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Stats[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const sqlQuery = new STATSQUERY();
		let JOINObjects = [
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
			{
				use: true,
				joinDirection: 'LEFT',
				table2SchemaName: 'main',
				table2Name: 'orders',
				table1Fkey: 'mrn',
				table2FKey: 'mrn',
			},
		];
		if (criteria.customFilterSelected) {
			console.log(criteria);
			switch (criteria.customFilterSelected) {
				case '1':
					sqlQuery.QUERY_reportStatusCountForRadiologist();
					break;
				case '2':
					sqlQuery.QUERY_averageAgeOfPatients();
					break;
				case '3':
					sqlQuery.QUERY_countPatientsByGender();
					break;
				case '4':
					sqlQuery.QUERY_numberOfStudiesBYModality();
					break;
				case '5':
					sqlQuery.QUERY_totalNumberOfOrderByStatus();
					break;
				default:
					sqlQuery.QUERY_reportStatusCountForRadiologist();
					break;
			}
		} else {
			sqlQuery.QUERY_reportStatusCountForRadiologist();
		}
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
				console.log(filt);
				console.log(`using ${filt.WHEREStatement}`);
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
		criteria.LIMIT && sqlQuery.LIMIT(criteria.LIMIT);
		const SQL = sqlQuery.BUILDSQL();
		console.log(SQL);
		return {
			feedback: LocalAConfig.serviceStatus.success,
			entCount: 2,
			data: [],
		};
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
}
