import { stringMatch } from './../config/types';
import {
	DBTablesMap,
	LocalAConfig,
	serviceStatus,
} from './../config/LocalConfiguration';
import client from '../database';
import * as sqlQueries from '../helpers/createSQLString';
import { QueryObject, REQBODY, SEARCHCRITERIA } from '../config/types';
import { getDateInEgypt } from '../config/getDate';
import createInsertFunction from '../ParentFunctions/createInsert';
import createShowAllOnCriteriaFunction from '../ParentFunctions/createShowAllOnCriteria';
import createUpdateFunction from '../ParentFunctions/createUpdate';
import createDeleteFunction from '../ParentFunctions/createDelete';
import createShowAllFunction from '../ParentFunctions/createShowAll';
import createSearchFunction from '../ParentFunctions/createSearch';

export type User = {
	primaryKey?: string;
	user_id?: number | string;
	username: string;
	full_name?: string;
	user_password?: string;
	user_role?: number;
	job?: string;
	email?: string;
	user_config?: object;
};
export class USER {
	public user_id: number | string;
	public username: string;
	public full_name: string;
	public user_password: string;
	public user_role: number;
	public job: string;
	public email: string;
	public user_config: object | string;

	public constructor(data: User) {
		this.user_id = data.user_id || '';
		this.username = data.username || '';
		this.full_name = data.full_name || '';
		this.user_password = data.user_password || '';
		this.user_role = data.user_role || 0;
		this.job = data.job || '';
		this.email = data.email || '';
		this.user_config = data.user_config || {};
	}
}
const { shcema, tableName, UID_Column } = DBTablesMap.users;

