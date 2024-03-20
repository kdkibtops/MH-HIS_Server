import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface patients_contactAttributes {
	ind: number;
	patient_ind?: number;
	contact_description?: string;
	contact_value?: string;
	contact_notes?: string;
	created_by?: number;
	updated_by?: number;
}

export type patients_contactPk = 'ind';
export type patients_contactId = patients_contact[patients_contactPk];
export type patients_contactOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'contact_description'
	| 'contact_value'
	| 'contact_notes'
	| 'created_by'
	| 'updated_by';
export type patients_contactCreationAttributes = Optional<
	patients_contactAttributes,
	patients_contactOptionalAttributes
>;

export class patients_contact
	extends Model<patients_contactAttributes, patients_contactCreationAttributes>
	implements patients_contactAttributes
{
	ind!: number;
	patient_ind?: number;
	contact_description?: string;
	contact_value?: string;
	contact_notes?: string;
	created_by?: number;
	updated_by?: number;

	// patients_contact belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// patients_contact belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// patients_contact belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof patients_contact {
		return sequelize.define(
			'patients_contact',
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
				contact_description: {
					type: DataTypes.STRING(75),
					allowNull: true,
				},
				contact_value: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				contact_notes: {
					type: DataTypes.STRING(200),
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
				tableName: 'patients_contact',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'patients_contact_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof patients_contact;
	}
}
