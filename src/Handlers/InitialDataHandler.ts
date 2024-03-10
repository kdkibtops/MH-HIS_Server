import { InitialData } from './../Models/InitialData';
import { Response, Request, Router } from 'express';
import { getInitialData } from '../Models/InitialData';
import { sendSuccessfulResponse } from '../ResponseHandler/SuccessfulResponse';
import { sendServerError } from '../ResponseHandler/ServerError';
import { serviceAction, serviceStatus } from '../config/LocalConfiguration';

const getInitialDataHandler = async (req: Request, res: Response) => {
	console.log('get initial data');
	/**Recieves new token from middleware and sends it back to the client*/
	const newToken = req.body.token || '';
	try {
		const getInitalData = await getInitialData();
		if (!getInitalData.err) {
			sendSuccessfulResponse(res, newToken, getInitalData.initialData, 1);
		} else {
			sendServerError(
				res,
				{ accessToken: newToken, data: {}, action: serviceStatus.failed },
				getInitalData.err
			);
		}
	} catch (error) {
		const err = error as Error;
		sendServerError(
			res,
			{
				accessToken: newToken,
				action: serviceAction.failed,
				data: { message: err.message },
			},
			err as Error
		);
	}
};

const initalDataHandler = Router();
initalDataHandler.get('/getInitialData', getInitialDataHandler);

export default initalDataHandler;
