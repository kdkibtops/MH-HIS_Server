import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface paperworkAttributes {
	ind: number;
	patient_ind?: number;
	document_description?: string;
	document_date?: string;
	submit_date?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;
}

export type paperworkPk = 'ind';
export type paperworkId = paperwork[paperworkPk];
export type paperworkOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'document_description'
	| 'document_date'
	| 'submit_date'
	| 'document_file_path'
	| 'created_by'
	| 'updated_by';
export type paperworkCreationAttributes = Optional<
	paperworkAttributes,
	paperworkOptionalAttributes
>;

export class paperwork
	extends Model<paperworkAttributes, paperworkCreationAttributes>
	implements paperworkAttributes
{
	ind!: number;
	patient_ind?: number;
	document_description?: string;
	document_date?: string;
	submit_date?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;

	// paperwork belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// paperwork belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// paperwork belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof paperwork {
		return sequelize.define(
			'paperwork',
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
				document_description: {
					type: DataTypes.STRING(150),
					allowNull: true,
				},
				document_date: {
					type: DataTypes.STRING(12),
					allowNull: true,
				},
				submit_date: {
					type: DataTypes.STRING(12),
					allowNull: true,
				},
				document_file_path: {
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
				tableName: 'paperwork',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'paperwork_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof paperwork;
	}
}
