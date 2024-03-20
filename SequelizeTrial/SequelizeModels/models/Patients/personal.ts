import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { chronic_disease, chronic_diseaseId } from './chronic_disease';
import type { clinical, clinicalId } from './clinical';
import type { imaging, imagingId } from './imaging';
import type { intervention, interventionId } from './intervention';
import type { investigation, investigationId } from './investigation';
import type { laboratory, laboratoryId } from './laboratory';
import type { liver_condition, liver_conditionId } from './liver_condition';
import type { paperwork, paperworkId } from './paperwork';
import type { patients_contact, patients_contactId } from './patients_contact';
import type {
	payment_category,
	payment_categoryId,
} from '../Finance/payment_category';
import type { user, userId } from '../Users/user';

export interface personalAttributes {
	ind: number;
	mrn?: string;
	personal_id?: string;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	dob?: string;
	gender?: string;
	payment_category?: number;
	created_by?: number;
	updated_by?: number;
}

export type personalPk = 'ind';
export type personalId = personal[personalPk];
export type personalOptionalAttributes =
	| 'ind'
	| 'mrn'
	| 'personal_id'
	| 'first_name'
	| 'middle_name'
	| 'last_name'
	| 'dob'
	| 'gender'
	| 'payment_category'
	| 'created_by'
	| 'updated_by';
export type personalCreationAttributes = Optional<
	personalAttributes,
	personalOptionalAttributes
>;

