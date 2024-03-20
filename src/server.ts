import { setupData } from './config/config';
import {
	DICOMApp,
	authServer,
	authServerHTTPS,
	mainServerHTTPS,
	radAssitApp,
	startServerCallback,
} from './applications';
import { updateLoacalConfigJSON } from './config/LocalConfiguration';
import updateDB from './syncDatabase';
const {
	https_main_server_port,
	https_auth_server_port,
	main_server_port,
	auth_server_port,
} = setupData;

/** Should update the localConfig.json file to the current configuration from the server  */
updateLoacalConfigJSON();

// /** Initiate servers */
console.log(`\nServers initiation:`);

radAssitApp.listen(main_server_port, () =>
	startServerCallback('Main HTTP', main_server_port)
);
authServer.listen(auth_server_port, () =>
	startServerCallback('Authorization HTTP', auth_server_port)
);
mainServerHTTPS.listen(https_main_server_port, () =>
	startServerCallback('Main HTTPS', https_main_server_port)
);
authServerHTTPS.listen(https_auth_server_port, () =>
	startServerCallback('Authorization HTTPS', https_auth_server_port)
);
DICOMApp.listen(1200, () => startServerCallback('DICOM Listener', 1200));
// Update Database to be replaced with another trigger route
setInterval(() => {
	console.log('Updating Database');
	updateDB();
}, 5000);
