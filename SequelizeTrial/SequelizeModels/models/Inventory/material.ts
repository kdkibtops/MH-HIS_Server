import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { store, storeId } from './store';
import type { user, userId } from '../Users/user';

export interface materialAttributes {
	ind: number;
	id?: string;
	sku?: string;
	item_name?: string;
	category?: number;
	store_id?: number;
	price?: number;
	stock?: number;
	created_by?: number;
	updated_by?: number;
}

export type materialPk = 'ind';
export type materialId = material[materialPk];
export type materialOptionalAttributes =
	| 'ind'
	| 'id'
	| 'sku'
	| 'item_name'
	| 'category'
	| 'store_id'
	| 'price'
	| 'stock'
	| 'created_by'
	| 'updated_by';
export type materialCreationAttributes = Optional<
	materialAttributes,
	materialOptionalAttributes
>;

export class material
	extends Model<materialAttributes, materialCreationAttributes>
	implements materialAttributes
{
	ind!: number;
	id?: string;
	sku?: string;
	item_name?: string;
	category?: number;
	store_id?: number;
	price?: number;
	stock?: number;
	created_by?: number;
	updated_by?: number;

	// material belongsTo store via category
	category_store!: store;
	getCategory_store!: Sequelize.BelongsToGetAssociationMixin<store>;
	setCategory_store!: Sequelize.BelongsToSetAssociationMixin<store, storeId>;
	createCategory_store!: Sequelize.BelongsToCreateAssociationMixin<store>;
	// material belongsTo store via store_id
	store!: store;
	getStore!: Sequelize.BelongsToGetAssociationMixin<store>;
	setStore!: Sequelize.BelongsToSetAssociationMixin<store, storeId>;
	createStore!: Sequelize.BelongsToCreateAssociationMixin<store>;
	// material belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// material belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof material {
		return sequelize.define(
			'material',
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
					unique: 'material_id_key',
				},
				sku: {
					type: DataTypes.STRING(12),
					allowNull: true,
				},
				item_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				category: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'store',
						key: 'ind',
					},
				},
				store_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'store',
						key: 'ind',
					},
				},
				price: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				stock: {
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
				tableName: 'material',
				schema: 'inventory',
				timestamps: true,
				indexes: [
					{
						name: 'material_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'material_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof material;
	}
}
