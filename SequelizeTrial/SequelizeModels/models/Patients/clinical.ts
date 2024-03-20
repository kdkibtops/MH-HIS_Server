import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
	diabetes_description,
	diabetes_descriptionId,
} from './diabetes_description';
import type {
	hypertension_description,
	hypertension_descriptionId,
} from './hypertension_description';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface clinicalAttributes {
	ind: number;
	patient_ind?: number;
	dm?: number;
	htn?: number;
	smoking?: boolean;
	created_by?: number;
	updated_by?: number;
}

export type clinicalPk = 'ind';
export type clinicalId = clinical[clinicalPk];
export type clinicalOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'dm'
	| 'htn'
	| 'smoking'
	| 'created_by'
	| 'updated_by';
export type clinicalCreationAttributes = Optional<
	clinicalAttributes,
	clinicalOptionalAttributes
>;

export class clinical
	extends Model<clinicalAttributes, clinicalCreationAttributes>
	implements clinicalAttributes
{
	ind!: number;
	patient_ind?: number;
	dm?: number;
	htn?: number;
	smoking?: boolean;
	created_by?: number;
	updated_by?: number;

	// clinical belongsTo diabetes_description via dm
	dm_diabetes_description!: diabetes_description;
	getDm_diabetes_description!: Sequelize.BelongsToGetAssociationMixin<diabetes_description>;
	setDm_diabetes_description!: Sequelize.BelongsToSetAssociationMixin<
		diabetes_description,
		diabetes_descriptionId
	>;
	createDm_diabetes_description!: Sequelize.BelongsToCreateAssociationMixin<diabetes_description>;
	// clinical belongsTo hypertension_description via htn
	htn_hypertension_description!: hypertension_description;
	getHtn_hypertension_description!: Sequelize.BelongsToGetAssociationMixin<hypertension_description>;
	setHtn_hypertension_description!: Sequelize.BelongsToSetAssociationMixin<
		hypertension_description,
		hypertension_descriptionId
	>;
	createHtn_hypertension_description!: Sequelize.BelongsToCreateAssociationMixin<hypertension_description>;
	// clinical belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// clinical belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// clinical belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof clinical {
		return sequelize.define(
			'clinical',
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
				dm: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'diabetes_description',
						key: 'ind',
					},
				},
				htn: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'hypertension_description',
						key: 'ind',
					},
				},
				smoking: {
					type: DataTypes.BOOLEAN,
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
				tableName: 'clinical',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'clinical_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof clinical;
	}
}
