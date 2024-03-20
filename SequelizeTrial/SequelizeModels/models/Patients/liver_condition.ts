import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal, personalId } from './personal';
import type { user, userId } from '../Users/user';

export interface liver_conditionAttributes {
	ind: number;
	patient_ind?: number;
	condition_date?: string;
	hcv_infection?: boolean;
	hcv_ag?: boolean;
	hcv_ab?: boolean;
	hcv_ttt?: string;
	hbv_infection?: boolean;
	hbv_ag?: boolean;
	hbv_ab?: boolean;
	hbv_ttt?: string;
	albumin?: number;
	ast?: number;
	alt?: number;
	total_bilirubin?: number;
	direct_bilirubin?: number;
	inr?: number;
	ascites?: string;
	child_score?: number;
	created_by?: number;
	updated_by?: number;
}

export type liver_conditionPk = 'ind';
export type liver_conditionId = liver_condition[liver_conditionPk];
export type liver_conditionOptionalAttributes =
	| 'ind'
	| 'patient_ind'
	| 'condition_date'
	| 'hcv_infection'
	| 'hcv_ag'
	| 'hcv_ab'
	| 'hcv_ttt'
	| 'hbv_infection'
	| 'hbv_ag'
	| 'hbv_ab'
	| 'hbv_ttt'
	| 'albumin'
	| 'ast'
	| 'alt'
	| 'total_bilirubin'
	| 'direct_bilirubin'
	| 'inr'
	| 'ascites'
	| 'child_score'
	| 'created_by'
	| 'updated_by';
export type liver_conditionCreationAttributes = Optional<
	liver_conditionAttributes,
	liver_conditionOptionalAttributes
>;

export class liver_condition
	extends Model<liver_conditionAttributes, liver_conditionCreationAttributes>
	implements liver_conditionAttributes
{
	ind!: number;
	patient_ind?: number;
	condition_date?: string;
	hcv_infection?: boolean;
	hcv_ag?: boolean;
	hcv_ab?: boolean;
	hcv_ttt?: string;
	hbv_infection?: boolean;
	hbv_ag?: boolean;
	hbv_ab?: boolean;
	hbv_ttt?: string;
	albumin?: number;
	ast?: number;
	alt?: number;
	total_bilirubin?: number;
	direct_bilirubin?: number;
	inr?: number;
	ascites?: string;
	child_score?: number;
	created_by?: number;
	updated_by?: number;

	// liver_condition belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// liver_condition belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// liver_condition belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof liver_condition {
		return sequelize.define(
			'liver_condition',
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
				condition_date: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				hcv_infection: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hcv_ag: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hcv_ab: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hcv_ttt: {
					type: DataTypes.STRING(150),
					allowNull: true,
				},
				hbv_infection: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hbv_ag: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hbv_ab: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				hbv_ttt: {
					type: DataTypes.STRING(150),
					allowNull: true,
				},
				albumin: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				ast: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				alt: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				total_bilirubin: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				direct_bilirubin: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				inr: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				ascites: {
					type: DataTypes.STRING(10),
					allowNull: true,
				},
				child_score: {
					type: DataTypes.INTEGER,
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
				tableName: 'liver_condition',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'liver_condition_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof liver_condition;
	}
}
