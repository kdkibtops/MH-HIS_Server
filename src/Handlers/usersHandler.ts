import { LocalAConfig } from './../config/LocalConfiguration';
import { Request, Response, Router } from 'express';
import { QueryObject, REQBODY, SEARCHCRITERIA } from '../config/types';
import {
	User,
	deleteUser,
	insertUser,
	searcFilterhUsers,
	searchUsers,
	showAllUsers,
	showAllUsersOnCriteria,
	updateUser,
} from '../Models/Users';

import bcrypt, { genSaltSync } from 'bcrypt';
import { refreshAccessToken } from '../Authentication/MiddleWares/HandleToken';
import { sendServerError } from '../ResponseHandler/ServerError';
import {
	sendBadRequestResponse,
	sendNotFoundResponse,
} from '../ResponseHandler/ClientError';
import {
	sendAcceptedCreatedResponse,
	sendAcceptedUpdatedResponse,
	sendSuccessfulResponse,
} from '../ResponseHandler/SuccessfulResponse';
import { ValidateObjectPresentInRequestBody } from '../helpers/RequestValidation';

/**Handles isnert a new user to the database*/
async function insertNewUser(req: Request, res: Response) {
	// recieves new token from middleware and sends it back to the user
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const user = reqBody.users;
			// checks if user is present or not
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount === 0
			) {
				const hashedPassword = bcrypt.hashSync(
					user.user_password as string,
					genSaltSync()
				);
				user.user_password = hashedPassword;
				const createdUser = await insertUser(reqBody, (err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				});
				if (createdUser.feedback === LocalAConfig.serviceStatus.success) {
					return sendAcceptedCreatedResponse(res, newToken, [
						...(createdUser.data as User[]),
					]);
				}
			}
			/**User already present return bad request and state*/
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount > 0
			) {
				const err = new Error(
					LocalAConfig.errorMessages.logMessages.userAlreadyPresentInDB
				);
				err.name = LocalAConfig.errorNames.badReuest.userAlreadyPresentInDB;
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: {
							message:
								LocalAConfig.errorMessages.toSendMessages
									.userAlreadyPresentInDB,
						},
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			} else if (!userPresentResponse.feedback) {
				const err = new Error();
				err.name = LocalAConfig.errorNames.unknownError;
				err.message =
					LocalAConfig.errorMessages.logMessages.unknownError(`inserting user`);
				return sendServerError(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/**Handles show all users in database based on specific criteria*/
async function showAllUsersInDatabaseOnCriteria(req: Request, res: Response) {
	// recieves new token from middleware and sends it back to the user
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const criteria: SEARCHCRITERIA = req.body.criteria;
		let proceed = ValidateObjectPresentInRequestBody('criteria', req, res);
		if (!proceed) {
			return;
		} else {
			const allUsersInDatabaseOnCriteria = await showAllUsersOnCriteria(
				criteria,
				(err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				}
			);
			if (
				allUsersInDatabaseOnCriteria.feedback ===
				LocalAConfig.serviceStatus.success
			) {
				return sendSuccessfulResponse(
					res,
					newToken,
					[...(allUsersInDatabaseOnCriteria.data as User[])],
					allUsersInDatabaseOnCriteria.entCount
				);
			} else {
				const error = new Error(`Can't show all users On Criteria`);
				error.name = 'showAllUsers Error';
				return sendServerError(
					res,
					{
						accessToken: newToken,
						action: LocalAConfig.serviceAction.failed,
						data: {
							message:
								'Unknown error in processing find users on critera () in users handler',
						},
					},
					error as Error
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/**Handles show all users in the database*/
async function showAllUsersInDatabase(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		/** gets all users from the database*/
		const userPresentResponse = await showAllUsers(false, (err: Error) => {
			sendBadRequestResponse(
				res,
				{
					accessToken: newToken,
					data: { message: err.message },
					action: LocalAConfig.serviceAction.failed,
				},
				err
			);
		});
		if (userPresentResponse.feedback === LocalAConfig.serviceStatus.success) {
			return sendSuccessfulResponse(
				res,
				newToken,
				[...(userPresentResponse.data as User[])],
				userPresentResponse.entCount
			);
		} else {
			const error = new Error(
				LocalAConfig.errorMessages.logMessages.canNotMessages('show all users')
			);
			error.name =
				LocalAConfig.errorMessages.logMessages.unknownError(`Show all users`);
			return sendServerError(
				res,
				{
					accessToken: newToken,
					action: LocalAConfig.serviceAction.failed,
					data: {
						message: LocalAConfig.errorMessages.logMessages.unknownError(
							`processing searchUsersDatabase () in users handler`
						),
					},
				},
				error
			);
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/**Handles show all users in the database returning limited info for performance*/
async function LimitedShowAllUsersInDatabase(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		/** gets all users from the database*/
		const userPresentResponse = await showAllUsers(true, (err: Error) => {
			sendBadRequestResponse(
				res,
				{
					accessToken: newToken,
					data: { message: err.message },
					action: LocalAConfig.serviceAction.failed,
				},
				err
			);
		});
		if (userPresentResponse.feedback === LocalAConfig.serviceStatus.success) {
			return sendSuccessfulResponse(
				res,
				newToken,
				[...(userPresentResponse.data as User[])],
				userPresentResponse.entCount
			);
		} else {
			const error = new Error(
				LocalAConfig.errorMessages.logMessages.canNotMessages('show all users')
			);
			error.name =
				LocalAConfig.errorMessages.logMessages.unknownError(`Show all users`);
			return sendServerError(
				res,
				{
					accessToken: newToken,
					action: LocalAConfig.serviceAction.failed,
					data: {
						message: LocalAConfig.errorMessages.logMessages.unknownError(
							`processing searchUsersDatabase () in users handler`
						),
					},
				},
				error
			);
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/** Handles getting one user only*/
async function showOneUser(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const user = reqBody.users;
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (userPresentResponse.feedback === LocalAConfig.serviceStatus.success) {
				if (userPresentResponse.entCount > 0) {
					return sendSuccessfulResponse(
						res,
						newToken,
						[...(userPresentResponse.data as User[])],
						userPresentResponse.entCount
					);
				} else {
					const error = new Error(
						LocalAConfig.errorMessages.toSendMessages.UIDNotPresentInDatabase(
							'User',
							user.username
						)
					);
					error.name = 'Wrong username';
					return sendNotFoundResponse(
						res,
						{
							accessToken: newToken,
							data: { message: 'User not found' },
							action: LocalAConfig.serviceAction.failed,
						},
						error
					);
				}
			} else {
				const error = new Error(`Can't show user`);
				error.name = 'showOneUser Error';
				return sendServerError(
					res,
					{
						accessToken: newToken,
						action: LocalAConfig.serviceAction.failed,
						data: {
							message:
								'Unknown error in processing showOneUser() in users handler',
						},
					},
					error as Error
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/** Handles update existing user in the database  */
async function updateOldUser(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const user = reqBody.users;
			/**checks if user is present */
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount > 0
			) {
				if (user.user_password) {
					const hashedPassword = bcrypt.hashSync(
						user.user_password as string,
						genSaltSync()
					);
					user.user_password = hashedPassword;
				}
				const userToUpdate = await updateUser(reqBody, (err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				});
				if (userToUpdate.feedback === LocalAConfig.serviceStatus.success) {
					return sendAcceptedUpdatedResponse(res, newToken, [
						...(userToUpdate.data as User[]),
					]);
				}
			} else if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount === 0
			) {
				const error = new Error(
					LocalAConfig.errorMessages.toSendMessages.UIDNotPresentInDatabase(
						'User',
						user.username
					)
				);
				error.name = 'Wrong username';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'User not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!userPresentResponse.feedback) {
				const err = new Error();
				err.name = LocalAConfig.errorNames.unknownError;
				err.message = LocalAConfig.errorMessages.logMessages.unknownError(
					'update user handler'
				);
				return sendServerError(
					res,
					{
						accessToken: '',
						data: {
							message: LocalAConfig.errorMessages.logMessages.unknownError(
								'update user handler'
							),
						},
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/** Handles delete existing user from the database*/
async function deleteOldUser(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const user = reqBody.users;
			/** checks if user is present*/
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount > 0
			) {
				const userToDelete = await deleteUser(reqBody.users, (err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				});
				if (userToDelete.feedback === LocalAConfig.serviceStatus.success) {
					return sendSuccessfulResponse(
						res,
						newToken,
						[...(userToDelete.data as User[])],
						userToDelete.entCount
					);
				}
			} else if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount === 0
			) {
				const error = new Error(
					LocalAConfig.errorMessages.toSendMessages.UIDNotPresentInDatabase(
						'User',
						user.username
					)
				);
				error.name = 'Wrong user username ';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'User not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!userPresentResponse.feedback) {
				const err = new Error();
				err.name = LocalAConfig.errorNames.unknownError;
				err.message = LocalAConfig.errorMessages.logMessages.unknownError(
					'Deleting user handler'
				);
				return sendServerError(
					res,
					{
						accessToken: '',
						data: {
							message:
								LocalAConfig.errorMessages.toSendMessages.unknownError(
									'deleting user'
								),
						},
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/** Handles  search user in the database on filters LIKE % no exact match*/
async function queryUsers(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the user*/
	const newToken = req.body.token || '';
	try {
		const currentUser = req.body.currentUser;
		Object.assign((req.body as REQBODY).orders, { updated_by: currentUser });
		let proceed = ValidateObjectPresentInRequestBody('query', req, res);
		if (!proceed) {
			return;
		} else {
			const query = req.body.query as QueryObject;
			const data = await searcFilterhUsers(query, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			sendSuccessfulResponse(
				res,
				newToken,
				[...(data.data as User[])],
				data.entCount
			);
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
}
/**Handles inserting and updating user configuration and settings */
const updateUserConfiguration = async (req: Request, res: Response) => {
	// recieves new token from middleware and sends it back to the user
	const newToken = req.body.token || '';
	try {
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const reqBody = req.body as REQBODY;
			const user = reqBody.users;
			// checks if user is present or not
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount > 0
			) {
				const userToUpdate = await updateUser(reqBody, (err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				});
				if (userToUpdate.feedback === LocalAConfig.serviceStatus.success) {
					return sendAcceptedUpdatedResponse(res, newToken, [
						...(userToUpdate.data as User[]),
					]);
				}
			} else if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount === 0
			) {
				const error = new Error(
					LocalAConfig.errorMessages.toSendMessages.UIDNotPresentInDatabase(
						'User',
						user.username
					)
				);
				error.name = 'Wrong username';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'User not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!userPresentResponse.feedback) {
				const err = new Error();
				err.name = LocalAConfig.errorNames.unknownError;
				err.message = LocalAConfig.errorMessages.logMessages.unknownError(
					`setup user configuration`
				);
				return sendServerError(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
};
/**Handles inserting and updating user configuration and settings */
const getUserConfiguration = async (req: Request, res: Response) => {
	// recieves new token from middleware and sends it back to the user
	const newToken = req.body.token || '';
	try {
		let proceed = ValidateObjectPresentInRequestBody('users', req, res);
		if (!proceed) {
			return;
		} else {
			const reqBody = req.body as REQBODY;
			const user = reqBody.users; // checks if user is present or not
			const userPresentResponse = await searchUsers(reqBody, (err: Error) => {
				sendBadRequestResponse(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			});
			if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount > 0
			) {
				const data = await searchUsers(reqBody, (err: Error) => {
					sendBadRequestResponse(
						res,
						{
							accessToken: newToken,
							data: { message: err.message },
							action: LocalAConfig.serviceAction.failed,
						},
						err
					);
				});
				if (data.feedback === LocalAConfig.serviceStatus.success) {
					return sendAcceptedUpdatedResponse(res, newToken, [
						...(data.data as User[]),
					]);
				}
			} else if (
				userPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
				userPresentResponse.entCount === 0
			) {
				const error = new Error(
					LocalAConfig.errorMessages.toSendMessages.UIDNotPresentInDatabase(
						'User',
						user.username
					)
				);
				error.name = 'Wrong username';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'User not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!userPresentResponse.feedback) {
				const err = new Error();
				err.name = LocalAConfig.errorNames.unknownError;
				err.message = LocalAConfig.errorMessages.logMessages.unknownError(
					`setup user configuration`
				);
				return sendServerError(
					res,
					{
						accessToken: newToken,
						data: { message: err.message },
						action: LocalAConfig.serviceAction.failed,
					},
					err
				);
			}
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: LocalAConfig.serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
};

/**Routes */

const usersHandler = Router();

// inserts new user
usersHandler.post(LocalAConfig.routes.insert, insertNewUser);
// index all users
usersHandler.post(
	LocalAConfig.routes.showAll,
	refreshAccessToken,
	showAllUsersInDatabase
);
// index all users with certain criteria and specific data to improve efficiency and reduce memory consumption
usersHandler.post(
	LocalAConfig.routes.limitedShowAll,
	refreshAccessToken,
	LimitedShowAllUsersInDatabase
);
// index all users based on certain criteria which is the main index function to be used
usersHandler.post(
	LocalAConfig.routes.showAllOnCriteria,
	showAllUsersInDatabaseOnCriteria
);
// deletes user from the database
usersHandler.post(LocalAConfig.routes.delete, deleteOldUser);
// updates user in the database
usersHandler.post(LocalAConfig.routes.update, updateOldUser);
// still not used
usersHandler.post(LocalAConfig.routes.query, queryUsers);
// updates user congifuration like colorTheme, fetech enteries, ...etc
usersHandler.post(
	LocalAConfig.routes.updateUserConfiguration,
	updateUserConfiguration
);
// gets user congifuration like colorTheme, fetech enteries, ...etc
usersHandler.post(
	LocalAConfig.routes.getUserConfiguration,
	getUserConfiguration
);
usersHandler.post(LocalAConfig.routes.showOne, showOneUser);
export default usersHandler;
