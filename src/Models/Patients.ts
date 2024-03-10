import client from '../database';
import * as sqlQueries from '../helpers/createSQLString';
import { QueryObject, REQBODY, SEARCHCRITERIA } from '../config/types';
import { getDateInEgypt } from '../config/getDate';
import {
	DBTablesMap,
	LocalAConfig,
	serviceStatus,
} from '../config/LocalConfiguration';
import createInsertFunction from '../ParentFunctions/createInsert';
import createShowAllOnCriteriaFunction from '../ParentFunctions/createShowAllOnCriteria';
import createUpdateFunction from '../ParentFunctions/createUpdate';
import createDeleteFunction from '../ParentFunctions/createDelete';
import createShowAllFunction from '../ParentFunctions/createShowAll';
import createSearchFunction from '../ParentFunctions/createSearch';

export type Patient = {
	primaryKey?: string;
	mrn: string;
	patient_name: string;
	national_id?: string;
	dob?: string;
	age?: string;
	gender?: string;
	email?: string;
	contacts?: string;
	updated_by?: string;
	last_update?: string;
};

export class PATIENT {
	public mrn: string;
	public patient_name: string;
	public national_id: string;
	public dob: string;
	public age: string;
	public gender: string;
	public contacts: string;
	public email: string;
	public updated_by: string;

	constructor(data: Patient) {
		this.mrn = data.mrn;
		this.patient_name = data.patient_name;
		this.national_id = data.national_id || '';
		this.dob = data.dob || '';
		this.gender = data.gender || '';
		this.contacts = data.contacts || '';
		this.age = data.age || '';
		this.email = data.email || '';
		this.updated_by = data.updated_by || '';
	}
}
const { shcema, tableName, UID_Column } = DBTablesMap.patients;

export async function insertPatient(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to insert new patient');
	const insert_Study = createInsertFunction(tableName);
	return insert_Study(req, callBackErr);
}
export async function showAllPatientsOnCriteria(
	criteria: SEARCHCRITERIA,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('using the new search on criteria function');
	const show_all_on_criteria = createShowAllOnCriteriaFunction(tableName);
	return show_all_on_criteria(criteria, callBackErr);
}
export async function updatePatient(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to update patient');
	const update_patient = createUpdateFunction(tableName);
	return update_patient(req, callBackErr);
}
export async function deletePatient(
	patient: Patient,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to delete patient');
	const func = createDeleteFunction(tableName);
	return func(patient, callBackErr);
}
export async function searchPatients(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
			// data:[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to search Patient');
	const func = createSearchFunction(tableName);
	return func(reqBody.patients, callBackErr);
}
export async function showAllPatients(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[];
			// data:[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to showAll Patient');
	const func = createShowAllFunction(tableName);
	return func(limited, callBackErr);
}

/**End of finished parent functions */

// /** Inserts a new patient to the database */
// export async function insertPatient_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalPatient = reqBody.patients;
// 		const patient = new PATIENT(originalPatient);
// 		for (const i in patient) {
// 			if (
// 				!patient[i as keyof typeof patient] ||
// 				patient[i as keyof typeof patient] === ''
// 			) {
// 				delete patient[i as keyof typeof patient];
// 			}
// 		}
// 		const columnNames = Object.keys(patient);
// 		const values = Object.values(patient);
// 		columnNames.push('last_update');
// 		values.push(getDateInEgypt());
// 		const SQL = sqlQueries.createSQLinsert(
// 			`main.patients`,
// 			columnNames,
// 			values
// 		);
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			entCount: result.rowCount,
// 			data: result.rows,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
// /** Gets one patient in the database by mrn*/
// export async function searchPatients_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalPatient = reqBody.patients;
// 		const patient = new PATIENT(originalPatient);
// 		const mrn = patient?.mrn || 'null';
// 		const SQL = sqlQueries.createSQLshowOneOnly(
// 			'main.patients',
// 			'mrn',
// 			mrn,
// 			[],
// 			'mrn'
// 		);
// 		console.log(`validate`);
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			entCount: result.rowCount,
// 			data: result.rows,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
// /** Updates existing patient in the database */
// export async function updatePatient_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalPatient = reqBody.patients;
// 		const patient = new PATIENT(originalPatient);
// 		for (const i in patient) {
// 			if (
// 				!patient[i as keyof typeof patient] ||
// 				patient[i as keyof typeof patient] === ''
// 			) {
// 				delete patient[i as keyof typeof patient];
// 			}
// 		}
// 		const columnNames = Object.keys(patient);
// 		const values = Object.values(patient);

