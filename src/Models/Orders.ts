import { SEARCHCRITERIA } from './../config/types';
import client from '../database';
import * as sqlQueries from '../helpers/createSQLString';
import { QueryObject, REQBODY } from '../config/types';
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

export type Order = {
	primaryKey?: string;
	order_id: string;
	mrn: string;
	study_id: string;
	o_date: string;
	o_status: string;
	report?: string;
	radiologist?: string;
	report_status?: string;
	critical?: boolean;
	radiation_dose?: number;
	last_update?: string;
	updated_by?: string;
	referring_phys?: string;
};
export class ORDER {
	public order_id: string;
	public mrn: string;
	public study_id: string;
	public o_date: string;
	public o_status: string;
	public report_status: string;
	public critical: boolean;
	public radiation_dose: number;
	public radiologist: string;
	public updated_by: string;
	public referring_phys: string;

	public constructor(data: Order) {
		this.order_id = data.order_id;
		this.mrn = data.mrn;
		this.study_id = data.study_id;
		this.o_date = data.o_date;
		this.o_status = data.o_status;
		this.report_status = data.report_status || 'Pending';
		this.critical = data.critical || false;
		this.radiation_dose = data.radiation_dose || 0;
		this.radiologist = data.radiologist || '';
		this.updated_by = data.updated_by || '';
		this.referring_phys = data.referring_phys || '';
	}
}
const { shcema, tableName, UID_Column } = DBTablesMap.orders;

