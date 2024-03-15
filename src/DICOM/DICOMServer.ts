import { existsSync, mkdirSync, writeFile } from 'fs';
import {
	startStoreScp,
	storeScpOptions,
	moveScu,
	moveScuOptions,
	findScu,
	findScuOptions,
	echoScu,
	echoScuOptions,
	storeScu,
	storeScuOptions,
	getScu,
	getScuOptions,
	parseFile,
	parseOptions,
} from 'dicom-dimse-native';
import path from 'path';
export const DICOMSTORAGEFOLDER = path.join(
	__dirname,
	'../../application_files/dicom/'
);
if (!existsSync(DICOMSTORAGEFOLDER)) {
	mkdirSync(DICOMSTORAGEFOLDER, { recursive: true });
}
const allOptions = {
	peers: {
		synapseAgouza: {
			// Synapse Agouza
			name: 'Synapse Agouza',
			aet: 'SYNAGZ',
			ip: '128.16.66.11',
			port: 104,
		},
		PACS_PC: {
			// PACS PC at my Office
			name: 'PACS PC at my Office',
			aet: 'RADIANT-PACS',
			ip: '134.16.66.51',
			port: 11112,
		},
		agouzaUltrasound: {
			// Ultrasoiund siemens Agouza
			name: 'Agouza Ultrasound Siemens',
			aet: 'ACUSONNX3',
			ip: '134.16.66.221',
			port: 104,
		},
		asusLaptop: {
			// My Asus Laptop RADIANT
			name: 'Asus Laptop RADIANT',
			aet: 'RADIANT',
			ip: '127.0.0.1',
			port: 11112,
		},
		thisDICOMServer: {
			// This DICOM server on Local computer
			name: 'This DICOM server on Local computer',
			aet: 'MY_AET',
			ip: '127.0.0.1',
			port: 9999,
		},
		thisDICOMServerOnNetwork: {
			// This DICOM server on network
			name: 'This DICOM server on network',
			// aet: 'RADIANT',
			aet: 'MHDICOM',
			ip: '134.16.66.61',
			port: 9999,
		},
	},
	storagePath: DICOMSTORAGEFOLDER,
	verbose: false,
};
export const APPDICOMServerStorage = allOptions.peers.thisDICOMServer;
// Options for recieving and storing studies and query on this server
const scpOptions: storeScpOptions = {
	source: APPDICOMServerStorage,
	peers: Object.values(allOptions.peers),
	storagePath: allOptions.storagePath,
	verbose: allOptions.verbose,
	permissive: true,
	storeOnly: false,
};
// This is used to allow MY DICOM server to accept and store the sent studies
// Also allows sources to query this database
startStoreScp(scpOptions, (result) => {
	const msg = JSON.parse(result);
	// retrieve and store the image
	if (msg.message === 'BUFFER_STORAGE') {
		let buff = Buffer.from(msg.container.base64, 'base64');
		const directory = `${scpOptions.storagePath}/${msg.container.StudyInstanceUID}`;
		const filepath = `${directory}/${msg.container.SOPInstanceUID}.dcm`;
		if (!existsSync(directory)) {
			mkdirSync(directory);
		}
		writeFile(filepath, buff, 'binary', (err) => {
			err ? console.log(err) : console.log(`The file was saved to ${filepath}`);
		});
	} else {
		console.log('Peer is requesting study');
		console.log(msg);
	}
});

// Test all peers
setTimeout(() => {
	Object.values(allOptions.peers).forEach(async (src) => {
		echoScu(
			{
				source: allOptions.peers.thisDICOMServerOnNetwork,
				target: src,
				verbose: false,
			},
			(res) => {
				const code = JSON.parse(res).code;
				switch (code) {
					case 0:
						console.log(`Testing ${src.name}: Succeeded`);
						break;
					case 2:
						console.log(`Testing ${src.name}: Failed`);
						break;
				}
			}
		);
	});
}, 1000);

// works well either target is C-GET or C_MOVE
// Doesn't need the startStoreScp to run
export const pushStudy = (StudyInstanceUID: string, AET: string) => {
	// This is used to allow MY DICOM server to push studies
	// Options for recieving and storing studies
	const allPeers = Object.values(allOptions.peers);

	const target = allPeers.filter((p) => p.aet === AET);
	if (target.length > 0) {
		console.log(`pushing study to ${JSON.stringify(target[0])}`);
		const scuOptions: storeScuOptions = {
			//The source I am retrieving from
			source: allOptions.peers.thisDICOMServerOnNetwork,
			//The source I am pushing to
			target: target[0],
			//The folder of the study
			sourcePath: path.join(allOptions.storagePath, StudyInstanceUID),
			verbose: allOptions.verbose,
		};

		storeScu(scuOptions, (result) => {
			const na = JSON.parse(result);
			console.log(na);
		});
	} else {
		console.error(`AET title was not found`);
	}
};
