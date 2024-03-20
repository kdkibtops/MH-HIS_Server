import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { job, jobId } from './job';
import type { user_contact, user_contactId } from './user_contact';
import type { user_role, user_roleId } from './user_role';

export interface userAttributes {
	ind: number;
	username?: string;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	dob?: string;
	user_password?: string;
	user_role?: number;
	job?: number;
	user_config?: object;
}

export type userPk = 'ind';
export type userId = user[userPk];
export type userOptionalAttributes =
	| 'ind'
	| 'username'
	| 'first_name'
	| 'middle_name'
	| 'last_name'
	| 'dob'
	| 'user_password'
	| 'user_role'
	| 'job'
	| 'user_config';
export type userCreationAttributes = Optional<
	userAttributes,
	userOptionalAttributes
>;

export class user
	extends Model<userAttributes, userCreationAttributes>
	implements userAttributes
{
	ind!: number;
	username?: string;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	dob?: string;
	user_password?: string;
	user_role?: number;
	job?: number;
	user_config?: object;

	// user belongsTo job via job
	job_job!: job;
	getJob_job!: Sequelize.BelongsToGetAssociationMixin<job>;
	setJob_job!: Sequelize.BelongsToSetAssociationMixin<job, jobId>;
	createJob_job!: Sequelize.BelongsToCreateAssociationMixin<job>;
	// user hasMany user_contact via created_by
	user_contacts!: user_contact[];
	getUser_contacts!: Sequelize.HasManyGetAssociationsMixin<user_contact>;
	setUser_contacts!: Sequelize.HasManySetAssociationsMixin<
		user_contact,
		user_contactId
	>;
	addUser_contact!: Sequelize.HasManyAddAssociationMixin<
		user_contact,
		user_contactId
	>;
	addUser_contacts!: Sequelize.HasManyAddAssociationsMixin<
		user_contact,
		user_contactId
	>;
	createUser_contact!: Sequelize.HasManyCreateAssociationMixin<user_contact>;
	removeUser_contact!: Sequelize.HasManyRemoveAssociationMixin<
		user_contact,
		user_contactId
	>;
	removeUser_contacts!: Sequelize.HasManyRemoveAssociationsMixin<
		user_contact,
		user_contactId
	>;
	hasUser_contact!: Sequelize.HasManyHasAssociationMixin<
		user_contact,
		user_contactId
	>;
	hasUser_contacts!: Sequelize.HasManyHasAssociationsMixin<
		user_contact,
		user_contactId
	>;
	countUser_contacts!: Sequelize.HasManyCountAssociationsMixin;
	// user hasMany user_contact via updated_by
	updated_by_user_contacts!: user_contact[];
	getUpdated_by_user_contacts!: Sequelize.HasManyGetAssociationsMixin<user_contact>;
	setUpdated_by_user_contacts!: Sequelize.HasManySetAssociationsMixin<
		user_contact,
		user_contactId
	>;
	addUpdated_by_user_contact!: Sequelize.HasManyAddAssociationMixin<
		user_contact,
		user_contactId
	>;
	addUpdated_by_user_contacts!: Sequelize.HasManyAddAssociationsMixin<
		user_contact,
		user_contactId
	>;
	createUpdated_by_user_contact!: Sequelize.HasManyCreateAssociationMixin<user_contact>;
	removeUpdated_by_user_contact!: Sequelize.HasManyRemoveAssociationMixin<
		user_contact,
		user_contactId
	>;
	removeUpdated_by_user_contacts!: Sequelize.HasManyRemoveAssociationsMixin<
		user_contact,
		user_contactId
	>;
	hasUpdated_by_user_contact!: Sequelize.HasManyHasAssociationMixin<
		user_contact,
		user_contactId
	>;
	hasUpdated_by_user_contacts!: Sequelize.HasManyHasAssociationsMixin<
		user_contact,
		user_contactId
	>;
	countUpdated_by_user_contacts!: Sequelize.HasManyCountAssociationsMixin;
	// user hasMany user_contact via user_ind
	user_ind_user_contacts!: user_contact[];
	getUser_ind_user_contacts!: Sequelize.HasManyGetAssociationsMixin<user_contact>;
	setUser_ind_user_contacts!: Sequelize.HasManySetAssociationsMixin<
		user_contact,
		user_contactId
	>;
	addUser_ind_user_contact!: Sequelize.HasManyAddAssociationMixin<
		user_contact,
		user_contactId
	>;
	addUser_ind_user_contacts!: Sequelize.HasManyAddAssociationsMixin<
		user_contact,
		user_contactId
	>;
	createUser_ind_user_contact!: Sequelize.HasManyCreateAssociationMixin<user_contact>;
	removeUser_ind_user_contact!: Sequelize.HasManyRemoveAssociationMixin<
		user_contact,
		user_contactId
	>;
	removeUser_ind_user_contacts!: Sequelize.HasManyRemoveAssociationsMixin<
		user_contact,
		user_contactId
	>;
	hasUser_ind_user_contact!: Sequelize.HasManyHasAssociationMixin<
		user_contact,
		user_contactId
	>;
	hasUser_ind_user_contacts!: Sequelize.HasManyHasAssociationsMixin<
		user_contact,
		user_contactId
	>;
	countUser_ind_user_contacts!: Sequelize.HasManyCountAssociationsMixin;
	// user belongsTo user_role via user_role
	user_role_user_role!: user_role;
	getUser_role_user_role!: Sequelize.BelongsToGetAssociationMixin<user_role>;
	setUser_role_user_role!: Sequelize.BelongsToSetAssociationMixin<
		user_role,
		user_roleId
	>;
	createUser_role_user_role!: Sequelize.BelongsToCreateAssociationMixin<user_role>;

	static initModel(sequelize: Sequelize.Sequelize): typeof user {
		return sequelize.define(
			'user',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				username: {
					type: DataTypes.STRING(50),
					allowNull: true,
					unique: 'user_username_key',
				},
				first_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				middle_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				last_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				dob: {
					type: DataTypes.STRING(12),
					allowNull: true,
				},
				user_password: {
					type: DataTypes.STRING(80),
					allowNull: true,
				},
				user_role: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'user_role',
						key: 'ind',
					},
				},
				job: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'job',
						key: 'ind',
					},
				},
				user_config: {
					type: DataTypes.JSON,
					allowNull: true,
				},
			},
			{
				tableName: 'user',
				schema: 'users',
				timestamps: true,
				indexes: [
					{
						name: 'user_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
					{
						name: 'user_username_key',
						unique: true,
						fields: [{ name: 'username' }],
					},
				],
			}
		) as typeof user;
	}
}
