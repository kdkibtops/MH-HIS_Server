import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface jobAttributes {
	ind: number;
	id?: number;
	job_name?: string;
}

export type jobPk = 'ind';
export type jobId = job[jobPk];
export type jobOptionalAttributes = 'ind' | 'id' | 'job_name';
export type jobCreationAttributes = Optional<
	jobAttributes,
	jobOptionalAttributes
>;

export class job
	extends Model<jobAttributes, jobCreationAttributes>
	implements jobAttributes
{
	ind!: number;
	id?: number;
	job_name?: string;

	// job hasMany user via job
	users!: user[];
	getUsers!: Sequelize.HasManyGetAssociationsMixin<user>;
	setUsers!: Sequelize.HasManySetAssociationsMixin<user, userId>;
	addUser!: Sequelize.HasManyAddAssociationMixin<user, userId>;
	addUsers!: Sequelize.HasManyAddAssociationsMixin<user, userId>;
	createUser!: Sequelize.HasManyCreateAssociationMixin<user>;
	removeUser!: Sequelize.HasManyRemoveAssociationMixin<user, userId>;
	removeUsers!: Sequelize.HasManyRemoveAssociationsMixin<user, userId>;
	hasUser!: Sequelize.HasManyHasAssociationMixin<user, userId>;
	hasUsers!: Sequelize.HasManyHasAssociationsMixin<user, userId>;
	countUsers!: Sequelize.HasManyCountAssociationsMixin;

	static initModel(sequelize: Sequelize.Sequelize): typeof job {
		return sequelize.define(
			'job',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					unique: 'job_id_key',
				},
				job_name: {
					type: DataTypes.STRING(70),
					allowNull: true,
				},
			},
			{
				tableName: 'job',
				schema: 'users',
				timestamps: true,
				indexes: [
					{
						name: 'job_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'job_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof job;
	}
}
