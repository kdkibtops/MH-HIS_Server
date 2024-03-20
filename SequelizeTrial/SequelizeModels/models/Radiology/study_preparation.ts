import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { study, studyId } from './study';
import type { user, userId } from '../Users/user';

export interface study_preparationAttributes {
	ind: number;
	hint_text?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;
}

export type study_preparationPk = 'ind';
export type study_preparationId = study_preparation[study_preparationPk];
export type study_preparationOptionalAttributes =
	| 'ind'
	| 'hint_text'
	| 'document_file_path'
	| 'created_by'
	| 'updated_by';
export type study_preparationCreationAttributes = Optional<
	study_preparationAttributes,
	study_preparationOptionalAttributes
>;

export class study_preparation
	extends Model<
		study_preparationAttributes,
		study_preparationCreationAttributes
	>
	implements study_preparationAttributes
{
	ind!: number;
	hint_text?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;

	// study_preparation hasMany study via study_preparation
	studies!: study[];
	getStudies!: Sequelize.HasManyGetAssociationsMixin<study>;
	setStudies!: Sequelize.HasManySetAssociationsMixin<study, studyId>;
	addStudy!: Sequelize.HasManyAddAssociationMixin<study, studyId>;
	addStudies!: Sequelize.HasManyAddAssociationsMixin<study, studyId>;
	createStudy!: Sequelize.HasManyCreateAssociationMixin<study>;
	removeStudy!: Sequelize.HasManyRemoveAssociationMixin<study, studyId>;
	removeStudies!: Sequelize.HasManyRemoveAssociationsMixin<study, studyId>;
	hasStudy!: Sequelize.HasManyHasAssociationMixin<study, studyId>;
	hasStudies!: Sequelize.HasManyHasAssociationsMixin<study, studyId>;
	countStudies!: Sequelize.HasManyCountAssociationsMixin;
	// study_preparation belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// study_preparation belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof study_preparation {
		return sequelize.define(
			'study_preparation',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				hint_text: {
					type: DataTypes.TEXT,
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
				tableName: 'study_preparation',
				schema: 'radiology',
				timestamps: true,
				indexes: [
					{
						name: 'study_preparation_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof study_preparation;
	}
}
