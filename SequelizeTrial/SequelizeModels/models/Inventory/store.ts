import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { material, materialId } from './material';
import type { user, userId } from '../Users/user';

export interface storeAttributes {
	ind: number;
	id?: string;
	store_name?: string;
	store_location?: string;
	trustee?: number;
	created_by?: number;
	updated_by?: number;
}

export type storePk = 'ind';
export type storeId = store[storePk];
export type storeOptionalAttributes =
	| 'ind'
	| 'id'
	| 'store_name'
	| 'store_location'
	| 'trustee'
	| 'created_by'
	| 'updated_by';
export type storeCreationAttributes = Optional<
	storeAttributes,
	storeOptionalAttributes
>;

export class store
	extends Model<storeAttributes, storeCreationAttributes>
	implements storeAttributes
{
	ind!: number;
	id?: string;
	store_name?: string;
	store_location?: string;
	trustee?: number;
	created_by?: number;
	updated_by?: number;

	// store hasMany material via category
	materials!: material[];
	getMaterials!: Sequelize.HasManyGetAssociationsMixin<material>;
	setMaterials!: Sequelize.HasManySetAssociationsMixin<material, materialId>;
	addMaterial!: Sequelize.HasManyAddAssociationMixin<material, materialId>;
	addMaterials!: Sequelize.HasManyAddAssociationsMixin<material, materialId>;
	createMaterial!: Sequelize.HasManyCreateAssociationMixin<material>;
	removeMaterial!: Sequelize.HasManyRemoveAssociationMixin<
		material,
		materialId
	>;
	removeMaterials!: Sequelize.HasManyRemoveAssociationsMixin<
		material,
		materialId
	>;
	hasMaterial!: Sequelize.HasManyHasAssociationMixin<material, materialId>;
	hasMaterials!: Sequelize.HasManyHasAssociationsMixin<material, materialId>;
	countMaterials!: Sequelize.HasManyCountAssociationsMixin;
	// store hasMany material via store_id
	store_materials!: material[];
	getStore_materials!: Sequelize.HasManyGetAssociationsMixin<material>;
	setStore_materials!: Sequelize.HasManySetAssociationsMixin<
		material,
		materialId
	>;
	addStore_material!: Sequelize.HasManyAddAssociationMixin<
		material,
		materialId
	>;
	addStore_materials!: Sequelize.HasManyAddAssociationsMixin<
		material,
		materialId
	>;
	createStore_material!: Sequelize.HasManyCreateAssociationMixin<material>;
	removeStore_material!: Sequelize.HasManyRemoveAssociationMixin<
		material,
		materialId
	>;
	removeStore_materials!: Sequelize.HasManyRemoveAssociationsMixin<
		material,
		materialId
	>;
	hasStore_material!: Sequelize.HasManyHasAssociationMixin<
		material,
		materialId
	>;
	hasStore_materials!: Sequelize.HasManyHasAssociationsMixin<
		material,
		materialId
	>;
	countStore_materials!: Sequelize.HasManyCountAssociationsMixin;
	// store belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// store belongsTo user via trustee
	trustee_user!: user;
	getTrustee_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setTrustee_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createTrustee_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// store belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof store {
		return sequelize.define(
			'store',
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
					unique: 'store_id_key',
				},
				store_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				store_location: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				trustee: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
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
				tableName: 'store',
				schema: 'inventory',
				timestamps: true,
				indexes: [
					{
						name: 'store_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'store_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof store;
	}
}
