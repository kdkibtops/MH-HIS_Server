import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
	external_lab_test,
	external_lab_testId,
} from './external_lab_test';
import type { order, orderId } from './order';
import type { user, userId } from '../Users/user';

export interface testAttributes {
	ind: number;
	id?: string;
	category?: string;
	test_name?: string;
	arabic_name?: string;
	price?: number;
	created_by?: number;
	updated_by?: number;
}

export type testPk = 'ind';
export type testId = test[testPk];
export type testOptionalAttributes =
	| 'ind'
	| 'id'
	| 'category'
	| 'test_name'
	| 'arabic_name'
	| 'price'
	| 'created_by'
	| 'updated_by';
export type testCreationAttributes = Optional<
	testAttributes,
	testOptionalAttributes
>;

export class test
	extends Model<testAttributes, testCreationAttributes>
	implements testAttributes
{
	ind!: number;
	id?: string;
	category?: string;
	test_name?: string;
	arabic_name?: string;
	price?: number;
	created_by?: number;
	updated_by?: number;

	// test hasMany external_lab_test via test_ind
	external_lab_tests!: external_lab_test[];
	getExternal_lab_tests!: Sequelize.HasManyGetAssociationsMixin<external_lab_test>;
	setExternal_lab_tests!: Sequelize.HasManySetAssociationsMixin<
		external_lab_test,
		external_lab_testId
	>;
	addExternal_lab_test!: Sequelize.HasManyAddAssociationMixin<
		external_lab_test,
		external_lab_testId
	>;
	addExternal_lab_tests!: Sequelize.HasManyAddAssociationsMixin<
		external_lab_test,
		external_lab_testId
	>;
	createExternal_lab_test!: Sequelize.HasManyCreateAssociationMixin<external_lab_test>;
	removeExternal_lab_test!: Sequelize.HasManyRemoveAssociationMixin<
		external_lab_test,
		external_lab_testId
	>;
	removeExternal_lab_tests!: Sequelize.HasManyRemoveAssociationsMixin<
		external_lab_test,
		external_lab_testId
	>;
	hasExternal_lab_test!: Sequelize.HasManyHasAssociationMixin<
		external_lab_test,
		external_lab_testId
	>;
	hasExternal_lab_tests!: Sequelize.HasManyHasAssociationsMixin<
		external_lab_test,
		external_lab_testId
	>;
	countExternal_lab_tests!: Sequelize.HasManyCountAssociationsMixin;
	// test hasMany order via test_ind
	orders!: order[];
	getOrders!: Sequelize.HasManyGetAssociationsMixin<order>;
	setOrders!: Sequelize.HasManySetAssociationsMixin<order, orderId>;
	addOrder!: Sequelize.HasManyAddAssociationMixin<order, orderId>;
	addOrders!: Sequelize.HasManyAddAssociationsMixin<order, orderId>;
	createOrder!: Sequelize.HasManyCreateAssociationMixin<order>;
	removeOrder!: Sequelize.HasManyRemoveAssociationMixin<order, orderId>;
	removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<order, orderId>;
	hasOrder!: Sequelize.HasManyHasAssociationMixin<order, orderId>;
	hasOrders!: Sequelize.HasManyHasAssociationsMixin<order, orderId>;
	countOrders!: Sequelize.HasManyCountAssociationsMixin;
	// test belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// test belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof test {
		return sequelize.define(
			'test',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.STRING(150),
					allowNull: true,
					unique: 'test_id_key',
				},
				category: {
					type: DataTypes.STRING(20),
					allowNull: true,
				},
				test_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				arabic_name: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				price: {
					type: DataTypes.DOUBLE,
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
				tableName: 'test',
				schema: 'laboratory',
				timestamps: true,
				indexes: [
					{
						name: 'test_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'test_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof test;
	}
}