// 		const SQL = sqlQueries.createSQLupdate(
// 			`main.patients`,
// 			columnNames,
// 			values,
// 			'mrn',
// 			patient.mrn
// 		);
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			entCount: result.rowCount,
// 			data: result.rows,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
// /** Returns all patients in the database*/
// export async function showAllPatients_(
// 	limited: boolean,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = sqlQueries.createSQLshowAll('main.patients', []);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();

// 		if (limited) {
// 			return {
// 				feedback: LocalAConfig.serviceStatus.success,
// 				entCount: result.rowCount,
// 				data: result.rows.map((patient) => {
// 					return {
// 						patient_name: patient.patient_name,
// 						mrn: patient.mrn,
// 					};
// 				}),
// 			};
// 		} else {
// 			return {
// 				feedback: LocalAConfig.serviceStatus.success,
// 				entCount: result.rowCount,
// 				data: result.rows,
// 			};
// 		}
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
// /** Deletes existing patient from the database */
// export async function deletePatient_(
// 	patient: Patient,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = sqlQueries.createSQLdelete(`main.patients`, 'mrn', patient.mrn);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			entCount: result.rowCount,
// 			data: result.rows,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
/** Searches patients in the database on filters LIKE % no exact match */
export async function searcFilterhPatients(
	query: QueryObject,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Patient[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const SQL = `SELECT * from ${query.schema || 'main'}.${
			query.tableName
		} where ${query.filterColumn} LIKE '${query.filterValue.toUpperCase()}%'`;
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			entCount: result.rowCount,
			data: result.rows,
		};
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
}
/** Returns all patients in the database*/
// export async function showAllPatientsOnCriteria_(
// 	criteria: SEARCHCRITERIA,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Patient[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		let SQL = sqlQueries.createSQLshowAll(
// 			'main.patients',
// 			[
// 				'main.patients.ind',
// 				'main.patients.mrn',
// 				'main.patients.patient_name',
// 				'main.patients.national_id',
// 				'main.patients.age',
// 				'main.patients.dob',
// 				'main.patients.gender',
// 				'main.patients.contacts',
// 				'main.patients.email',
// 				'main.patients.updated_by',
// 				'main.patients.last_update',
// 				'SUM(main.orders.radiation_dose)',
// 			],
// 			undefined,
// 			[
// 				'patients_ind',
// 				'mrn',
// 				'patient_name',
// 				'national_id',
// 				'age',
// 				'dob',
// 				'gender',
// 				'contacts',
// 				'email',
// 				'updated_by',
// 				'last_update',
// 				'cumulative_dose',
// 			]
// 		);
// 		SQL += `
// 		JOIN main.orders
// 		ON main.orders.mrn=main.patients.mrn
// 		`;
// 		// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
// 		// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
// 		SQL += criteria.lastEntryInd
// 			? ` WHERE main.patients.ind < ${criteria.lastEntryInd}
// `
// 			: '';

// 		const filter =
// 			criteria.otherFilters && criteria.otherFilters.filter((f) => f.checked);
// 		if (filter) {
// 			addFiltersSql(filter, criteria.lastEntryInd)?.forEach(
// 				(sql) => (SQL += sql)
// 			);
// 		}
// 		SQL += `
// 		GROUP BY main.patients.mrn
// 		ORDER BY patients.ind DESC
// `;
// 		if (criteria.LIMIT) {
// 			SQL += `LIMIT ${criteria.LIMIT} `;
// 		}
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);

// 		conn.release();
// 		const updatedArr = result.rows.map((r) => {
// 			return { ...r, ind: r.patients_ind };
// 		});
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			entCount: result.rowCount,
// 			data: updatedArr,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				entCount: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
