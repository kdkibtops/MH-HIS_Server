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
import getPGClient from '../getPGClient';

export type Order = {
	ind?: number;
	order_id: string;
	mrn: string;
	age: number;
	study_id: string;
	o_date: string;
	o_status: string;
	report?: string[];
	reportsArr: { ind: number; paperwork_name: string; paperwork_path: string }[];
	reports_count: number;
	radiologist?: string;
	report_status?: string;
	critical?: boolean;
	radiation_dose?: number;
	study_instance_uid?: string;
	last_update?: string;
	updated_by?: string;
	referring_phys?: string;
};
export class ORDER {
	public ind: number;
	public order_id: string;
	public mrn: string;
	public age: number;
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
		this.ind = data.ind || 0;
		this.order_id = data.order_id;
		this.mrn = data.mrn;
		this.age = data.age || 0;
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
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('using the new search on criteria function');
	const show_all_on_criteria = createShowAllOnCriteriaFunction(tableName);
	const orders = await show_all_on_criteria(criteria, callBackErr);
	const getReportsArray = async (orders: Order[]) => {
		const nemap = Promise.all(
			orders.map(async (o) => {
				if (o.reports_count > 0) {
					const res = await getPGClient(
						`SELECT * FROM orders_schema.paperwork WHERE order_id = '${o.order_id}' `,
						[],
						new Error().stack
					);
					const reportsArr = res ? res.rows : ['dasdas'];
					return { ...o, reportsArr: [...reportsArr] };
				} else {
					return { ...o, reportsArr: [] };
				}
			})
		);
		return nemap;
	};
	const newOrdersArr = await getReportsArray(orders.data);

	return { ...orders, data: newOrdersArr };
}
export async function insertOrder(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to insert new order');
	const insert_Study = createInsertFunction(tableName);
	return insert_Study(req, callBackErr);
}
export async function updateOrder(
	req: REQBODY,
	callBackErr?: Function,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to update order');
	const update_order = createUpdateFunction(tableName);
	return update_order(req, callBackErr, unusualPrimaryKey);
}
export async function deleteOrder(
	order: Order,
	callBackErr?: Function,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to delete order');
	const func = createDeleteFunction(tableName);
	return func(order, callBackErr, unusualPrimaryKey);
}
export async function showAllOrders(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to showAll orders`);
	const func = createShowAllFunction(tableName);
	return func(limited, callBackErr);
}
export async function searchOrders(
	reqBody: REQBODY,
	callBackErr?: Function,
	match?: string,
	unusualPrimaryKey?: string
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to search orders`);
	const func = createSearchFunction(tableName);
	return func(reqBody.orders, callBackErr, match, unusualPrimaryKey);
}

/**End of finished parent functions */

/** Inserts a new order to the database */
// export async function insertOrder_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const OriginalOrder = reqBody.orders;
// 		const order = new ORDER(OriginalOrder);
// 		for (const i in order) {
// 			if (
// 				!order[i as keyof typeof order] ||
// 				order[i as keyof typeof order] === ''
// 			) {
// 				delete order[i as keyof typeof order];
// 			}
// 		}
// 		const columnNames = Object.keys(order);
// 		const values = Object.values(order);
// 		columnNames.push('last_update');
// 		values.push(
// 			new Date().toLocaleString('en-GB', {
// 				// to get the current time zone of the server
// 				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// 			})
// 		);
// 		const SQL = sqlQueries.createSQLinsert(`main.orders`, columnNames, values);
// 		// console.log(SQL);
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

// /** Gets one order in the database by mrn*/
// export async function searchOrders_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const OriginalOrder = reqBody.orders;
// 		const order = new ORDER(OriginalOrder);

// 		const orderID = order?.order_id || 'null';
// 		const SQL = sqlQueries.createSQLshowOneOnly(
// 			'main.orders',
// 			'order_id',
// 			orderID,
// 			[],
// 			'order_id'
// 		);
// 		// console.log(SQL);
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

// /** Updates existing order in the database */
// export async function updateOrder_(
// 	reqBody: REQBODY,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const OriginalOrder = reqBody.orders;
// 		const order = new ORDER(OriginalOrder);
// 		// to avoid database errors in inserting nulls
// 		for (const i in order) {
// 			if (
// 				!order[i as keyof typeof order] ||
// 				order[i as keyof typeof order] === ''
// 			) {
// 				delete order[i as keyof typeof order];
// 			}
// 		}
// 		const columnNames = Object.keys(order);
// 		const values = Object.values(order);
// 		columnNames.push('last_update');
// 		values.push(getDateInEgypt());
// 		const SQL = sqlQueries.createSQLupdate(
// 			`main.orders`,
// 			columnNames,
// 			values,
// 			'order_id',
// 			order.order_id
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

// /** Returns all orders in the database*/
// export async function showAllOrders_(
// 	limited: boolean,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		console.log('start');
// 		let SQL = sqlQueries.createSQLshowAll('main.orders', []);
// 		SQL += ` LEFT JOIN main.patients
// 				ON main.patients.mrn = main.orders.mrn`;
// 		SQL += ` LEFT JOIN main.studies
// 				ON main.studies.study_id = main.orders.study_id`;
// 		SQL += ` ORDER BY o_date DESC LIMIT 50`;
// 		console.log('end');
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);
// 		conn.release();
// 		// const final = limited
// 		// 	? {
// 		// 			feedback: LocalAConfig.serviceStatus.success,
// 		// 			entCount: result.rowCount,
// 		// 			data: result.rows.map((order) => {
// 		// 				return {
// 		// 					order_id: order.order_id,
// 		// 					radiologist: order.radiologist,
// 		// 				};
// 		// 			}),
// 		// 	  }
// 		// 	: {
// 		// 			feedback: LocalAConfig.serviceStatus.success,
// 		// 			entCount: result.rowCount,
// 		// 			data: result.rows,
// 		// 	  };
// 		// return final;
// 		if (limited) {
// 			return {
// 				feedback: LocalAConfig.serviceStatus.success,
// 				entCount: result.rowCount,
// 				data: result.rows.map((order) => {
// 					return {
// 						order_id: order.order_id,
// 						radiologist: order.radiologist,
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

// /** Deletes existing order from the database */
// export async function deleteOrder_(
// 	order: Order,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: Order[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		const SQL = sqlQueries.createSQLdelete(
// 			`main.orders`,
// 			'order_id',
// 			order.order_id
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

/** Searches orders in the database on filters LIKE % no exact match */
export async function searcFilterhOrders(
	query: QueryObject,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: Order[] | unknown[];
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
