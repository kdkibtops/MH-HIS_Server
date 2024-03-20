import type { Sequelize } from 'sequelize';
import { chronic_disease as _chronic_disease } from './chronic_disease';
import type {
	chronic_diseaseAttributes,
	chronic_diseaseCreationAttributes,
} from './chronic_disease';
import { clinical as _clinical } from './clinical';
import type {
	clinicalAttributes,
	clinicalCreationAttributes,
} from './clinical';
import { diabetes_description as _diabetes_description } from './diabetes_description';
import type {
	diabetes_descriptionAttributes,
	diabetes_descriptionCreationAttributes,
} from './diabetes_description';
import { hypertension_description as _hypertension_description } from './hypertension_description';
import type {
	hypertension_descriptionAttributes,
	hypertension_descriptionCreationAttributes,
} from './hypertension_description';
import { imaging as _imaging } from './imaging';
import type { imagingAttributes, imagingCreationAttributes } from './imaging';
import { intervention as _intervention } from './intervention';
import type {
	interventionAttributes,
	interventionCreationAttributes,
} from './intervention';
import { investigation as _investigation } from './investigation';
import type {
	investigationAttributes,
	investigationCreationAttributes,
} from './investigation';
import { laboratory as _laboratory } from './laboratory';
import type {
	laboratoryAttributes,
	laboratoryCreationAttributes,
} from './laboratory';
import { liver_condition as _liver_condition } from './liver_condition';
import type {
	liver_conditionAttributes,
	liver_conditionCreationAttributes,
} from './liver_condition';
import { paperwork as _paperwork } from './paperwork';
import type {
	paperworkAttributes,
	paperworkCreationAttributes,
} from './paperwork';
import { patients_contact as _patients_contact } from './patients_contact';
import type {
	patients_contactAttributes,
	patients_contactCreationAttributes,
} from './patients_contact';
import { personal as _personal } from './personal';
import type {
	personalAttributes,
	personalCreationAttributes,
} from './personal';
import { payment_category } from '../Finance/payment_category';
import { user } from '../Users/user';

export {
	_chronic_disease as chronic_disease,
	_clinical as clinical,
	_diabetes_description as diabetes_description,
	_hypertension_description as hypertension_description,
	_imaging as imaging,
	_intervention as intervention,
	_investigation as investigation,
	_laboratory as laboratory,
	_liver_condition as liver_condition,
	_paperwork as paperwork,
	_patients_contact as patients_contact,
	_personal as personal,
};

