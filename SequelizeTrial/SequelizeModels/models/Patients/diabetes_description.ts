import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clinical, clinicalId } from './clinical';
import type { user, userId } from '../Users/user';

export interface diabetes_descriptionAttributes {
	ind: number;
	max_fasting?: number;
	min_fasting?: number;
	max_post_prandial?: number;
	min_post_prandial?: number;
	max_hba1c?: number;
	min_hba1c?: number;
	retina?: string;
	kidney?: string;
	coronaries?: string;
	cerebral?: string;
	neuropathy?: string;
	created_by?: number;
	updated_by?: number;
}

export type diabetes_descriptionPk = 'ind';
export type diabetes_descriptionId =
	diabetes_description[diabetes_descriptionPk];
export type diabetes_descriptionOptionalAttributes =
	| 'ind'
	| 'max_fasting'
	| 'min_fasting'
	| 'max_post_prandial'
	| 'min_post_prandial'
	| 'max_hba1c'
	| 'min_hba1c'
	| 'retina'
	| 'kidney'
	| 'coronaries'
	| 'cerebral'
	| 'neuropathy'
	| 'created_by'
	| 'updated_by';
export type diabetes_descriptionCreationAttributes = Optional<
	diabetes_descriptionAttributes,
	diabetes_descriptionOptionalAttributes
>;

export class diabetes_description
	extends Model<
		diabetes_descriptionAttributes,
		diabetes_descriptionCreationAttributes
	>
	implements diabetes_descriptionAttributes
{
	ind!: number;
	max_fasting?: number;
	min_fasting?: number;
	max_post_prandial?: number;
	min_post_prandial?: number;
	max_hba1c?: number;
	min_hba1c?: number;
	retina?: string;
	kidney?: string;
	coronaries?: string;
	cerebral?: string;
	neuropathy?: string;
	created_by?: number;
	updated_by?: number;

	// diabetes_description hasMany clinical via dm
	clinicals!: clinical[];
	getClinicals!: Sequelize.HasManyGetAssociationsMixin<clinical>;
	setClinicals!: Sequelize.HasManySetAssociationsMixin<clinical, clinicalId>;
	addClinical!: Sequelize.HasManyAddAssociationMixin<clinical, clinicalId>;
	addClinicals!: Sequelize.HasManyAddAssociationsMixin<clinical, clinicalId>;
	createClinical!: Sequelize.HasManyCreateAssociationMixin<clinical>;
	removeClinical!: Sequelize.HasManyRemoveAssociationMixin<
		clinical,
		clinicalId
	>;
	removeClinicals!: Sequelize.HasManyRemoveAssociationsMixin<
		clinical,
		clinicalId
	>;
	hasClinical!: Sequelize.HasManyHasAssociationMixin<clinical, clinicalId>;
	hasClinicals!: Sequelize.HasManyHasAssociationsMixin<clinical, clinicalId>;
	countClinicals!: Sequelize.HasManyCountAssociationsMixin;
	// diabetes_description belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// diabetes_description belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(
		sequelize: Sequelize.Sequelize
	): typeof diabetes_description {
		return sequelize.define(
			'diabetes_description',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				max_fasting: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				min_fasting: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				max_post_prandial: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				min_post_prandial: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				max_hba1c: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				min_hba1c: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				retina: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				kidney: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				coronaries: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				cerebral: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				neuropathy: {
					type: DataTypes.STRING(100),
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
				tableName: 'diabetes_description',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'diabetes_description_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof diabetes_description;
	}
}