export async function insertUser(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new function to insert new user');
	const insert_Study = createInsertFunction(tableName);
	return insert_Study(req, callBackErr);
}
export async function showAllUsersOnCriteria(
	criteria: SEARCHCRITERIA,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
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
export async function updateUser(
	req: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to update user');
	const update_user = createUpdateFunction(tableName);
	return update_user(req, callBackErr);
}
export async function deleteUser(
	user: User,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to delete user');
	const func = createDeleteFunction(tableName);
	return func(user, callBackErr);
}
export async function showAllUsers(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
			// data:[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log('Using the new fucntion to showAll User');
	const func = createShowAllFunction(tableName);
	return func(limited, callBackErr);
}
export async function searchUsers(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	console.log(`Using the new fucntion to search orders`);
	const func = createSearchFunction(`${tableName}`);
	return func(reqBody.users, callBackErr, 'anyMatch');
}

/**End of finished parent functions */

/**Inserts a new user to the database*/
export async function insertUser_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const originalUser = reqBody.users;
		const user = new USER(originalUser);
		user.user_config = JSON.stringify(user.user_config);
		for (const i in user) {
			if (
				!user[i as keyof typeof user] ||
				user[i as keyof typeof user] === ''
			) {
				delete user[i as keyof typeof user];
			}
		}
		const columnNames = Object.keys(user);
		const values = Object.values(user);
		columnNames.push('last_update');
		values.push(getDateInEgypt());
		const SQL = sqlQueries.createSQLinsert(`main.users`, columnNames, values);
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		const createduser = result.rows[0] as User;
		delete createduser.user_password;
		return {
			feedback: LocalAConfig.serviceStatus.success,
			entCount: result.rowCount,
			data: [createduser],
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
/**Gets one user in the database by username*/
export async function searchUsers_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const originalUser = reqBody.users;
		const user = new USER(originalUser);
		let SQL = '';
		const conn = await client.connect();
		let rowCount: number;
		let rows: unknown[];
		const theCoulmnsNeeded = [
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
		];
		if (user.user_id && user.username) {
			const user_id = user?.user_id || '*' || 'null';
			const username = user.username;
			SQL = sqlQueries.createSQLshowOneOnly(
				'main.users',
				'user_id',
				user_id,
				theCoulmnsNeeded,
				'user_id',
				null,
				true,
				'username',
				username
			);
			const result = await conn.query(SQL);
			rowCount = result.rowCount;
			rows = result.rows;
		} else if (user.username && !user.user_id) {
			const username = user.username;
			console.log('here');
			SQL = sqlQueries.createSQLshowOneOnly(
				'main.users',
				'username',
				username,
				theCoulmnsNeeded,
				'username'
			);
			const result = await conn.query(SQL);
			rowCount = result.rowCount;
			rows = result.rows;
		} else if (user.user_id && !user.username) {
			const user_id = user?.user_id;
			console.log('here');

			SQL = sqlQueries.createSQLshowOneOnly(
				'main.users',
				'user_id',
				user_id,
				theCoulmnsNeeded,
				'user_id'
			);
			const result = await conn.query(SQL);
			rowCount = result.rowCount;
			rows = result.rows;
		} else {
			rowCount = 0;
			rows = [];
		}
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			entCount: rowCount,
			data: rows,
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
/**Updates existing user in the database*/
export async function updateUser_(
	reqBody: REQBODY,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const originalUser = reqBody.users;
		const user = new USER(originalUser);
		user.user_config = JSON.stringify(user.user_config);
		for (const i in user) {
			if (
				!user[i as keyof typeof user] ||
				user[i as keyof typeof user] === ''
			) {
				delete user[i as keyof typeof user];
			}
		}
		const columnNames = Object.keys(user);
		const values = Object.values(user);

		const SQL = sqlQueries.createSQLupdate(
			`main.users`,
			columnNames,
			values,
			'username',
			user.username as string
		);
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		const updateduser = result.rows[0] as User;
		delete updateduser.user_password;
		conn.release();
		return {
			feedback: LocalAConfig.serviceStatus.success,
			entCount: result.rowCount,
			data: [updateduser],
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
/**Returns all users in the database, if limited is true it will return specific data, otherwsie it will return all data for the users*/
export async function showAllUsers_(
	limited: boolean,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		const SQL = sqlQueries.createSQLshowAll('main.users', [
			'user_id',
			'username',
			'user_role',
			'job',
			'email',
			'full_name',
		]);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();

		if (limited) {
			return {
				feedback: LocalAConfig.serviceStatus.success,
				entCount: result.rowCount,
				data: result.rows.map((user) => {
					return {
						user_id: user.user_id,
						full_name: user.full_name,
						username: user.username,
						user_role: user.user_role,
						job: user.job,
					};
				}),
			};
		} else {
			return {
				feedback: LocalAConfig.serviceStatus.success,
				entCount: result.rowCount,
				data: result.rows,
			};
		}
		// return final;
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
/**Deletes existing user from the database*/
export async function deleteUser_(
	user: User,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
	  }
	| {
			feedback: serviceStatus.failed;
			entCount: 0;
			data: Error;
	  }
> {
	try {
		let SQL = '';
		if (user.user_id) {
			const user_id = user?.user_id || 'null';
			SQL = sqlQueries.createSQLdelete(
				'main.users',
				'user_id',
				user_id as string
			);
		} else if (user.username) {
			const username = user?.username || 'null';
			SQL = sqlQueries.createSQLdelete('main.users', 'username', username);
		}
		console.log(SQL);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		result.rows.forEach((e) => delete e.user_password);
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
/**Searches users in the database on filters LIKE % no exact match*/
export async function searcFilterhUsers(
	query: QueryObject,
	callBackErr?: Function
): Promise<
	| {
			feedback: serviceStatus.success;
			entCount: number;
			data: User[] | unknown[];
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
		} where ${query.filterColumn} LIKE '${query.filterValue}%'`;
		console.log(SQL);
		// console.log(12);
		const conn = await client.connect();
		const result = await conn.query(SQL);
		conn.release();
		result.rows.forEach((e) => delete e.user_password);
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
/** Returns all patients in the database specifying certain number of enteries and can continue from the last entry sent to fetch more*/
// export async function showAllUsersOnCriteria_(
// 	criteria: SEARCHCRITERIA,
// 	callBackErr?: Function
// ): Promise<
// 	| {
// 			feedback: serviceStatus.success;
// 			entCount: number;
// 			data: User[] | unknown[];
// 	  }
// 	| {
// 			feedback: serviceStatus.failed;
// 			entCount: 0;
// 			data: Error;
// 	  }
// > {
// 	try {
// 		let SQL = sqlQueries.createSQLshowAll(
// 			'main.users',
// 			[
// 				'main.users.ind',
// 				'main.users.user_id',
// 				'main.users.username',
// 				'main.users.full_name',
// 				'main.users.user_role',
// 				'main.users.job',
// 				'main.users.email',
// 				// 'main.users.user_config',
// 				// 'main.users.uploads',
// 				'main.users.last_update',
// 				'COUNT(main.orders.radiologist)',
// 			],
// 			undefined,
// 			[
// 				'users_ind',
// 				'user_id',
// 				'username',
// 				'full_name',
// 				'user_role',
// 				'job',
// 				'email',
// 				'user_config',
// 				// 'uploads',
// 				// 'last_update',
// 				'reports_count',
// 			]
// 		);

// 		// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
// 		// Becasuse patient are orderd in descending order according to the ind so I am using less than operator instead of greater than
// 		// no need for last entry index here because we need to get all users each time
// 		// 		SQL += criteria.lastEntryInd
// 		// 			? ` WHERE main.users.ind < ${criteria.lastEntryInd}
// 		// `
// 		// 			: '';
// 		// I will use left join to get all users even if they don't have reports
// 		SQL += `
// LEFT JOIN main.orders
// ON main.orders.radiologist=main.users.username
// `;
// 		// If criteria has lastEntryInd this means that this fetch is a continuation of previous request so will start with the last entry ind
// 		// Becasuse order are orderd in descending order according to the ind so I am using less than operator instead of greater than
// 		SQL += criteria.lastEntryInd
// 			? `WHERE main.orders.ind< ${criteria.lastEntryInd}
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
// 			GROUP BY main.users.username
// 			ORDER BY users.ind DESC
// 	`;
// 		// 		if (criteria.oneValueOnly) {
// 		// 			SQL += ` WHERE ${criteria.criterionColumn} = '${criteria.oneValueOnly}'
// 		// `;
// 		// 		}
// 		// 		if (!criteria.oneValueOnly && criteria.startValue && criteria.endValue) {
// 		// 			SQL += ` WHERE ${criteria.criterionColumn} BETWEEN '${criteria.startValue}' AND '${criteria.endValue}'
// 		// `;
// 		// 		}

// 		if (criteria.LIMIT) {
// 			SQL += `LIMIT ${criteria.LIMIT} `;
// 		}
// 		console.log(SQL);
// 		const conn = await client.connect();
// 		const result = await conn.query(SQL);

// 		conn.release();
// 		const updatedArr = result.rows.map((r) => {
// 			return { ...r, ind: r.users_ind };
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
