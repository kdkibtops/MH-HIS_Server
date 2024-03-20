import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { procedure, procedureId } from './procedure';
import type { user, userId } from '../Users/user';

export interface paperworkAttributes {
	ind: number;
	procedure_ind?: number;
	document_name?: number;
	document_description?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;
}

export type paperworkPk = 'ind';
export type paperworkId = paperwork[paperworkPk];
export type paperworkOptionalAttributes =
	| 'ind'
	| 'procedure_ind'
	| 'document_name'
	| 'document_description'
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
	procedure_ind?: number;
	document_name?: number;
	document_description?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;

	// paperwork belongsTo procedure via procedure_ind
	procedure_ind_procedure!: procedure;
	getProcedure_ind_procedure!: Sequelize.BelongsToGetAssociationMixin<procedure>;
	setProcedure_ind_procedure!: Sequelize.BelongsToSetAssociationMixin<
		procedure,
		procedureId
	>;
	createProcedure_ind_procedure!: Sequelize.BelongsToCreateAssociationMixin<procedure>;
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
				procedure_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'procedure',
						key: 'ind',
					},
				},
				document_name: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				document_description: {
					type: DataTypes.STRING(150),
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
				schema: 'procedures_schema',
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
