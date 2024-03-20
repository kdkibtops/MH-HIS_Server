import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
	external_lab_test,
	external_lab_testId,
} from './external_lab_test';
import type { order, orderId } from './order';
import type { user, userId } from '../Users/user';

export interface external_labAttributes {
	ind: number;
	id?: number;
	lab_name?: string;
	full_address?: string;
	city?: string;
	country?: string;
	district?: string;
	primary_contact?: string;
	secondary_contact?: string;
	emergency_contact?: string;
	email?: string;
	result_range_in_hours?: number;
	payment_range_in_days?: number;
	created_by?: number;
	updated_by?: number;
}

export type external_labPk = 'ind';
export type external_labId = external_lab[external_labPk];
export type external_labOptionalAttributes =
	| 'ind'
	| 'id'
	| 'lab_name'
	| 'full_address'
	| 'city'
	| 'country'
	| 'district'
	| 'primary_contact'
	| 'secondary_contact'
	| 'emergency_contact'
	| 'email'
	| 'result_range_in_hours'
	| 'payment_range_in_days'
	| 'created_by'
	| 'updated_by';
export type external_labCreationAttributes = Optional<
	external_labAttributes,
	external_labOptionalAttributes
>;

export class external_lab
	extends Model<external_labAttributes, external_labCreationAttributes>
	implements external_labAttributes
{
	ind!: number;
	id?: number;
	lab_name?: string;
	full_address?: string;
	city?: string;
	country?: string;
	district?: string;
	primary_contact?: string;
	secondary_contact?: string;
	emergency_contact?: string;
	email?: string;
	result_range_in_hours?: number;
	payment_range_in_days?: number;
	created_by?: number;
	updated_by?: number;

	// external_lab hasMany external_lab_test via external_lab_id
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
	// external_lab hasMany order via test_location
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
	// external_lab belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// external_lab belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof external_lab {
		return sequelize.define(
			'external_lab',
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
					unique: 'external_lab_id_key',
				},
				lab_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				full_address: {
					type: DataTypes.STRING(150),
					allowNull: true,
				},
				city: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				country: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				district: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				primary_contact: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				secondary_contact: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				emergency_contact: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				email: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				result_range_in_hours: {
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
				tableName: 'external_lab',
				schema: 'laboratory',
				timestamps: true,
				indexes: [
					{
						name: 'external_lab_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'external_lab_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof external_lab;
	}
}
