import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { procedure, procedureId } from './procedure';
import type { study, studyId } from '../Radiology/study';
import type { user, userId } from '../Users/user';

export interface imagingAttributes {
	ind: number;
	procedure_ind?: number;
	study_id?: number;
	created_by?: number;
	updated_by?: number;
}

export type imagingPk = 'ind';
export type imagingId = imaging[imagingPk];
export type imagingOptionalAttributes =
	| 'ind'
	| 'procedure_ind'
	| 'study_id'
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
	procedure_ind?: number;
	study_id?: number;
	created_by?: number;
	updated_by?: number;

	// imaging belongsTo procedure via procedure_ind
	procedure_ind_procedure!: procedure;
	getProcedure_ind_procedure!: Sequelize.BelongsToGetAssociationMixin<procedure>;
	setProcedure_ind_procedure!: Sequelize.BelongsToSetAssociationMixin<
		procedure,
		procedureId
	>;
	createProcedure_ind_procedure!: Sequelize.BelongsToCreateAssociationMixin<procedure>;
	// imaging belongsTo study via study_id
	study!: study;
	getStudy!: Sequelize.BelongsToGetAssociationMixin<study>;
	setStudy!: Sequelize.BelongsToSetAssociationMixin<study, studyId>;
	createStudy!: Sequelize.BelongsToCreateAssociationMixin<study>;
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
				procedure_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'procedure',
						key: 'ind',
					},
				},
				study_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'radiology', tableName: 'study' },
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
				tableName: 'imaging',
				schema: 'procedures_schema',
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
