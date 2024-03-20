import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from '../Users/user';

export interface payment_categoryAttributes {
	ind: number;
	id?: number;
	payment_name?: string;
	account?: string;
	max_coverage_limit?: number;
	payment_range_in_days?: number;
	created_by?: number;
	updated_by?: number;
}

export type payment_categoryPk = 'ind';
export type payment_categoryId = payment_category[payment_categoryPk];
export type payment_categoryOptionalAttributes =
	| 'ind'
	| 'id'
	| 'payment_name'
	| 'account'
	| 'max_coverage_limit'
	| 'payment_range_in_days'
	| 'created_by'
	| 'updated_by';
export type payment_categoryCreationAttributes = Optional<
	payment_categoryAttributes,
	payment_categoryOptionalAttributes
>;

export class payment_category
	extends Model<payment_categoryAttributes, payment_categoryCreationAttributes>
	implements payment_categoryAttributes
{
	ind!: number;
	id?: number;
	payment_name?: string;
	account?: string;
	max_coverage_limit?: number;
	payment_range_in_days?: number;
	created_by?: number;
	updated_by?: number;

	// payment_category belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// payment_category belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof payment_category {
		return sequelize.define(
			'payment_category',
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
					unique: 'payment_category_id_key',
				},
				payment_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				account: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				max_coverage_limit: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				payment_range_in_days: {
					type: DataTypes.INTEGER,
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
				tableName: 'payment_category',
				schema: 'finance',
				timestamps: true,
				indexes: [
					{
						name: 'payment_category_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'payment_category_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof payment_category;
	}
}