export async function showAllOrdersOnCriteria(
	criteria: SEARCHCRITERIA,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log('using the new search on criteria function');
	const show_all_on_criteria = createShowAllOnCriteriaFunction(tableName);
	return show_all_on_criteria(criteria, callBackErr);
}
export async function insertOrder(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to insert new order');
	const insert_Study = createInsertFunction(tableName);
	return insert_Study(req, callBackErr);
}
export async function updateOrder(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to update order');
	const update_order = createUpdateFunction(tableName);
	return update_order(req, callBackErr);
}
export async function deleteOrder(
	order: Order,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to delete order');
	const func = createDeleteFunction(tableName);
	return func(order, callBackErr);
}
export async function showAllOrders(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
			// data:[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to showAll orders`);
	const func = createShowAllFunction(tableName);
	return func(limited, callBackErr);
}
export async function searchOrders(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to search orders`);
	const func = createSearchFunction(tableName);
	return func(reqBody.orders, callBackErr);
}

/**End of finished parent functions */

/** Inserts a new order to the database */
export async function insertOrder_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	try {
		const OriginalOrder = reqBody.orders;
		const order = new ORDER(OriginalOrder);
		for (const i in order) {
			if (
				!order[i as keyof typeof order] ||
				order[i as keyof typeof order] === ''
			) {
				delete order[i as keyof typeof order];
			}
		}
		const columnNames = Object.keys(order);
		const values = Object.values(order);
		columnNames.push('last_update');
		values.push(
			new Date().toLocaleString('en-GB', {
				// to get the current time zone of the server
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			})
		);
		const SQL = sqlQueries.createSQLinsert(`main.orders`, columnNames, values);
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			enteries: result.rowCount,
			data: result.rows,
		};
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
}

/** Gets one order in the database by mrn*/
export async function searchOrders_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	try {
		const OriginalOrder = reqBody.orders;
		const order = new ORDER(OriginalOrder);

		const orderID = order?.order_id || 'null';
		const SQL = sqlQueries.createSQLshowOneOnly(
			'main.orders',
			'order_id',
			orderID,
			[],
			'order_id'
		);
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			enteries: result.rowCount,
			data: result.rows,
		};
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
}

/** Updates existing order in the database */
export async function updateOrder_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	try {
		const OriginalOrder = reqBody.orders;
		const order = new ORDER(OriginalOrder);
		// to avoid database errors in inserting nulls
		for (const i in order) {
			if (
				!order[i as keyof typeof order] ||
				order[i as keyof typeof order] === ''
			) {
				delete order[i as keyof typeof order];
			}
		}
		const columnNames = Object.keys(order);
		const values = Object.values(order);
		columnNames.push('last_update');
		values.push(getDateInEgypt());
		const SQL = sqlQueries.createSQLupdate(
			`main.orders`,
			columnNames,
			values,
			'order_id',
			order.order_id
		);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			enteries: result.rowCount,
			data: result.rows,
		};
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
}

/** Returns all orders in the database*/
export async function showAllOrders_(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	try {
		console.log('start');
		let SQL = sqlQueries.createSQLshowAll('main.orders', []);
		SQL += ` LEFT JOIN main.patients
				ON main.patients.mrn = main.orders.mrn`;
		SQL += ` LEFT JOIN main.studies
				ON main.studies.study_id = main.orders.study_id`;
		SQL += ` ORDER BY o_date DESC LIMIT 50`;
		console.log('end');
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		// const final = limited
		// 	? {
		// 			feedback: LocalAConfig.serviceStatus.success,
		// 			enteries: result.rowCount,
		// 			data: result.rows.map((order) => {
		// 				return {
		// 					order_id: order.order_id,
		// 					radiologist: order.radiologist,
		// 				};
		// 			}),
		// 	  }
		// 	: {
		// 			feedback: LocalAConfig.serviceStatus.success,
		// 			enteries: result.rowCount,
		// 			data: result.rows,
		// 	  };
		// return final;
		if (limited) {
			return {
				feedback: LocalAConfig.serviceStatus.success,
				enteries: result.rowCount,
				data: result.rows.map((order) => {
					return {
						order_id: order.order_id,
						radiologist: order.radiologist,
					};
				}),
			};
		} else {
			return {
				feedback: LocalAConfig.serviceStatus.success,
				enteries: result.rowCount,
				data: result.rows,
			};
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
}

/** Deletes existing order from the database */
export async function deleteOrder_(
	order: Order,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
			data: Error;
	  }
> {
	try {
		const SQL = sqlQueries.createSQLdelete(
			`main.orders`,
			'order_id',
			order.order_id
		);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			enteries: result.rowCount,
			data: result.rows,
		};
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
}

/** Searches orders in the database on filters LIKE % no exact match */
export async function searcFilterhOrders(
	query: QueryObject,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			enteries: number;
			data: Order[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			enteries: 0;
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
			enteries: result.rowCount,
			data: result.rows,
		};
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
}

/** Returns all orders in the database*/

// export async function showAllOrdersOnCriteria_(
// 	criteria: SEARCHCRITERIA,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			enteries: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			enteries: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		let SQL = sqlQueries.createSQLshowAll(
// 			'main.orders',
// 			[
// 				'main.orders.*',
// 				'main.orders.ind',
// 				'main.patients.*',
// 				'main.studies.study_id',
// 				'main.studies.study_name',
// 				'main.studies.arabic_name',
// 				'main.studies.modality',
// 				'main.studies.price',
// 			],
// 			undefined,
// 			[null, 'orders_ind', null, null, null, null, null, null]
// 		);
// 		SQL += `
// LEFT JOIN main.patients
// ON main.patients.mrn = main.orders.mrn
// `;
// 		SQL += `LEFT JOIN main.studies
// ON main.studies.study_id = main.orders.study_id
// `;
// 		// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
// 		// Becasuse order are orderd in descending order according to the ind so I am using less than operator instead of greater than
// 		SQL += criteria.lastEntryInd
// 			? `WHERE main.orders.ind< ${criteria.lastEntryInd}
// `
// 			: '';

// 		const filt =
// 			criteria.otherFilters && criteria.otherFilters.filter((f) => f.checked);
// 		if (filt) {
// 			addFiltersSql(filt, criteria.lastEntryInd)?.forEach(
// 				(sql) => (SQL += sql)
// 			);
// 		}

// 		SQL += `ORDER BY orders.ind DESC
// `;
// 		if (criteria.LIMIT) {
// 			SQL += `LIMIT ${criteria.LIMIT} `;
// 		}

// 		const newSQL = (SQL.split('FROM')[0] +=
// 			`,main.studies.updated_by AS study_updated_by FROM` +
// 			SQL.split('FROM')[1]);

// 		console.log(newSQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(newSQL);

// 		conn.release();
// 		const updatedArr = result.rows.map((r) => {
// 			return { ...r, ind: r.orders_ind };
// 		});
// 		return {
// 			feedback: LocalAConfig.serviceStatus.success,
// 			enteries: result.rowCount,
// 			data: updatedArr,
// 		};
// 	} catch (error) {
// 		if (callBackErr) {
// 			callBackErr(error as Error);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				enteries: 0,
// 				data: error as Error,
// 			};
// 		} else {
// 			console.log(`Error: ${error}`);
// 			return {
// 				feedback: LocalAConfig.serviceStatus.failed,
// 				enteries: 0,
// 				data: error as Error,
// 			};
// 		}
// 	}
// }
