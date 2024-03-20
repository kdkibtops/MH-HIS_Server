import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface qualification_categoryAttributes {
	ind: number;
	category_name?: string;
	category_description?: string;
}

export type qualification_categoryPk = 'ind';
export type qualification_categoryId =
	qualification_category[qualification_categoryPk];
export type qualification_categoryOptionalAttributes =
	| 'ind'
	| 'category_name'
	| 'category_description';
export type qualification_categoryCreationAttributes = Optional<
	qualification_categoryAttributes,
	qualification_categoryOptionalAttributes
>;

export class qualification_category
	extends Model<
		qualification_categoryAttributes,
		qualification_categoryCreationAttributes
	>
	implements qualification_categoryAttributes
{
	ind!: number;
	category_name?: string;
	category_description?: string;

	static initModel(
		sequelize: Sequelize.Sequelize
	): typeof qualification_category {
		return sequelize.define(
			'qualification_category',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				category_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
					unique: 'qualification_category_category_name_key',
				},
				category_description: {
					type: DataTypes.STRING(200),
					allowNull: true,
				},
			},
			{
				tableName: 'qualification_category',
				schema: 'users',
				timestamps: true,
				indexes: [
					{
						name: 'qualification_category_category_name_key',
						unique: true,
						fields: [{ name: 'category_name' }],
					},
					{
						name: 'qualification_category_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof qualification_category;
	}
}
