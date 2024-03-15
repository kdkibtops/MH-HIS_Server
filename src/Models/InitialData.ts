import app_Config from '../config/appConfig.json';
import local_Configuration from '../config/localConfig.json';
import { selectOptionsValues } from '../config/selectOption';
import client from '../database';

type AppConfig = {
	selectOptions: object;
	selectOptionsValues: object;
	RAQSdictionary: object;
	specialFields: object;
	pageConstants: object;
};
type LocalConfiguration = {
	UID_Columns: string[];
	arrayColumns: string[];
	JSONData: string[];
	serviceAction: {};
	serviceStatus: {};
	LocalAConfig: {};
	DBTablesMap: {};
};

export type InitialData = {
	localConfiguration: LocalConfiguration;
	appConfiguration: AppConfig;
};

/**
 *
 * @returns the inital datta that the frontend application needs to run including configuration and variables for the application
 */
export const getInitialData = async (): Promise<
	{ err: null; initialData: InitialData[] } | { err: Error; initialData: null }
> => {
	try {
		const loca = local_Configuration;
		const result = {
			err: null,
			initialData: [
				{
					appConfiguration: app_Config.admin,
					localConfiguration: local_Configuration,
				},
			],
		};

		// This handles values that needs to be updated dynamically from the Database
		// However this step should be done on the frontend to allow for update without
		// the need to update the frontend because in our case here
		// if new radiologist is added, the front-end need to be
		// refreshed, otherwise the new radiologist will not appear in the list
		const conn = await client.connect();
		const sqlRadiolgists = `SELECT * FROM main.users WHERE job = '${selectOptionsValues.job.radiologist}'`;
		const sqlReferringphys = `SELECT referring_phys FROM main.orders WHERE referring_phys IS NOT NULL`;
		const radiologistsList = (await conn.query(sqlRadiolgists)).rows.map(
			(r) => {
				return { value: r.username, text: r.full_name };
			}
		) as { value: string; text: string }[];
		const referringPhysList = (await conn.query(sqlReferringphys)).rows.map(
			(r) => {
				return { value: r.referring_phys, text: r.referring_phys };
			}
		) as { value: string; text: string }[];
		conn.release();
		const dropListSearch =
			result.initialData[0].appConfiguration.pageConstants.orders.searchBars.filter(
				(s) => s.searchType === 'droplist'
			);
		dropListSearch.forEach((sb) => {
			console.log(sb.id);
			switch (sb.id) {
				case 'byradiologist':
					console.table(radiologistsList);
					sb.optionArr = radiologistsList;
					break;
				case 'byrefphys':
					console.table(referringPhysList);
					sb.optionArr = referringPhysList;
					break;
			}
		});

		return result;
	} catch (error) {
		return { err: error as Error, initialData: null };
	}
};