export class personal
	extends Model<personalAttributes, personalCreationAttributes>
	implements personalAttributes
{
	ind!: number;
	mrn?: string;
	personal_id?: string;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	dob?: string;
	gender?: string;
	payment_category?: number;
	created_by?: number;
	updated_by?: number;

	// personal belongsTo payment_category via payment_category
	payment_category_payment_category!: payment_category;
	getPayment_category_payment_category!: Sequelize.BelongsToGetAssociationMixin<payment_category>;
	setPayment_category_payment_category!: Sequelize.BelongsToSetAssociationMixin<
		payment_category,
		payment_categoryId
	>;
	createPayment_category_payment_category!: Sequelize.BelongsToCreateAssociationMixin<payment_category>;
	// personal hasMany chronic_disease via patient_ind
	chronic_diseases!: chronic_disease[];
	getChronic_diseases!: Sequelize.HasManyGetAssociationsMixin<chronic_disease>;
	setChronic_diseases!: Sequelize.HasManySetAssociationsMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	addChronic_disease!: Sequelize.HasManyAddAssociationMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	addChronic_diseases!: Sequelize.HasManyAddAssociationsMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	createChronic_disease!: Sequelize.HasManyCreateAssociationMixin<chronic_disease>;
	removeChronic_disease!: Sequelize.HasManyRemoveAssociationMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	removeChronic_diseases!: Sequelize.HasManyRemoveAssociationsMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	hasChronic_disease!: Sequelize.HasManyHasAssociationMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	hasChronic_diseases!: Sequelize.HasManyHasAssociationsMixin<
		chronic_disease,
		chronic_diseaseId
	>;
	countChronic_diseases!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany clinical via patient_ind
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
	// personal hasMany imaging via patient_ind
	imagings!: imaging[];
	getImagings!: Sequelize.HasManyGetAssociationsMixin<imaging>;
	setImagings!: Sequelize.HasManySetAssociationsMixin<imaging, imagingId>;
	addImaging!: Sequelize.HasManyAddAssociationMixin<imaging, imagingId>;
	addImagings!: Sequelize.HasManyAddAssociationsMixin<imaging, imagingId>;
	createImaging!: Sequelize.HasManyCreateAssociationMixin<imaging>;
	removeImaging!: Sequelize.HasManyRemoveAssociationMixin<imaging, imagingId>;
	removeImagings!: Sequelize.HasManyRemoveAssociationsMixin<imaging, imagingId>;
	hasImaging!: Sequelize.HasManyHasAssociationMixin<imaging, imagingId>;
	hasImagings!: Sequelize.HasManyHasAssociationsMixin<imaging, imagingId>;
	countImagings!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany intervention via patient_ind
	interventions!: intervention[];
	getInterventions!: Sequelize.HasManyGetAssociationsMixin<intervention>;
	setInterventions!: Sequelize.HasManySetAssociationsMixin<
		intervention,
		interventionId
	>;
	addIntervention!: Sequelize.HasManyAddAssociationMixin<
		intervention,
		interventionId
	>;
	addInterventions!: Sequelize.HasManyAddAssociationsMixin<
		intervention,
		interventionId
	>;
	createIntervention!: Sequelize.HasManyCreateAssociationMixin<intervention>;
	removeIntervention!: Sequelize.HasManyRemoveAssociationMixin<
		intervention,
		interventionId
	>;
	removeInterventions!: Sequelize.HasManyRemoveAssociationsMixin<
		intervention,
		interventionId
	>;
	hasIntervention!: Sequelize.HasManyHasAssociationMixin<
		intervention,
		interventionId
	>;
	hasInterventions!: Sequelize.HasManyHasAssociationsMixin<
		intervention,
		interventionId
	>;
	countInterventions!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany investigation via patient_ind
	investigations!: investigation[];
	getInvestigations!: Sequelize.HasManyGetAssociationsMixin<investigation>;
	setInvestigations!: Sequelize.HasManySetAssociationsMixin<
		investigation,
		investigationId
	>;
	addInvestigation!: Sequelize.HasManyAddAssociationMixin<
		investigation,
		investigationId
	>;
	addInvestigations!: Sequelize.HasManyAddAssociationsMixin<
		investigation,
		investigationId
	>;
	createInvestigation!: Sequelize.HasManyCreateAssociationMixin<investigation>;
	removeInvestigation!: Sequelize.HasManyRemoveAssociationMixin<
		investigation,
		investigationId
	>;
	removeInvestigations!: Sequelize.HasManyRemoveAssociationsMixin<
		investigation,
		investigationId
	>;
	hasInvestigation!: Sequelize.HasManyHasAssociationMixin<
		investigation,
		investigationId
	>;
	hasInvestigations!: Sequelize.HasManyHasAssociationsMixin<
		investigation,
		investigationId
	>;
	countInvestigations!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany laboratory via patient_ind
	laboratories!: laboratory[];
	getLaboratories!: Sequelize.HasManyGetAssociationsMixin<laboratory>;
	setLaboratories!: Sequelize.HasManySetAssociationsMixin<
		laboratory,
		laboratoryId
	>;
	addLaboratory!: Sequelize.HasManyAddAssociationMixin<
		laboratory,
		laboratoryId
	>;
	addLaboratories!: Sequelize.HasManyAddAssociationsMixin<
		laboratory,
		laboratoryId
	>;
	createLaboratory!: Sequelize.HasManyCreateAssociationMixin<laboratory>;
	removeLaboratory!: Sequelize.HasManyRemoveAssociationMixin<
		laboratory,
		laboratoryId
	>;
	removeLaboratories!: Sequelize.HasManyRemoveAssociationsMixin<
		laboratory,
		laboratoryId
	>;
	hasLaboratory!: Sequelize.HasManyHasAssociationMixin<
		laboratory,
		laboratoryId
	>;
	hasLaboratories!: Sequelize.HasManyHasAssociationsMixin<
		laboratory,
		laboratoryId
	>;
	countLaboratories!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany liver_condition via patient_ind
	liver_conditions!: liver_condition[];
	getLiver_conditions!: Sequelize.HasManyGetAssociationsMixin<liver_condition>;
	setLiver_conditions!: Sequelize.HasManySetAssociationsMixin<
		liver_condition,
		liver_conditionId
	>;
	addLiver_condition!: Sequelize.HasManyAddAssociationMixin<
		liver_condition,
		liver_conditionId
	>;
	addLiver_conditions!: Sequelize.HasManyAddAssociationsMixin<
		liver_condition,
		liver_conditionId
	>;
	createLiver_condition!: Sequelize.HasManyCreateAssociationMixin<liver_condition>;
	removeLiver_condition!: Sequelize.HasManyRemoveAssociationMixin<
		liver_condition,
		liver_conditionId
	>;
	removeLiver_conditions!: Sequelize.HasManyRemoveAssociationsMixin<
		liver_condition,
		liver_conditionId
	>;
	hasLiver_condition!: Sequelize.HasManyHasAssociationMixin<
		liver_condition,
		liver_conditionId
	>;
	hasLiver_conditions!: Sequelize.HasManyHasAssociationsMixin<
		liver_condition,
		liver_conditionId
	>;
	countLiver_conditions!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany paperwork via patient_ind
	paperworks!: paperwork[];
	getPaperworks!: Sequelize.HasManyGetAssociationsMixin<paperwork>;
	setPaperworks!: Sequelize.HasManySetAssociationsMixin<paperwork, paperworkId>;
	addPaperwork!: Sequelize.HasManyAddAssociationMixin<paperwork, paperworkId>;
	addPaperworks!: Sequelize.HasManyAddAssociationsMixin<paperwork, paperworkId>;
	createPaperwork!: Sequelize.HasManyCreateAssociationMixin<paperwork>;
	removePaperwork!: Sequelize.HasManyRemoveAssociationMixin<
		paperwork,
		paperworkId
	>;
	removePaperworks!: Sequelize.HasManyRemoveAssociationsMixin<
		paperwork,
		paperworkId
	>;
	hasPaperwork!: Sequelize.HasManyHasAssociationMixin<paperwork, paperworkId>;
	hasPaperworks!: Sequelize.HasManyHasAssociationsMixin<paperwork, paperworkId>;
	countPaperworks!: Sequelize.HasManyCountAssociationsMixin;
	// personal hasMany patients_contact via patient_ind
	patients_contacts!: patients_contact[];
	getPatients_contacts!: Sequelize.HasManyGetAssociationsMixin<patients_contact>;
	setPatients_contacts!: Sequelize.HasManySetAssociationsMixin<
		patients_contact,
		patients_contactId
	>;
	addPatients_contact!: Sequelize.HasManyAddAssociationMixin<
		patients_contact,
		patients_contactId
	>;
	addPatients_contacts!: Sequelize.HasManyAddAssociationsMixin<
		patients_contact,
		patients_contactId
	>;
	createPatients_contact!: Sequelize.HasManyCreateAssociationMixin<patients_contact>;
	removePatients_contact!: Sequelize.HasManyRemoveAssociationMixin<
		patients_contact,
		patients_contactId
	>;
	removePatients_contacts!: Sequelize.HasManyRemoveAssociationsMixin<
		patients_contact,
		patients_contactId
	>;
	hasPatients_contact!: Sequelize.HasManyHasAssociationMixin<
		patients_contact,
		patients_contactId
	>;
	hasPatients_contacts!: Sequelize.HasManyHasAssociationsMixin<
		patients_contact,
		patients_contactId
	>;
	countPatients_contacts!: Sequelize.HasManyCountAssociationsMixin;
	// personal belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// personal belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof personal {
		return sequelize.define(
			'personal',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				mrn: {
					type: DataTypes.STRING(100),
					allowNull: true,
					unique: 'personal_mrn_key',
				},
				personal_id: {
					type: DataTypes.STRING(100),
					allowNull: true,
					unique: 'personal_personal_id_key',
				},
				first_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				middle_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				last_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				dob: {
					type: DataTypes.STRING(12),
					allowNull: true,
				},
				gender: {
					type: DataTypes.STRING(10),
					allowNull: true,
				},
				payment_category: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'finance', tableName: 'payment_category' },
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
				tableName: 'personal',
				schema: 'patients',
				timestamps: true,
				indexes: [
					{
						name: 'personal_mrn_key',
						unique: true,
						fields: [{ name: 'mrn' }],
					},
					{
						name: 'personal_personal_id_key',
						unique: true,
						fields: [{ name: 'personal_id' }],
					},
					{
						name: 'personal_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof personal;
	}
}
