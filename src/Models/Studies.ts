import { DBTablesMap, serviceStatus } from './../config/LocalConfiguration';
import { REQBODY, SEARCHCRITERIA } from '../config/types';
import createInsertFunction from '../ParentFunctions/createInsert';
import createShowAllOnCriteriaFunction from '../ParentFunctions/createShowAllOnCriteria';
import createUpdateFunction from '../ParentFunctions/createUpdate';
import createDeleteFunction from '../ParentFunctions/createDelete';
import createShowAllFunction from '../ParentFunctions/createShowAll';
import createSearchFunction from '../ParentFunctions/createSearch';

export type Study = {
	ind?: number;
	study_id: string;
	modality: string;
	study_name: string;
	arabic_name?: string;
	price?: number;
	last_update?: string;
	updated_by?: string;
};
export class STUDY {
	public ind: number;
	public study_id: number | string;
	public modality: string;
	public study_name: string;
	public arabic_name: string;
	public price: number;
	public updated_by: string;

	public constructor(data: Study) {
		this.ind = data.ind || 0;
		this.study_id = data.study_id || '';
		this.modality = data.modality || '';
		this.study_name = data.study_name || '';
		this.arabic_name = data.arabic_name || '';
		this.price = data.price || 0;
		this.updated_by = data.updated_by || '';
	}
}
const { shcema, tableName, UID_Column } = DBTablesMap.studies;

export async function insertStudy(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('using the new function insert study');
	const insert_Study = createInsertFunction(tableName);
	return insert_Study(req, callBackErr);
}
export async function showAllStudiesOnCriteria(
	criteria: SEARCHCRITERIA,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('using the new function searchOnCriteria study');
	const show_all_on_criteria = createShowAllOnCriteriaFunction(tableName);
	return show_all_on_criteria(criteria, callBackErr);
}
export async function updateStudy(
	req: REQBODY,
	callBackErr?: Function,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to update study');
	const update_study = createUpdateFunction(tableName);
	return update_study(req, callBackErr, unusualPrimaryKey);
}
export async function deleteStudy(
	study: Study,
	callBackErr?: Function,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to delete study');
	const func = createDeleteFunction(tableName);
	return func(study, callBackErr, unusualPrimaryKey);
}
export async function showAllStudies(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
			// data:[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to showAll study');
	const func = createShowAllFunction(tableName);
	return func(limited, callBackErr);
}
export async function searchStudies(
	reqBody: REQBODY,
	callBackErr?: Function,
	match?: string,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Study[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to search orders`);
	const func = createSearchFunction(`${tableName}`);
	return func(reqBody.studies, callBackErr, match, unusualPrimaryKey);
}

// /**End of finished parent functions */

// export async function insertStudy_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalStudy = reqBody.studies;
// 		const study = new STUDY(originalStudy);
// 		for (const i in study) {
// 			if (
// 				!study[i as keyof typeof study] ||
// 				study[i as keyof typeof study] === ''
// 			) {
// 				delete study[i as keyof typeof study];
// 			}
// 		}
// 		const columnNames = Object.keys(study);
// 		const values = Object.values(study);
// 		columnNames.push('last_update');
// 		values.push(getDateInEgypt());
// 		const SQL = sqlQueries.createSQLinsert(`main.studies`, columnNames, values);
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

// export async function searchStudies_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalStudy = reqBody.studies;
// 		const study = new STUDY(originalStudy);
// 		const studyID = study?.study_id || 'null';
// 		const SQL = sqlQueries.createSQLshowOneOnly(
// 			'main.studies',
// 			'studies.study_id',
// 			studyID,
// 			[],
// 			'studies.study_id'
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

// export async function updateStudy_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const originalStudy = reqBody.studies;
// 		const study = new STUDY(originalStudy);
// 		for (const i in study) {
// 			if (
// 				!study[i as keyof typeof study] ||
// 				study[i as keyof typeof study] === ''
// 			) {
// 				delete study[i as keyof typeof study];
// 			}
// 		}
// 		const columnNames = Object.keys(study);
// 		const values = Object.values(study);
// 		columnNames.push('last_update');
// 		values.push(getDateInEgypt());
// 		const SQL = sqlQueries.createSQLupdate(
// 			`main.studies`,
// 			columnNames,
// 			values,
// 			'studies.study_id',
// 			study.study_id
// 		);
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

// export async function showAllStudies_(
// 	limited: boolean,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 			// data:[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = sqlQueries.createSQLshowAll('main.studies', []);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		if (limited) {
// 			return {
// 				feedback: LocalAConfig.serviceStatus.success,
// 				entCount: result.rowCount,
// 				data: result.rows.map((study) => {
// 					return {
// 						study_id: study.study_id,
// 						modality: study.modality,
// 						study_name: study.study_name,
// 						arabic_name: study.arabic_name,
// 						price: study.price,
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
// //deletes existing study from the database
// export async function deleteStudy_(
// 	study: Study,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = sqlQueries.createSQLdelete(
// 			`main.studies`,
// 			'studies.study_id',
// 			study.study_id
// 		);
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		result.rows.forEach((e) => delete e.user_password);
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
// searches studies in the database on filters LIKE % no exact match
// export async function searcFilterhStudies(
// 	query: QueryObject,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = `SELECT * from ${query.schema || 'main'}.${
// 			query.tableName
// 		} where ${query.filterColumn} LIKE '${query.filterValue}%'`;
// 		console.log(SQL);
// 		// console.log(12);
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
/** Returns all studies in the database*/
// export async function showAllStudiesOnCriteria_(
// 	criteria: SEARCHCRITERIA,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Study[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		let SQL = sqlQueries.createSQLshowAll(
// 			'main.studies',
// 			[
// 				'main.studies.ind',
// 				'main.studies.study_id',
// 				'main.studies.modality',
// 				'main.studies.study_name',
// 				'main.studies.arabic_name',
// 				'main.studies.price',
// 				'main.studies.last_update',
// 				'main.studies.updated_by',
// 				'AVG (main.orders.radiation_dose)',
// 			],
// 			undefined,
// 			[
// 				'studies_ind',
// 				'studies.study_id',
// 				'modality',
// 				'study_name',
// 				'arabic_name',
// 				'price',
// 				'last_update',
// 				'updated_by',
// 				'average_radiation_dose',
// 			]
// 		);
// 		SQL += `
// 		LEFT JOIN main.orders
// 		ON main.orders.study=main.studies.study_id
// 		`;
// 		// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
// 		// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
// 		SQL += criteria.lastEntryInd
// 			? ` WHERE main.studies.ind < ${criteria.lastEntryInd}
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
// 		GROUP BY main.studies.study_id
// 		ORDER BY studies.ind DESC
// `;
// 		if (criteria.LIMIT) {
// 			SQL += `LIMIT ${criteria.LIMIT} `;
// 		}
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);

// 		conn.release();
// 		const updatedArr = result.rows.map((r) => {
// 			return { ...r, ind: r.studies_ind };
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
