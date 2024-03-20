import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from '../Users/user';

export interface categoriesAttributes {
	ind: number;
	id?: string;
	category_name?: string;
	created_by?: number;
	updated_by?: number;
}

export type categoriesPk = 'ind';
export type categoriesId = categories[categoriesPk];
export type categoriesOptionalAttributes =
	| 'ind'
	| 'id'
	| 'category_name'
	| 'created_by'
	| 'updated_by';
export type categoriesCreationAttributes = Optional<
	categoriesAttributes,
	categoriesOptionalAttributes
>;

export class categories
	extends Model<categoriesAttributes, categoriesCreationAttributes>
	implements categoriesAttributes
{
	ind!: number;
	id?: string;
	category_name?: string;
	created_by?: number;
	updated_by?: number;

	// categories belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// categories belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof categories {
		return sequelize.define(
			'categories',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.STRING(50),
					allowNull: true,
					unique: 'categories_id_key',
				},
				category_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				created_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
				updated_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
			},
			{
				tableName: 'categories',
				schema: 'inventory',
				timestamps: true,
				indexes: [
					{
						name: 'categories_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'categories_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof categories;
	}
}
