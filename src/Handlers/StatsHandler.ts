import { Router, Request, Response } from 'express';
import { LocalAConfig } from '../config/LocalConfiguration';
import { sendServerError } from '../ResponseHandler/ServerError';
import { STATS, Stats, getStats } from '../Models/Stats';
import { REQBODY, newSEARCHCRITERIA } from '../config/types';
import { ValidateObjectPresentInRequestBody } from '../helpers/RequestValidation';
import { sendBadRequestResponse } from '../ResponseHandler/ClientError';
import { sendSuccessfulResponse } from '../ResponseHandler/SuccessfulResponse';

const getStatsHandler = async (req: Request, res: Response): Promise<void> => {
	// recieves new token from middleware and sends it back to the patient
	const newToken = req.body.token || '';
	try {
		const reqBody = req.body as REQBODY;
		const criteria: newSEARCHCRITERIA = req.body.criteria;
		let proceed = ValidateObjectPresentInRequestBody('criteria', req, res);
		if (!proceed) {
			return;
		} else {
			// let extraFilter: newSEARCHFILTERS;
			// switch (job) {
			// 	case appConfig.admin.selectOptionsValues.job.radiologist:
			// 		extraFilter = {
			// 			checked: true,
			// 			type: 'string',
			// 			WHEREStatement: 'String_WHERE_SingleColumnSingleValue',
			// 			tablesName: ['orders'],
			// 			multipleColumns: ['radiologist'],
			// 			multipleValues: [currentUser],
			// 			match: ['exactMatchAll'],
			// 			next: 'AND',
			// 		};
			// 		criteria.otherFilters = criteria.otherFilters
			// 			? [extraFilter, ...criteria.otherFilters]
			// 			: [extraFilter];
			// 		break;
			// 	case appConfig.admin.selectOptionsValues.job.secretary:
			// 		extraFilter = {
			// 			checked: true,
			// 			type: 'string',
			// 			WHEREStatement: 'String_WHERE_SingleColumn_OR_MultipleValues',
			// 			tablesName: ['orders'],
			// 			multipleColumns: ['report_status'],
			// 			multipleValues: [
			// 				selectOptionsValues.report_status.completed,
			// 				selectOptionsValues.report_status.verified,
			// 				selectOptionsValues.report_status.delivered,
			// 				selectOptionsValues.report_status.printed,
			// 			],
			// 			match: ['exactMatchAll'],
			// 			next: 'AND',
			// 		};
			// 		criteria.otherFilters = criteria.otherFilters
			// 			? [extraFilter, ...criteria.otherFilters]
			// 			: [extraFilter];
			// 		break;
			// 	// patient needs logic to identify the patient by his mrn as currentUser
			// 	default:
			// 		break;
			// }
			const stats = await getStats(
				criteria as newSEARCHCRITERIA,
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

			if (stats.feedback === LocalAConfig.serviceStatus.success) {
				return sendSuccessfulResponse(res, newToken, [...stats.data]);
			} else {
				const error = new Error(`Can't show all orders On Criteria`);
				error.name = 'showAllOrders Error';
				return sendServerError(
					res,
					{
						accessToken: newToken,
						action: LocalAConfig.serviceAction.failed,
						data: {
							message:
								'Unknown error in processing find orders on critera () in orders handler',
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
};

const StatsHandler = Router();
StatsHandler.post(LocalAConfig.routes.showAll, getStatsHandler);
export default StatsHandler;
