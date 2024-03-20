import { STRING, INTEGER, FLOAT, BOOLEAN } from 'sequelize';
import { sequelizeClient } from '../../SequelizeModels/sequelizeConfig';
import User from './SequelizeUsers';

const Patient = sequelizeClient.define(
	'patient',
	{
		ind: { type: INTEGER, autoIncrement: true, primaryKey: true },
		mrn: { type: STRING(150), unique: true },
		category: { type: STRING(15) },
		rank: { type: STRING(20) },
		status: { type: STRING(20) },
		first_name: { type: STRING(100) },
		middle_name: { type: STRING(100) },
		last_name: { type: STRING(100) },
		national_id: { type: STRING(14) },
		dob: { type: STRING(50) },
		gender: { type: STRING },
		contacts: { type: STRING },
		email: { type: STRING(150) },
		createdBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		updatedBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
	},
	{ schema: 'patients_schema' }
);

// Define DiabetesDescription model
const DiabetesDescription = sequelizeClient.define(
	'DiabetesDescription',
	{
		ind: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		maxFasting: {
			type: INTEGER,
			allowNull: false,
		},
		minFasting: {
			type: INTEGER,
			allowNull: false,
		},
		maxPostPrandial: {
			type: INTEGER,
			allowNull: false,
		},
		minPostPrandial: {
			type: INTEGER,
			allowNull: false,
		},
		maxHba1c: {
			type: FLOAT,
			allowNull: false,
		},
		minHba1c: {
			type: FLOAT,
			allowNull: false,
		},
		retina: {
			type: STRING(100),
			allowNull: false,
		},
		kidney: {
			type: STRING(100),
			allowNull: false,
		},
		coronaries: {
			type: STRING(100),
			allowNull: false,
		},
		cerebral: {
			type: STRING(100),
			allowNull: false,
		},
		neuropathy: {
			type: STRING(100),
			allowNull: false,
		},
		createdBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		updatedBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
	},
	{ schema: 'patients_schema' }
);

const PatientClinical = sequelizeClient.define(
	'clinical',
	{
		ind: { type: INTEGER, primaryKey: true, autoIncrement: true },
		patient_ind: {
			type: STRING(100),
			references: { model: Patient, key: 'ind' },
		},
		dm: {
			type: INTEGER,
			references: { model: DiabetesDescription, key: 'id' },
		},
		htn: { type: INTEGER },
		smoking: { type: BOOLEAN },
		createdBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		updatedBy: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
	},
	{ schema: 'patients_schema' }
);

export default Patient;
