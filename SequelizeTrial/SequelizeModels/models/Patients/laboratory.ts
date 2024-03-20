import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface laboratoryAttributes {
	ind: number;
	patient_ind?: number;
	lab_date?: string;
	test_name?: string;
	entity_name?: string;
	entity_value?: string;
	created_by?: number;
	updated_by?: number;
}

export type laboratoryPk = 'ind';
export type laboratoryId = laboratory[laboratoryPk];
export type laboratoryOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'lab_date'
	| 'test_name'
	| 'entity_name'
	| 'entity_value'
	| 'created_by'
	| 'updated_by';
export type laboratoryCreationAttributes = Optional<
	laboratoryAttributes,
	laboratoryOptionalAttributes
>;

export class laboratory
	extends Model<laboratoryAttributes, laboratoryCreationAttributes>
	implements laboratoryAttributes
{
	ind!: number;
	patient_ind?: number;
	lab_date?: string;
	test_name?: string;
	entity_name?: string;
	entity_value?: string;
	created_by?: number;
	updated_by?: number;

	// laboratory belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// laboratory belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// laboratory belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof laboratory {
		return sequelize.define(
			'laboratory',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				patient_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'personal',
						key: 'ind',
					},
				},
				lab_date: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				test_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				entity_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				entity_value: {
					type: DataTypes.STRING(15),
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
				tableName: 'laboratory',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'laboratory_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof laboratory;
	}
}
