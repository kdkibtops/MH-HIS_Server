import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface user_contactAttributes {
	ind: number;
	user_ind?: number;
	contact_description?: string;
	contact_value?: string;
	contact_notes?: string;
	created_by?: number;
	updated_by?: number;
}

export type user_contactPk = 'ind';
export type user_contactId = user_contact[user_contactPk];
export type user_contactOptionalAttributes =
	| 'ind'
	| 'user_ind'
	| 'contact_description'
	| 'contact_value'
	| 'contact_notes'
	| 'created_by'
	| 'updated_by';
export type user_contactCreationAttributes = Optional<
	user_contactAttributes,
	user_contactOptionalAttributes
>;

export class user_contact
	extends Model<user_contactAttributes, user_contactCreationAttributes>
	implements user_contactAttributes
{
	ind!: number;
	user_ind?: number;
	contact_description?: string;
	contact_value?: string;
	contact_notes?: string;
	created_by?: number;
	updated_by?: number;

	// user_contact belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// user_contact belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// user_contact belongsTo user via user_ind
	user_ind_user!: user;
	getUser_ind_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUser_ind_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUser_ind_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof user_contact {
		return sequelize.define(
			'user_contact',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				user_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'user',
						key: 'ind',
					},
				},
				contact_description: {
					type: DataTypes.STRING(75),
					allowNull: true,
				},
				contact_value: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				contact_notes: {
					type: DataTypes.STRING(200),
					allowNull: true,
				},
				created_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'user',
						key: 'ind',
					},
				},
				updated_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'user',
						key: 'ind',
					},
				},
			},
			{
				tableName: 'user_contact',
				schema: 'users',
				timestamps: true,
				indexes: [
					{
						name: 'user_contact_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof user_contact;
	}
}
