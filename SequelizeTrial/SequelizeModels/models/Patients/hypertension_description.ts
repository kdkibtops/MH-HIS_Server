import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clinical, clinicalId } from './clinical';
import type { user, userId } from '../Users/user';

export interface hypertension_descriptionAttributes {
	ind: number;
	max_systolic?: number;
	min_diastolic?: number;
	retina?: string;
	kidney?: string;
	coronaries?: string;
	cerebral?: string;
	neuropathy?: string;
	created_by?: number;
	updated_by?: number;
}

export type hypertension_descriptionPk = 'ind';
export type hypertension_descriptionId =
	hypertension_description[hypertension_descriptionPk];
export type hypertension_descriptionOptionalAttributes =
	| 'ind'
	| 'max_systolic'
	| 'min_diastolic'
	| 'retina'
	| 'kidney'
	| 'coronaries'
	| 'cerebral'
	| 'neuropathy'
	| 'created_by'
	| 'updated_by';
export type hypertension_descriptionCreationAttributes = Optional<
	hypertension_descriptionAttributes,
	hypertension_descriptionOptionalAttributes
>;

export class hypertension_description
	extends Model<
		hypertension_descriptionAttributes,
		hypertension_descriptionCreationAttributes
	>
	implements hypertension_descriptionAttributes
{
	ind!: number;
	max_systolic?: number;
	min_diastolic?: number;
	retina?: string;
	kidney?: string;
	coronaries?: string;
	cerebral?: string;
	neuropathy?: string;
	created_by?: number;
	updated_by?: number;

	// hypertension_description hasMany clinical via htn
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
	// hypertension_description belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// hypertension_description belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(
		sequelize: Sequelize.Sequelize
	): typeof hypertension_description {
		return sequelize.define(
			'hypertension_description',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				max_systolic: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				min_diastolic: {
					type: DataTypes.INTEGER,
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
				tableName: 'hypertension_description',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'hypertension_description_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof hypertension_description;
	}
}
