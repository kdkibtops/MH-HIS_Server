import { Request, Response, Router } from 'express';
import { pushStudy } from './DICOMServer';

const pushStudyHandler = async (req: Request, res: Response) => {
	console.log('HI');
	try {
		const STUID = req.params.stuid;
		pushStudy(STUID as string, 'RADIANT2');
		console.log('Pushing study');
	} catch (error) {
		console.log(`Pushing Study DICOM Failed`);
		return { status: 'Error', retunVal: error as Error };
	}
};

const DICOMHandler = Router();
DICOMHandler.get('/push/:stuid', pushStudyHandler);
export default DICOMHandler;
