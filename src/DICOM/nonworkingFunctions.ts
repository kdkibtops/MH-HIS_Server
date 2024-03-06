import { existsSync, mkdirSync } from 'fs';
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

const folderPath = path.join(__dirname, '../../application_files/dicom/');

if (!existsSync(folderPath)) {
	mkdirSync(folderPath, { recursive: true });
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
			aet: 'RADIANT2',
			ip: '134.16.66.51',
			port: 11112,
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
			aet: 'RADIANT',
			ip: '134.16.66.61',
			port: 9999,
		},
	},
	storagePath: folderPath,
	verbose: false,
};

// Options for recieving and storing studies and query on this server
const scpOptions: storeScpOptions = {
	source: allOptions.peers.thisDICOMServerOnNetwork,
	peers: Object.values(allOptions.peers),
	storagePath: allOptions.storagePath,
	verbose: allOptions.verbose,
};
// This is used to allow MY DICOM server to accept and store the sent studies
// Also allows sources to query this database
startStoreScp(scpOptions, (result) => {
	const na = JSON.parse(result);
	console.log(na);
});

// This is used to allow MY DICOM server to push studies
// Options for recieving and storing studies
const scuOptions: storeScuOptions = {
	//The source I am retrieving from
	source: allOptions.peers.thisDICOMServerOnNetwork,
	//The source I am pushing to
	target: allOptions.peers.PACS_PC,
	//The folder of the study
	sourcePath: path.join(
		allOptions.storagePath,
		'1.2.840.4892943.343.20240302213905193.1.37149'
	),
	verbose: allOptions.verbose,
};
// works well either target is C-GET or C_MOVE
// Doesn't need the startStoreScp to run
storeScu(scuOptions, (result) => {
	const na = JSON.parse(result);
	console.log(na);
});

// Runs well

const extraTags = [
	{
		// Study INSTANCE UID
		key: '0020000D',
		value: '*',
	},
	{
		// study date
		key: '00080020',
		value: '*',
	},
	{
		// series date
		key: '00080021',
		value: '*',
	},
	{
		// acquistion date
		key: '00080022',
		value: '*',
	},
	{
		// patient DOB
		key: '00100030',
		value: '*',
	},
	{
		// modality
		key: '00080060',
		value: '*',
	},
	{
		// institution name
		key: '00080080',
		value: '*',
	},
	{
		// study description
		key: '00081030',
		value: '*',
	},
	{
		// gender
		key: '00100040',
		value: '*',
	},
	{
		// age
		key: '00101010',
		value: '*',
	},
	{
		// patient name
		key: '*',
		value: '',
	},
	{
		// patient id
		key: '00100020',
		value: '*',
	},
];

// Below allow for quering and retrieving data from DICOM servers, tags include the criteria for which we are searching like patient ID, accession number, ...etc
// I succeeded in quering a study based on accession number

// Specify the search criteria you want
// const tags = [
// 	{
// 		key: '00080052',
// 		value: 'STUDY',
// 	},
// 	{
// 		key: '00080060',
// 		value: '',
// 	},
// 	{
// 		key: '00100010',
// 		value: '',
// 	},
// 	{
// 		// accession number write accesion number here
// 		key: '00080050',
// 		value: 'AG5197*',
// 	},
// ];
// // Still I need to understand below
// setTimeout(() => {
// 	findScu(
// 		{
// 			source: allOptions.peers.thisDICOMServerOnNetwork,
// 			target: allOptions.peers.synapseAgouza,
// 			tags: tags,
// 			netTransferPrefer: '1.2.840.10008.1.2.4.80', // preferred network transfer syntax (accepted ts - additional to default ts)
// 			verbose: allOptions.verbose,
// 		},
// 		(res) => {
// 			const result = JSON.parse(res).container;
// 			const y: [] = JSON.parse(result);
// 			const arr = y.map((e) => e['00080060']['Value']);
// 			console.log(arr);

// 			switch (result.code) {
// 				case 0:
// 					console.log('Succeeded');
// 					break;
// 				case 1:
// 					console.log('Pending');
// 					break;
// 				case 2:
// 					console.log('Failed');
// 					break;
// 				default:
// 					console.error(`Didn't match any code`);
// 					break;
// 			}
// 		}
// 	);
// }, 3000);

// setTimeout(() => {
// 	getScu(
// 		{
// 			source: allOptions.peers.thisDICOMServerOnNetwork,
// 			target: allOptions.peers.synapseAgouza,
// 			tags: tags,
// 			netTransferPrefer: '1.2.840.10008.1.2.4.80', // preferred network transfer syntax (accepted ts - additional to default ts)
// 			verbose: allOptions.verbose,
// 			storagePath: folderPath,
// 		},
// 		(res) => {
// 			const result = JSON.parse(res);
// 			console.log(result);

// 			switch (result.code) {
// 				case 0:
// 					console.log('Succeeded');
// 					break;
// 				case 1:
// 					console.log('Pending');
// 					break;
// 				case 2:
// 					console.log('Failed');
// 					break;
// 				default:
// 					console.error(`Didn't match any code`);
// 					break;
// 			}
// 		}
// 	);
// }, 3000);
// setTimeout(() => {
// 	getScu(
// 		{
// 			source: allOptions.peers.thisDICOMServerOnNetwork,
// 			target: allOptions.peers.synapseAgouza,
// 			netTransferPrefer: '1.2.840.10008.1.2.4.80',
// 			tags: tags,
// 			storagePath: path.join(
// 				allOptions.storagePath,
// 				'1.2.840.4892943.343.20240302213905193.1.37149'
// 			),
// 			verbose: allOptions.verbose,
// 		},
// 		(res) => {
// 			const result = JSON.parse(res);
// 			console.log(`---Start GET`);
// 			console.log(result);
// 			console.log(`---END GET`);
// 		}
// 	);
// }, 3000);

// setTimeout(() => {
// 	moveScu(
// 		{
// 			source: allOptions.peers.thisDICOMServerOnNetwork,
// 			target: allOptions.peers.PACS_PC,
// 			destination: allOptions.peers.PACS_PC.aet,
// 			tags: tags,
// 			verbose: allOptions.verbose,
// 		},
// 		(res) => {
// 			const result = JSON.parse(res);
// 			switch (result.code) {
// 				case 0:
// 					console.log('Succeeded');
// 					break;
// 				case 1:
// 					console.log('Pending');
// 					break;
// 				case 2:
// 					console.log('Failed');
// 					break;
// 				default:
// 					console.error(`Didn't match any code`);
// 					break;
// 			}
// 		}
// 	);
// }, 3000);
