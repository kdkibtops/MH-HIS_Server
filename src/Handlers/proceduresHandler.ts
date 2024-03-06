import {
	DBTablesMap,
	LocalAConfig,
	serviceAction,
	serviceStatus,
} from './../config/LocalConfiguration';
import { Request, Response, Router } from 'express';
import { REQBODY } from '../config/types';
import {
	Procedure,
	createRecieveFileAndSaveFunction,
	genericDeletePathFromDB,
	showAllProcedures,
} from '../Models/Procedures';
import { sendBadRequestResponse } from '../ResponseHandler/ClientError';
import {
	sendAcceptedUpdatedResponse,
	sendSuccessfulResponse,
} from '../ResponseHandler/SuccessfulResponse';
import { sendServerError } from '../ResponseHandler/ServerError';

import path from 'path';
import {
	ValidateObjectPresentInRequestBody,
	ValidateStudyPresent,
	ValidateUserPresent,
} from '../helpers/RequestValidation';
import { existsSync, readdirSync, rmdirSync, unlink, unlinkSync } from 'fs';

/**Handles show all procedures in database */
async function showAllProceduresInDatabase(req: Request, res: Response) {
	// recieves new token from middleware and sends it back to the patient
	const newToken = req.body.token || '';
	try {
		Object.assign(req.body as REQBODY, { Procedure: { updated_by: '' } });
		const currentUser = req.body.currentUser;
		console.log('here');
		// (req.body as REQBODY).orders.updated_by = currentUser;

		const allProceduresInDatabase = await showAllProcedures(
			false,
			(err: Error) => {
				sendServerError(
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
			allProceduresInDatabase.feedback === LocalAConfig.serviceStatus.success
		) {
			return sendSuccessfulResponse(res, newToken, [
				...(allProceduresInDatabase.data as Procedure[]),
			]);
		} else if (
			allProceduresInDatabase.feedback === LocalAConfig.serviceStatus.failed &&
			!allProceduresInDatabase.error
		) {
			const error = new Error(`Can't show all Procedures`);
			error.name = 'showAllProcedures Error';
			return sendBadRequestResponse(
				res,
				{
					accessToken: newToken,
					action: LocalAConfig.serviceAction.failed,
					data: {
						message:
							'Unknown error in processing allProceduresInDatabase () in procedures handler',
					},
				},
				error as Error
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

/**Handles files upload & delete to procedures paperwork column */
const uploadDocument = async (req: Request, res: Response) => {
	// recieves new token from middleware and sends it back to the patient
	const newToken = req.body.token || '';
	try {
		const recieveFileAndProcess = createRecieveFileAndSaveFunction(
			req.params.documentCategory,
			req.params.filePath,
			req.params.procedureID,
			req.params.fileName,
			path.join(req.params.filePath, req.params.procedureID),
			path.join(
				__dirname,
				'../../application_files',
				'/procedures',
				'/Documents'
			)
		);
		const err = recieveFileAndProcess(req, res);
		if (err) console.log(err);
		// console.log('uploading file');
		// console.log('success');
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
async function deleteDocument(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the client*/
	const newToken = req.body.token || '';
	try {
		const { table, ID, dataCategory } = req.params;
		const filePath = req.body.filePath as string;
		const { tableName, UID_Column, paperworkColumn } =
			DBTablesMap[table as keyof typeof DBTablesMap];
		let deleted = false;
		if (existsSync(filePath)) {
			console.log('file found');
			unlinkSync(filePath);
			deleted = true;
		}
		const documentFolder = path.dirname(filePath);
		const mainFolder = path.dirname(documentFolder);
		if (existsSync(documentFolder)) {
			const documentFolderContents = readdirSync(documentFolder);
			console.log(`DocumentFolder:${documentFolder}`);
			if (documentFolderContents.length === 0) {
				rmdirSync(documentFolder);
			}
		}
		if (existsSync(mainFolder)) {
			const mainFolderContents = readdirSync(mainFolder);
			if (mainFolderContents.length === 0) {
				rmdirSync(mainFolder);
			}
		}
		const result = await genericDeletePathFromDB(
			tableName,
			UID_Column,
			ID,
			paperworkColumn,
			filePath,
			dataCategory
		);

		// const result = deleted
		// 	? await genericDeletePathFromDB(
		// 			tableName,
		// 			UID_Column,
		// 			ID,
		// 			paperworkColumn,
		// 			filePath,
		// 			dataCategory
		// 	  )
		// 	: false;
		if (result) {
			if (result.feedback === serviceStatus.success) {
				sendAcceptedUpdatedResponse(res, '', result.data);
			}
			if (result.feedback === serviceStatus.failed) {
				sendServerError(
					res,
					{
						accessToken: '',
						data: 'File not found, delete path from database only',
						action: serviceAction.failed,
					},
					new Error(`File not found, delete path from database only`)
				);
			}
		} else {
			sendServerError(
				res,
				{
					accessToken: newToken,
					data: 'File not found, delete failed contact adminstartor to remove manually from database',
					action: serviceAction.failed,
				},
				new Error(`Did not delete file or file doesn't exist`)
			);
		}
	} catch (error) {
		res.status(400);
	}
}

/**Routes */

const proceduresHandler = Router();
proceduresHandler.post(
	LocalAConfig.routes.showAll,
	showAllProceduresInDatabase
);
proceduresHandler.post(
	`${LocalAConfig.routes.uploadDocument}/:documentCategory/:filePath/:procedureID/:fileName`,
	uploadDocument
);
proceduresHandler.post(
	`${LocalAConfig.routes.deleteDocument}/:table/:ID/:dataCategory`,
	deleteDocument
);

export default proceduresHandler;

/*********HERE !!!!!!!! */
// /** Handles isnerting a new procedure to the database */
// async function insertNewProcedure(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		const reqBody = req.body as REQBODY;
// 		const currentUser = req.body.currentUser;
// 		Object.assign((req.body as REQBODY).orders, { updated_by: currentUser });
// 		let proceed = ValidateObjectPresentInRequestBody('procedures', req, res);
// 		// proceed = await ValidateProcedurePresent(req, res, reqBody.orders.mrn);
// 		proceed = await ValidateUserPresent(req, res, {
// 			table: 'orders',
// 			colName: 'updated_by',
// 		});
// 		if (!proceed) {
// 			return;
// 		} else {
// 			// checks if order is present or not
// 			const orderPresentResponse = await searchOrders(reqBody, (err: Error) => {
// 				sendBadRequestResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: err.message },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			});
// 			if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries === 0
// 			) {
// 				const createdOrder = await insertOrder(reqBody, (err: Error) => {
// 					sendBadRequestResponse(
// 						res,
// 						{
// 							accessToken: newToken,
// 							data: { message: err.message },
// 							action: LocalAConfig.serviceAction.failed,
// 						},
// 						err
// 					);
// 				});
// 				if (createdOrder.feedback === LocalAConfig.serviceStatus.success)
// 					return sendAcceptedCreatedResponse(res, newToken, [
// 						...(createdOrder.data as Order[]),
// 					]);
// 			}
// 			// update order data if order is already present
// 			if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries > 0
// 			) {
// 				const updatedOrder = await updateOrder(reqBody, (err: Error) => {
// 					sendBadRequestResponse(
// 						res,
// 						{
// 							accessToken: newToken,
// 							data: { message: err.message },
// 							action: LocalAConfig.serviceAction.failed,
// 						},
// 						err
// 					);
// 				});
// 				if (updatedOrder.feedback === LocalAConfig.serviceStatus.success) {
// 					// const updatedData = {
// 					// 	...data,
// 					// 	action: LocalAConfig.serviceAction.updated,
// 					// };
// 					return sendAcceptedUpdatedResponse(res, newToken, [
// 						...(updatedOrder.data as Order[]),
// 					]);
// 				}
// 			} else if (!orderPresentResponse.feedback) {
// 				const err = new Error();
// 				err.name = `Unknown error`;
// 				err.message = `Unknonwn Error in updating/inserting orders`;
// 				return sendServerError(
// 					res,
// 					{
// 						accessToken: '',
// 						data: { message: err.message },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			}
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err as Error
// 		);
// 	}
// }

// /**Handles show all orders in database based on specific criteria*/
// async function showAllOrdersInDatabaseOnCriteria(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		const reqBody = req.body as REQBODY;
// 		const criteria: SEARCHCRITERIA = req.body.criteria;
// 		let proceed = ValidateObjectPresentInRequestBody('criteria', req, res);
// 		if (!proceed) {
// 			return;
// 		} else {
// 			const allOrdersInDatabaseOnCriteria = await showAllOrdersOnCriteria(
// 				criteria as SEARCHCRITERIA,
// 				(err: Error) => {
// 					sendBadRequestResponse(
// 						res,
// 						{
// 							accessToken: newToken,
// 							data: { message: err.message },
// 							action: LocalAConfig.serviceAction.failed,
// 						},
// 						err
// 					);
// 				}
// 			);
// 			if (
// 				allOrdersInDatabaseOnCriteria.feedback ===
// 				LocalAConfig.serviceStatus.success
// 			) {
// 				return sendSuccessfulResponse(res, newToken, [
// 					...(allOrdersInDatabaseOnCriteria.data as Order[]),
// 				]);
// 			} else {
// 				const error = new Error(`Can't show all orders On Criteria`);
// 				error.name = 'showAllOrders Error';
// 				return sendServerError(
// 					res,
// 					{
// 						accessToken: newToken,
// 						action: LocalAConfig.serviceAction.failed,
// 						data: {
// 							message:
// 								'Unknown error in processing find orders on critera () in orders handler',
// 						},
// 					},
// 					error as Error
// 				);
// 			}
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err as Error
// 		);
// 	}
// }
// /**Handles show all orders in database returning limited data to save memory and perfomance*/
// async function LimitedShowAllOrdersInDatabase(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		Object.assign(req.body as REQBODY, { orders: { updated_by: '' } });
// 		const currentUser = req.body.currentUser;
// 		(req.body as REQBODY).orders.updated_by = currentUser;

// 		const allOrdersInDatabase = await showAllOrders(true, (err: Error) => {
// 			sendBadRequestResponse(
// 				res,
// 				{
// 					accessToken: newToken,
// 					data: { message: err.message },
// 					action: LocalAConfig.serviceAction.failed,
// 				},
// 				err
// 			);
// 		});
// 		if (allOrdersInDatabase.feedback === LocalAConfig.serviceStatus.success) {
// 			return sendSuccessfulResponse(res, newToken, [
// 				...(allOrdersInDatabase.data as Order[]),
// 			]);
// 		} else {
// 			const error = new Error(`Can't show all orders`);
// 			error.name = 'showAllOrders Error';
// 			return sendServerError(
// 				res,
// 				{
// 					accessToken: newToken,
// 					action: LocalAConfig.serviceAction.failed,
// 					data: {
// 						message:
// 							'Unknown error in processing searchOrdersDatabase () in orders handler',
// 					},
// 				},
// 				error as Error
// 			);
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err as Error
// 		);
// 	}
// }
// /** Handles update existing order in the database  */
// async function updateOldOrder(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		const reqBody = req.body as REQBODY;
// 		const currentUser = req.body.currentUser;
// 		Object.assign((req.body as REQBODY).orders, { updated_by: currentUser });
// 		let proceed = ValidateObjectPresentInRequestBody('orders', req, res);
// 		proceed = await ValidatePatientPresent(req, res, reqBody.orders.mrn);
// 		proceed = await ValidateStudyPresent(req, res, reqBody.orders.study);
// 		proceed = await ValidateUserPresent(req, res, {
// 			table: 'orders',
// 			colName: 'updated_by',
// 		});
// 		if (!proceed) {
// 			return;
// 		} else {
// 			const order = reqBody.orders;
// 			// checks if order is present => updates the entry
// 			const orderPresentResponse = await searchOrders(reqBody, (err: Error) => {
// 				sendBadRequestResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: err.message },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			});
// 			if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries > 0
// 			) {
// 				const orderToUpdate = await updateOrder(reqBody, (err: Error) => {
// 					sendBadRequestResponse(
// 						res,
// 						{
// 							accessToken: newToken,
// 							data: { message: err.message },
// 							action: LocalAConfig.serviceAction.failed,
// 						},
// 						err
// 					);
// 				});
// 				if (orderToUpdate.feedback === LocalAConfig.serviceStatus.success) {
// 					return sendAcceptedUpdatedResponse(res, newToken, [
// 						...(orderToUpdate.data as Order[]),
// 					]);
// 				}
// 			} else if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries === 0
// 			) {
// 				const error = new Error(
// 					`Bad Request, Order ${order.order_id} is not found in the request database`
// 				);
// 				error.name = 'Wrong order ID';
// 				return sendNotFoundResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: 'Order not found' },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					error
// 				);
// 			} else if (!orderPresentResponse.feedback) {
// 				const err = new Error();
// 				err.name = `Unknown error`;
// 				err.message = `Unknonwn Error in updating orders`;
// 				return sendServerError(
// 					res,
// 					{
// 						accessToken: '',
// 						data: {},
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			}
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err
// 		);
// 	}
// }
// /** Handles delete existing order from the database*/
// async function deleteOldOrder(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		const reqBody = req.body as REQBODY;
// 		const currentUser = req.body.currentUser;
// 		Object.assign((req.body as REQBODY).orders, { updated_by: currentUser });
// 		if (!ValidateObjectPresentInRequestBody('orders', req, res)) return;
// 		let proceed = ValidateObjectPresentInRequestBody('orders', req, res);
// 		if (!proceed) {
// 			return;
// 		} else {
// 			const order = reqBody.orders;
// 			// checks if order is present => delete the entry
// 			const orderPresentResponse = await searchOrders(reqBody, (err: Error) => {
// 				sendBadRequestResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: err.message },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			});

// 			if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries > 0
// 			) {
// 				const orderToDelete = await deleteOrder(order, (err: Error) => {
// 					sendBadRequestResponse(
// 						res,
// 						{
// 							accessToken: newToken,
// 							data: { message: err.message },
// 							action: LocalAConfig.serviceAction.failed,
// 						},
// 						err
// 					);
// 				});
// 				if (orderToDelete.feedback === LocalAConfig.serviceStatus.success) {
// 					return sendSuccessfulResponse(res, newToken, [
// 						...(orderToDelete.data as Order[]),
// 					]);
// 				}
// 			} else if (
// 				orderPresentResponse.feedback === LocalAConfig.serviceStatus.success &&
// 				orderPresentResponse.enteries === 0
// 			) {
// 				const error = new Error(
// 					`Bad Request, Order ${order.order_id} is not found in the request database`
// 				);
// 				error.name = 'Wrong order ID';
// 				return sendNotFoundResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: 'Order not found' },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					error
// 				);
// 			} else if (!orderPresentResponse.feedback) {
// 				const err = new Error();
// 				err.name = `Unknown error`;
// 				err.message = `Unknonwn Error in Deleting orders`;
// 				return sendServerError(
// 					res,
// 					{
// 						accessToken: '',
// 						data: {},
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			}
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err
// 		);
// 	}
// }
// /** Handles  search order in the database on filters LIKE % no exact match*/
// async function queryOrders(req: Request, res: Response) {
// 	// recieves new token from middleware and sends it back to the patient
// 	const newToken = req.body.token || '';
// 	try {
// 		let proceed = ValidateObjectPresentInRequestBody('query', req, res);
// 		if (!proceed) {
// 			return;
// 		} else {
// 			const query = req.body.query as QueryObject;
// 			const data = await searcFilterhOrders(query, (err: Error) => {
// 				sendBadRequestResponse(
// 					res,
// 					{
// 						accessToken: newToken,
// 						data: { message: err.message },
// 						action: LocalAConfig.serviceAction.failed,
// 					},
// 					err
// 				);
// 			});
// 			sendSuccessfulResponse(res, newToken, [...(data.data as Order[])]);
// 		}
// 	} catch (error) {
// 		const err = error as Error;
// 		sendServerError(
// 			res,
// 			{
// 				accessToken: newToken,
// 				action: LocalAConfig.serviceAction.failed,
// 				data: { message: err.message },
// 			},
// 			err
// 		);
// 	}
// }

// proceduresHandler.post(LocalAConfig.routes.insert, insertNewOrder);
// proceduresHandler.post(LocalAConfig.routes.showAll, showAllOrdersInDatabase);
// proceduresHandler.post(
// 	LocalAConfig.routes.limitedShowAll,
// 	LimitedShowAllOrdersInDatabase
// );
// proceduresHandler.post(
// 	LocalAConfig.routes.showAllOnCriteria,
// 	showAllOrdersInDatabaseOnCriteria
// );
// proceduresHandler.post(LocalAConfig.routes.delete, deleteOldOrder);
// proceduresHandler.post(LocalAConfig.routes.update, updateOldOrder);
// proceduresHandler.post(LocalAConfig.routes.query, queryOrders);

// function createRecieveFileAndSaveFunction(
// 	directoryName: string,
// 	mainPath: string
// ) {
// 	const recieveFileAndProcess = (req: Request, res: Response): void | Error => {
// 		const newToken = req.body.token || '';
// 		try {
// 			const filePath = path.join(mainPath, directoryName);
// 			const fileName = req.params.fileName;
// 			console.log(filePath);
// 			if (!existsSync(filePath)) {
// 				mkdirSync(filePath, { recursive: true });
// 			}
// 			const form = formidable({
// 				uploadDir: filePath,
// 				multiples: true,
// 				keepExtensions: true,
// 				filename: (name, ext, part, form) => {
// 					return `${fileName}${ext}`;
// 				},
// 			});
// 			form.parse(req, (err, fields, files) => {});
// 			form.on('file', async (form, file) => {
// 				console.log('Document saved success');
// 			});
// 			const result = sendAcceptedCreatedResponse(res, newToken, [
// 				{ path: filePath, fileName: fileName },
// 			]);
// 			return result;
// 		} catch (error) {
// 			const result = error as Error;
// 			return result;
// 		}
// 	};
// 	return recieveFileAndProcess;
// }
