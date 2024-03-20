import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { external_lab, external_labId } from './external_lab';
import type { test, testId } from './test';
import type { user, userId } from '../Users/user';

export interface external_lab_testAttributes {
	ind: number;
	test_ind?: number;
	external_lab_id?: number;
	created_by?: number;
	updated_by?: number;
}

export type external_lab_testPk = 'ind';
export type external_lab_testId = external_lab_test[external_lab_testPk];
export type external_lab_testOptionalAttributes =
	| 'ind'
	| 'test_ind'
	| 'external_lab_id'
	| 'created_by'
	| 'updated_by';
export type external_lab_testCreationAttributes = Optional<
	external_lab_testAttributes,
	external_lab_testOptionalAttributes
>;

export class external_lab_test
	extends Model<
		external_lab_testAttributes,
		external_lab_testCreationAttributes
	>
	implements external_lab_testAttributes
{
	ind!: number;
	test_ind?: number;
	external_lab_id?: number;
	created_by?: number;
	updated_by?: number;

	// external_lab_test belongsTo external_lab via external_lab_id
	external_lab!: external_lab;
	getExternal_lab!: Sequelize.BelongsToGetAssociationMixin<external_lab>;
	setExternal_lab!: Sequelize.BelongsToSetAssociationMixin<
		external_lab,
		external_labId
	>;
	createExternal_lab!: Sequelize.BelongsToCreateAssociationMixin<external_lab>;
	// external_lab_test belongsTo test via test_ind
	test_ind_test!: test;
	getTest_ind_test!: Sequelize.BelongsToGetAssociationMixin<test>;
	setTest_ind_test!: Sequelize.BelongsToSetAssociationMixin<test, testId>;
	createTest_ind_test!: Sequelize.BelongsToCreateAssociationMixin<test>;
	// external_lab_test belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// external_lab_test belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof external_lab_test {
		return sequelize.define(
			'external_lab_test',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				test_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'test',
						key: 'ind',
					},
				},
				external_lab_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'external_lab',
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
				tableName: 'external_lab_test',
				schema: 'laboratory',
				timestamps: true,
				indexes: [
					{
						name: 'external_lab_test_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof external_lab_test;
	}
}
