import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface interventionAttributes {
	ind: number;
	patient_ind?: number;
	intervention_name?: string;
	intervention_date?: string;
	complications?: string;
	created_by?: number;
	updated_by?: number;
}

export type interventionPk = 'ind';
export type interventionId = intervention[interventionPk];
export type interventionOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'intervention_name'
	| 'intervention_date'
	| 'complications'
	| 'created_by'
	| 'updated_by';
export type interventionCreationAttributes = Optional<
	interventionAttributes,
	interventionOptionalAttributes
>;

export class intervention
	extends Model<interventionAttributes, interventionCreationAttributes>
	implements interventionAttributes
{
	ind!: number;
	patient_ind?: number;
	intervention_name?: string;
	intervention_date?: string;
	complications?: string;
	created_by?: number;
	updated_by?: number;

	// intervention belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// intervention belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// intervention belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof intervention {
		return sequelize.define(
			'intervention',
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
				intervention_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				intervention_date: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				complications: {
					type: DataTypes.TEXT,
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
				tableName: 'intervention',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'intervention_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof intervention;
	}
}
