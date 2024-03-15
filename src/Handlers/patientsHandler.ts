import { Request, Response, Router } from 'express';
import {
	QueryObject,
	REQBODY,
	SEARCHCRITERIA,
	// _SEARCHCRITERIA,
} from '../config/types';
import {
	Patient,
	deletePatient,
	insertPatient,
	searcFilterhPatients,
	searchPatients,
	showAllPatients,
	showAllPatientsOnCriteria,
	updatePatient,
} from '../Models/Patients';
import {
	sendBadRequestResponse,
	sendNotFoundResponse,
} from '../ResponseHandler/ClientError';
import {
	sendAcceptedCreatedResponse,
	sendAcceptedUpdatedResponse,
	sendSuccessfulResponse,
} from '../ResponseHandler/SuccessfulResponse';
import { sendServerError } from '../ResponseHandler/ServerError';
import { LocalAConfig } from '../config/LocalConfiguration';
import {
	ValidateObjectPresentInRequestBody,
	ValidateUserPresent,
} from '../helpers/RequestValidation';

/** Handles isnerting a new patient to the database */
async function insertNewPatient(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the client*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const currentUser = req.body.currentUser;
		Object.assign((req.body as REQBODY).patients, {
			updated_by: currentUser,
		});
		let proceed = ValidateObjectPresentInRequestBody('patients', req, res);
		proceed = await ValidateUserPresent(req, res, {
			table: 'patients',
			colName: 'updated_by',
		});
		if (!proceed) {
			return;
		} else {
			/**checks if patient is present*/
			const patientPresentResponse = await searchPatients(
				reqBody,
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
				},
				'anyMatch'
			);
			if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount === 0
			) {
				const createdPatient = await insertPatient(reqBody, (err: Error) => {
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
				if (createdPatient.feedback === LocalAConfig.serviceStatus.success)
					return sendAcceptedCreatedResponse(res, newToken, [
						...(createdPatient.data as Patient[]),
					]);
			}
			/**Update patient data if patient is already present*/
			if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount > 0
			) {
				const updatedPatient = await updatePatient(
					reqBody,
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
					},
					'ind'
				);
				if (updatedPatient.feedback === LocalAConfig.serviceStatus.success) {
					// const updatedData = {
					// 	...data,
					// 	action: LocalAConfig.serviceAction.updated,
					// };
					return sendAcceptedUpdatedResponse(res, newToken, [
						...(updatedPatient.data as Patient[]),
					]);
				}
			} else if (!patientPresentResponse.feedback) {
				const err = new Error();
				err.name = `Unknown error`;
				err.message = `Unknown Error in updating/inserting patients`;
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
/**Handles show all patients in database based on specific criteria*/
async function showAllPatientsInDatabaseOnCriteria(
	req: Request,
	res: Response
) {
	// recieves new token from middleware and sends it back to the patient
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const criteria: SEARCHCRITERIA = req.body.criteria;
		let proceed = ValidateObjectPresentInRequestBody('criteria', req, res);
		if (!proceed) {
			return;
		} else {
			const allPatientsInDatabaseOnCriteria = await showAllPatientsOnCriteria(
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
				allPatientsInDatabaseOnCriteria.feedback ===
				LocalAConfig.serviceStatus.success
			) {
				return sendSuccessfulResponse(
					res,
					newToken,
					[...(allPatientsInDatabaseOnCriteria.data as Patient[])],
					allPatientsInDatabaseOnCriteria.entCount
				);
			} else {
				const error = new Error(`Can't show all patients On Criteria`);
				error.name = 'showAllPatients Error';
				return sendServerError(
					res,
					{
						accessToken: newToken,
						action: LocalAConfig.serviceAction.failed,
						data: {
							message:
								'Unknown error in processing find patients on critera () in patients handler',
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
/**Handles show all patients in database */
async function showAllPatientsInDatabase(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the patient*/
	const newToken = req.body.token || '';
	try {
		Object.assign(req.body as REQBODY, { patients: { updated_by: '' } });
		const currentUser = req.body.currentUser;
		(req.body as REQBODY).patients.updated_by = currentUser;
		/** gets all patients from the database*/
		const allPatientsInDatabase = await showAllPatients(false, (err: Error) => {
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
		if (allPatientsInDatabase.feedback === LocalAConfig.serviceStatus.success) {
			return sendSuccessfulResponse(
				res,
				newToken,
				[...(allPatientsInDatabase.data as Patient[])],
				allPatientsInDatabase.entCount
			);
		} else {
			const error = new Error(`Can't show all patients`);
			error.name = 'Unknown Error';
			return sendServerError(
				res,
				{
					accessToken: newToken,
					action: LocalAConfig.serviceAction.failed,
					data: {
						message:
							'Unknown error in processing showAllPatientsInDatabase () in patients handler',
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
/**Handles show all patients in database */
async function limitedShowAllPatientsInDatabase(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the patient*/
	const newToken = req.body.token || '';
	try {
		Object.assign(req.body as REQBODY, { patients: { updated_by: '' } });
		const currentUser = req.body.currentUser;
		(req.body as REQBODY).patients.updated_by = currentUser;
		/** gets all patients from the database*/
		const allPatientsInDatabase = await showAllPatients(true, (err: Error) => {
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
		if (allPatientsInDatabase.feedback === LocalAConfig.serviceStatus.success) {
			return sendSuccessfulResponse(
				res,
				newToken,
				[...(allPatientsInDatabase.data as Patient[])],
				allPatientsInDatabase.entCount
			);
		} else {
			const error = new Error(`Can't show all patients`);
			error.name = 'Unknown Error';
			return sendServerError(
				res,
				{
					accessToken: newToken,
					action: LocalAConfig.serviceAction.failed,
					data: {
						message:
							'Unknown error in processing limitedShowAllPatientsInDatabase () in patients handler',
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
/** Handles update existing patient in the database  */
async function updateOldPatient(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the patient*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const currentUser = req.body.currentUser;
		Object.assign((req.body as REQBODY).patients, { updated_by: currentUser });
		let proceed = ValidateObjectPresentInRequestBody('patients', req, res);
		proceed = await ValidateUserPresent(req, res, {
			table: 'patients',
			colName: 'updated_by',
		});
		if (!proceed) {
			return;
		} else {
			const patient = reqBody.patients;
			/**checks if patient is present */
			const patientPresentResponse = await searchPatients(
				reqBody,
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
				},
				'=',
				'ind'
			);
			if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount > 0
			) {
				const patientToUpdate = await updatePatient(
					reqBody,
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
					},
					'ind'
				);
				if (patientToUpdate.feedback === LocalAConfig.serviceStatus.success) {
					return sendAcceptedUpdatedResponse(res, newToken, [
						...(patientToUpdate.data as Patient[]),
					]);
					// return sendAcceptedUpdatedResponse(res, newToken, data);
				}
			} else if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount === 0
			) {
				const error = new Error(
					`Bad Request, Patient ${patient.mrn} is not found in the request database`
				);
				error.name = 'Wrong patient mrn';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'Patient not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!patientPresentResponse.feedback) {
				const err = new Error();
				err.name = `Unknown error`;
				err.message = `Unknown Error in updating patients`;
				return sendServerError(
					res,
					{
						accessToken: '',
						data: {},
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
			err
		);
	}
}
/** Handles delete existing patient from the database*/
async function deleteOldPatient(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the patient*/
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const currentUser = req.body.currentUser;
		Object.assign((req.body as REQBODY).patients, { updated_by: currentUser });
		let proceed = ValidateObjectPresentInRequestBody('patients', req, res);
		if (!proceed) {
			return;
		} else {
			const patient = reqBody.patients;
			/** checks if patient is present*/
			const patientPresentResponse = await searchPatients(
				reqBody,
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
				},
				'=',
				'ind'
			);
			if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount > 0
			) {
				const patientToDelete = await deletePatient(
					patient,
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
					},
					'ind'
				);
				if (patientToDelete.feedback === LocalAConfig.serviceStatus.success) {
					return sendSuccessfulResponse(
						res,
						newToken,
						[...(patientToDelete.data as Patient[])],
						patientToDelete.entCount
					);
				}
			} else if (
				patientPresentResponse.feedback ===
					LocalAConfig.serviceStatus.success &&
				patientPresentResponse.entCount === 0
			) {
				const error = new Error(
					`Bad Request, Patient ${patient.mrn} is not found in the request database`
				);
				error.name = 'Wrong patient mrn';
				return sendNotFoundResponse(
					res,
					{
						accessToken: newToken,
						data: { message: 'Patient not found' },
						action: LocalAConfig.serviceAction.failed,
					},
					error
				);
			} else if (!patientPresentResponse.feedback) {
				const err = new Error();
				err.name = `Unknown error`;
				err.message = `Unknown Error in Deleting patients`;
				return sendServerError(
					res,
					{
						accessToken: '',
						data: {},
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
			err
		);
	}
}
/** Handles  search patients in the database on filters LIKE % no exact match*/
async function queryPatients(req: Request, res: Response) {
	/**Recieves new token from middleware and sends it back to the patient*/
	const newToken = req.body.token || '';
	try {
		const currentUser = req.body.currentUser;
		Object.assign((req.body as REQBODY).patients, { updated_by: currentUser });
		let proceed = ValidateObjectPresentInRequestBody('query', req, res);
		if (!proceed) {
			return;
		} else {
			if (!ValidateObjectPresentInRequestBody('query', req, res)) return;
			const query = req.body.query as QueryObject;
			const data = await searcFilterhPatients(query, (err: Error) => {
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
				[...(data.data as Patient[])],
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
			err
		);
	}
}

/**Patients Router */
const patientHandler = Router();

patientHandler.post(LocalAConfig.routes.insert, insertNewPatient);
patientHandler.post(LocalAConfig.routes.showAll, showAllPatientsInDatabase);
patientHandler.post(
	LocalAConfig.routes.limitedShowAll,
	limitedShowAllPatientsInDatabase
);
patientHandler.post(
	LocalAConfig.routes.showAllOnCriteria,
	showAllPatientsInDatabaseOnCriteria
);
patientHandler.post(LocalAConfig.routes.delete, deleteOldPatient);
patientHandler.post(LocalAConfig.routes.update, updateOldPatient);
patientHandler.post(LocalAConfig.routes.query, queryPatients);

export default patientHandler;
