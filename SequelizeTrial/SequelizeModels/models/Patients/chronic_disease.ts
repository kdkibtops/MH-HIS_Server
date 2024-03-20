import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface chronic_diseaseAttributes {
	ind: number;
	patient_ind?: number;
	disease_name?: string;
	organ?: string;
	system_affected?: string;
	created_by?: number;
	updated_by?: number;
}

export type chronic_diseasePk = 'ind';
export type chronic_diseaseId = chronic_disease[chronic_diseasePk];
export type chronic_diseaseOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'disease_name'
	| 'organ'
	| 'system_affected'
	| 'created_by'
	| 'updated_by';
export type chronic_diseaseCreationAttributes = Optional<
	chronic_diseaseAttributes,
	chronic_diseaseOptionalAttributes
>;

export class chronic_disease
	extends Model<chronic_diseaseAttributes, chronic_diseaseCreationAttributes>
	implements chronic_diseaseAttributes
{
	ind!: number;
	patient_ind?: number;
	disease_name?: string;
	organ?: string;
	system_affected?: string;
	created_by?: number;
	updated_by?: number;

	// chronic_disease belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// chronic_disease belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// chronic_disease belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof chronic_disease {
		return sequelize.define(
			'chronic_disease',
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
				disease_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				organ: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				system_affected: {
					type: DataTypes.STRING(50),
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
				tableName: 'chronic_disease',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'chronic_disease_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof chronic_disease;
	}
}