export type {
	chronic_diseaseAttributes,
	chronic_diseaseCreationAttributes,
	clinicalAttributes,
	clinicalCreationAttributes,
	diabetes_descriptionAttributes,
	diabetes_descriptionCreationAttributes,
	hypertension_descriptionAttributes,
	hypertension_descriptionCreationAttributes,
	imagingAttributes,
	imagingCreationAttributes,
	interventionAttributes,
	interventionCreationAttributes,
	investigationAttributes,
	investigationCreationAttributes,
	laboratoryAttributes,
	laboratoryCreationAttributes,
	liver_conditionAttributes,
	liver_conditionCreationAttributes,
	paperworkAttributes,
	paperworkCreationAttributes,
	patients_contactAttributes,
	patients_contactCreationAttributes,
	personalAttributes,
	personalCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const personal = _personal.initModel(sequelize);
	const diabetes_description = _diabetes_description.initModel(sequelize);
	const hypertension_description =
		_hypertension_description.initModel(sequelize);
	const chronic_disease = _chronic_disease.initModel(sequelize);
	const clinical = _clinical.initModel(sequelize);
	const imaging = _imaging.initModel(sequelize);
	const intervention = _intervention.initModel(sequelize);
	const investigation = _investigation.initModel(sequelize);
	const laboratory = _laboratory.initModel(sequelize);
	const liver_condition = _liver_condition.initModel(sequelize);
	const paperwork = _paperwork.initModel(sequelize);
	const patients_contact = _patients_contact.initModel(sequelize);

	// clinical.belongsTo(diabetes_description, {
	// 	as: 'dm_diabetes_description',
	// 	foreignKey: 'dm',
	// });
	// diabetes_description.hasMany(clinical, { as: 'clinicals', foreignKey: 'dm' });
	// clinical.belongsTo(hypertension_description, {
	// 	as: 'htn_hypertension_description',
	// 	foreignKey: 'htn',
	// });
	// hypertension_description.hasMany(clinical, {
	// 	as: 'clinicals',
	// 	foreignKey: 'htn',
	// });
	// personal.belongsTo(payment_category, {
	// 	as: 'payment_category_payment_category',
	// 	foreignKey: 'payment_category',
	// });
	// payment_category.hasMany(personal, {
	// 	as: 'personals',
	// 	foreignKey: 'payment_category',
	// });
	// chronic_disease.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(chronic_disease, {
	// 	as: 'chronic_diseases',
	// 	foreignKey: 'patient_ind',
	// });
	// clinical.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(clinical, { as: 'clinicals', foreignKey: 'patient_ind' });
	// imaging.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(imaging, { as: 'imagings', foreignKey: 'patient_ind' });
	// intervention.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(intervention, {
	// 	as: 'interventions',
	// 	foreignKey: 'patient_ind',
	// });
	// investigation.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(investigation, {
	// 	as: 'investigations',
	// 	foreignKey: 'patient_ind',
	// });
	// laboratory.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(laboratory, {
	// 	as: 'laboratories',
	// 	foreignKey: 'patient_ind',
	// });
	// liver_condition.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(liver_condition, {
	// 	as: 'liver_conditions',
	// 	foreignKey: 'patient_ind',
	// });
	// paperwork.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(paperwork, { as: 'paperworks', foreignKey: 'patient_ind' });
	// patients_contact.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(patients_contact, {
	// 	as: 'patients_contacts',
	// 	foreignKey: 'patient_ind',
	// });
	// chronic_disease.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(chronic_disease, {
	// 	as: 'chronic_diseases',
	// 	foreignKey: 'created_by',
	// });
	// chronic_disease.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(chronic_disease, {
	// 	as: 'updated_by_chronic_diseases',
	// 	foreignKey: 'updated_by',
	// });
	// clinical.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(clinical, { as: 'clinicals', foreignKey: 'created_by' });
	// clinical.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(clinical, {
	// 	as: 'updated_by_clinicals',
	// 	foreignKey: 'updated_by',
	// });
	// diabetes_description.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(diabetes_description, {
	// 	as: 'diabetes_descriptions',
	// 	foreignKey: 'created_by',
	// });
	// diabetes_description.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(diabetes_description, {
	// 	as: 'updated_by_diabetes_descriptions',
	// 	foreignKey: 'updated_by',
	// });
	// hypertension_description.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(hypertension_description, {
	// 	as: 'hypertension_descriptions',
	// 	foreignKey: 'created_by',
	// });
	// hypertension_description.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(hypertension_description, {
	// 	as: 'updated_by_hypertension_descriptions',
	// 	foreignKey: 'updated_by',
	// });
	// imaging.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(imaging, { as: 'imagings', foreignKey: 'created_by' });
	// imaging.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(imaging, {
	// 	as: 'updated_by_imagings',
	// 	foreignKey: 'updated_by',
	// });
	// intervention.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(intervention, { as: 'interventions', foreignKey: 'created_by' });
	// intervention.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(intervention, {
	// 	as: 'updated_by_interventions',
	// 	foreignKey: 'updated_by',
	// });
	// investigation.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(investigation, {
	// 	as: 'investigations',
	// 	foreignKey: 'created_by',
	// });
	// investigation.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(investigation, {
	// 	as: 'updated_by_investigations',
	// 	foreignKey: 'updated_by',
	// });
	// laboratory.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(laboratory, { as: 'laboratories', foreignKey: 'created_by' });
	// laboratory.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(laboratory, {
	// 	as: 'updated_by_laboratories',
	// 	foreignKey: 'updated_by',
	// });
	// liver_condition.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(liver_condition, {
	// 	as: 'liver_conditions',
	// 	foreignKey: 'created_by',
	// });
	// liver_condition.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(liver_condition, {
	// 	as: 'updated_by_liver_conditions',
	// 	foreignKey: 'updated_by',
	// });
	// paperwork.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(paperwork, { as: 'paperworks', foreignKey: 'created_by' });
	// paperwork.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(paperwork, {
	// 	as: 'updated_by_paperworks',
	// 	foreignKey: 'updated_by',
	// });
	// patients_contact.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(patients_contact, {
	// 	as: 'patients_contacts',
	// 	foreignKey: 'created_by',
	// });
	// patients_contact.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(patients_contact, {
	// 	as: 'updated_by_patients_contacts',
	// 	foreignKey: 'updated_by',
	// });
	// personal.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(personal, { as: 'personals', foreignKey: 'created_by' });
	// personal.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(personal, {
	// 	as: 'updated_by_personals',
	// 	foreignKey: 'updated_by',
	// });

	return {
		personal: personal,
		chronic_disease: chronic_disease,
		clinical: clinical,
		diabetes_description: diabetes_description,
		hypertension_description: hypertension_description,
		imaging: imaging,
		intervention: intervention,
		investigation: investigation,
		laboratory: laboratory,
		liver_condition: liver_condition,
		paperwork: paperwork,
		patients_contact: patients_contact,
	};
}
