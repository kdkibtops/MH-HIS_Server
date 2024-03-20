import { STRING, INTEGER, FLOAT, DATE, TIME, TEXT } from 'sequelize';
import { sequelizeClient } from '../../SequelizeModels/sequelizeConfig';
import User from './SequelizeUsers';
import Patient from './Sequelizepatients';

const StudyPreparation = sequelizeClient.define(
	'preparation',
	{
		ind: { type: INTEGER, primaryKey: true, autoIncrement: true },
		hint_text: { type: TEXT },
		document_file_path: { type: TEXT },
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
	{ schema: 'radiology' }
);
const Study = sequelizeClient.define(
	'studies',
	{
		ind: { type: INTEGER, autoIncrement: true, primaryKey: true },
		id: { type: STRING(150), unique: true },
		modality: { type: STRING(10) },
		study_name: { type: STRING(100) },
		arabic_name: { type: STRING },
		price: { type: FLOAT },
		study_preparation: {
			type: INTEGER,
			references: { model: StudyPreparation, key: 'ind' },
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
	{ schema: 'radiology' }
);
const Order = sequelizeClient.define(
	'orders',
	{
		ind: { type: INTEGER, autoIncrement: true, primaryKey: true },
		id: { type: STRING(100), unique: true },
		patient_ind: {
			type: INTEGER,

			references: { model: Patient, key: 'ind' },
		},
		age: { type: FLOAT },
		study_id: { type: INTEGER, references: { model: Study, key: 'ind' } },
		technician: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		radiologist: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		referring_phys: {
			type: INTEGER,
			references: {
				model: User,
				key: 'ind',
			},
		},
		request_date: { type: DATE },
		o_status: { type: STRING(20) },
		o_date: { type: DATE },
		start_time: { type: TIME },
		end_time: { type: TIME },
		payment_category: { type: INTEGER },
		report_status: { type: STRING(50) },
		cancelled_notes: { type: TEXT },
		critical: { type: STRING(50) },
		radiation_dose: { type: FLOAT },
		study_instance_uid: { type: STRING, unique: true },
		series_count: { type: INTEGER },
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
	{ schema: 'radiology' }
);
const OrderPaperWork = sequelizeClient.define(
	'paperwork',
	{
		ind: { type: INTEGER, autoIncrement: true, primaryKey: true },
		order_ind: { type: INTEGER, references: { model: Order, key: 'ind' } },
		paperwork_name: { type: STRING(50) },
		paperwork_path: { type: TEXT },
		category: { type: STRING(50) },
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
	{ schema: 'radiology' }
);
