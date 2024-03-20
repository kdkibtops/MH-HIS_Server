import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface user_roleAttributes {
	ind: number;
	id?: number;
	role_name?: string;
	role_privileges?: object;
}

export type user_rolePk = 'ind';
export type user_roleId = user_role[user_rolePk];
export type user_roleOptionalAttributes =
	| 'ind'
	| 'id'
	| 'role_name'
	| 'role_privileges';
export type user_roleCreationAttributes = Optional<
	user_roleAttributes,
	user_roleOptionalAttributes
>;

export class user_role
	extends Model<user_roleAttributes, user_roleCreationAttributes>
	implements user_roleAttributes
{
	ind!: number;
	id?: number;
	role_name?: string;
	role_privileges?: object;

	// user_role hasMany user via user_role
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

	static initModel(sequelize: Sequelize.Sequelize): typeof user_role {
		return sequelize.define(
			'user_role',
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
					unique: 'user_role_id_key',
				},
				role_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				role_privileges: {
					type: DataTypes.JSON,
					allowNull: true,
				},
			},
			{
				tableName: 'user_role',
				schema: 'users',
				timestamps: true,
				indexes: [
					{
						name: 'user_role_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'user_role_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof user_role;
	}
}
