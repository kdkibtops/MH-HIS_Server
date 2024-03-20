import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { procedure, procedureId } from './procedure';
import type { test, testId } from '../Laboratory/test';
import type { user, userId } from '../Users/user';

export interface labAttributes {
	ind: number;
	procedure_ind?: number;
	test_id?: number;
	max_limit?: number;
	min_limit?: number;
	created_by?: number;
	updated_by?: number;
}

export type labPk = 'ind';
export type labId = lab[labPk];
export type labOptionalAttributes =
	| 'ind'
	| 'procedure_ind'
	| 'test_id'
	| 'max_limit'
	| 'min_limit'
	| 'created_by'
	| 'updated_by';
export type labCreationAttributes = Optional<
	labAttributes,
	labOptionalAttributes
>;

export class lab
	extends Model<labAttributes, labCreationAttributes>
	implements labAttributes
{
	ind!: number;
	procedure_ind?: number;
	test_id?: number;
	max_limit?: number;
	min_limit?: number;
	created_by?: number;
	updated_by?: number;

	// lab belongsTo procedure via procedure_ind
	procedure_ind_procedure!: procedure;
	getProcedure_ind_procedure!: Sequelize.BelongsToGetAssociationMixin<procedure>;
	setProcedure_ind_procedure!: Sequelize.BelongsToSetAssociationMixin<
		procedure,
		procedureId
	>;
	createProcedure_ind_procedure!: Sequelize.BelongsToCreateAssociationMixin<procedure>;
	// lab belongsTo test via test_id
	test!: test;
	getTest!: Sequelize.BelongsToGetAssociationMixin<test>;
	setTest!: Sequelize.BelongsToSetAssociationMixin<test, testId>;
	createTest!: Sequelize.BelongsToCreateAssociationMixin<test>;
	// lab belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// lab belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof lab {
		return sequelize.define(
			'lab',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				procedure_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'procedure',
						key: 'ind',
					},
				},
				test_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'laboratory', tableName: 'test' },
						key: 'ind',
					},
				},
				max_limit: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				min_limit: {
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
				tableName: 'lab',
				schema: 'procedures_schema',
				timestamps: true,
				indexes: [
					{
						name: 'lab_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof lab;
	}
}
