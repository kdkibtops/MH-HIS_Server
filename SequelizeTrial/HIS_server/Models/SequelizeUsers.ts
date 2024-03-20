import { STRING, INTEGER, JSON, BOOLEAN, TEXT, DATE } from 'sequelize';
import { sequelizeClient } from '../../SequelizeModels/sequelizeConfig';

// Define UserRole model
const UserRole = sequelizeClient.define(
	'User_role',
	{
		ind: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		roleName: {
			type: STRING(50),
			allowNull: false,
		},
		rolePrivileges: {
			type: JSON,
			allowNull: false,
		},
	},
	{ schema: 'users_schema' }
);
// Define Job model
const Job = sequelizeClient.define(
	'Job',
	{
		ind: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		jobName: {
			type: STRING(70),
			allowNull: false,
		},
	},
	{ schema: 'users_schema' }
);
// Define User model
const User = sequelizeClient.define(
	'User',
	{
		ind: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: STRING(50),
			unique: true,
		},
		firstName: {
			type: STRING(50),
			allowNull: false,
		},
		middleName: {
			type: STRING(50),
		},
		lastName: {
			type: STRING(50),
			allowNull: false,
		},
		dob: {
			type: STRING(12), // Assuming dob is stored as a string, adjust if date type
			allowNull: false,
		},
		userPassword: {
			type: STRING(80),
			allowNull: false,
		},
		userRole: {
			type: INTEGER,
			allowNull: false,
			references: {
				model: UserRole,
				key: 'ind',
			},
		},
		job: {
			type: INTEGER,
			allowNull: false,
			references: {
				model: Job,
				key: 'ind',
			},
		},
		userConfig: {
			type: JSON,
			allowNull: false,
		},
	},
	{ schema: 'users_schema' }
);
// Define QualificationCategory model
const QualificationCategory = sequelizeClient.define(
	'QualificationCategory',
	{
		ind: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		categoryName: {
			type: STRING(50),
			allowNull: false,
			unique: true,
		},
	},
	{ schema: 'users_schema' }
);
// Define Qualification model
const Qualification = sequelizeClient.define(
	'Qualification',
	{
		username: {
			type: STRING(50),
			allowNull: false,
			references: {
				model: User,
				key: 'username',
			},
		},
		qualificationDescription: {
			type: STRING(75),
			allowNull: false,
		},
		qualificationDate: {
			type: DATE,
			allowNull: false,
		},
		submitDate: {
			type: STRING(12), // Assuming submitDate is stored as a string
		},
		document_file_path: { type: TEXT },
		qualification_category: { type: STRING(50) },
		updated_by: { type: STRING(50) },
	},
	{ schema: 'users_schema' }
);
const UsersContact = sequelizeClient.define(
	'contacts',
	{
		ind: { type: INTEGER, autoIncrement: true, primaryKey: true },
		username: {
			type: STRING(50),
			references: { model: User, key: 'username' },
		},
		contact_description: { type: STRING(75) },
		contact_value: { type: STRING(100) },
		contact_notes: { type: STRING(200) },
		created: { type: STRING(50), references: { model: User, key: 'username' } },
		updated_by: {
			type: STRING(50),
			references: { model: User, key: 'username' },
		},
	},
	{ schema: 'users_schema' }
);
export default User;
