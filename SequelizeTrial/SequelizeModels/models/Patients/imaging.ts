import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface imagingAttributes {
	ind: number;
	patient_ind?: number;
	study_date?: string;
	study_name?: string;
	entity_name?: string;
	entity_value?: string;
	created_by?: number;
	updated_by?: number;
}

export type imagingPk = 'ind';
export type imagingId = imaging[imagingPk];
export type imagingOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'study_date'
	| 'study_name'
	| 'entity_name'
	| 'entity_value'
	| 'created_by'
	| 'updated_by';
export type imagingCreationAttributes = Optional<
	imagingAttributes,
	imagingOptionalAttributes
>;

export class imaging
	extends Model<imagingAttributes, imagingCreationAttributes>
	implements imagingAttributes
{
	ind!: number;
	patient_ind?: number;
	study_date?: string;
	study_name?: string;
	entity_name?: string;
	entity_value?: string;
	created_by?: number;
	updated_by?: number;

	// imaging belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// imaging belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// imaging belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof imaging {
		return sequelize.define(
			'imaging',
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
				study_date: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				study_name: {
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
				tableName: 'imaging',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'imaging_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof imaging;
	}
}
