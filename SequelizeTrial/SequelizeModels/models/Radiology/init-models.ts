import type { Sequelize } from 'sequelize';
import { order as _order } from './order';
import type { orderAttributes, orderCreationAttributes } from './order';
import { order_document as _order_document } from './order_document';
import type {
	order_documentAttributes,
	order_documentCreationAttributes,
} from './order_document';
import { study as _study } from './study';
import type { studyAttributes, studyCreationAttributes } from './study';
import { study_preparation as _study_preparation } from './study_preparation';
import type {
	study_preparationAttributes,
	study_preparationCreationAttributes,
} from './study_preparation';
import { payment_category } from '../Finance/payment_category';
import { personal } from '../Patients/personal';
import { user } from '../Users/user';

export {
	_order as order,
	_order_document as order_document,
	_study as study,
	_study_preparation as study_preparation,
};

export type {
	orderAttributes,
	orderCreationAttributes,
	order_documentAttributes,
	order_documentCreationAttributes,
	studyAttributes,
	studyCreationAttributes,
	study_preparationAttributes,
	study_preparationCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const order = _order.initModel(sequelize);
	const order_document = _order_document.initModel(sequelize);
	const study = _study.initModel(sequelize);
	const study_preparation = _study_preparation.initModel(sequelize);

	// order_document.belongsTo(order, { as: 'order', foreignKey: 'order_id' });
	// order.hasMany(order_document, {
	// 	as: 'order_documents',
	// 	foreignKey: 'order_id',
	// });
	// order.belongsTo(payment_category, {
	// 	as: 'payment_category_payment_category',
	// 	foreignKey: 'payment_category',
	// });
	// payment_category.hasMany(order, {
	// 	as: 'orders',
	// 	foreignKey: 'payment_category',
	// });
	// order.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(order, { as: 'orders', foreignKey: 'patient_ind' });
	// order.belongsTo(study, { as: 'study_ind_study', foreignKey: 'study_ind' });
	// study.hasMany(order, { as: 'orders', foreignKey: 'study_ind' });
	// study.belongsTo(study_preparation, {
	// 	as: 'study_preparation_study_preparation',
	// 	foreignKey: 'study_preparation',
	// });
	// study_preparation.hasMany(study, {
	// 	as: 'studies',
	// 	foreignKey: 'study_preparation',
	// });
	// order.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(order, { as: 'orders', foreignKey: 'created_by' });
	// order.belongsTo(user, { as: 'radiologist_user', foreignKey: 'radiologist' });
	// user.hasMany(order, { as: 'radiologist_orders', foreignKey: 'radiologist' });
	// order.belongsTo(user, {
	// 	as: 'referring_phys_user',
	// 	foreignKey: 'referring_phys',
	// });
	// user.hasMany(order, {
	// 	as: 'referring_phys_orders',
	// 	foreignKey: 'referring_phys',
	// });
	// order.belongsTo(user, { as: 'technician_user', foreignKey: 'technician' });
	// user.hasMany(order, { as: 'technician_orders', foreignKey: 'technician' });
	// order.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(order, { as: 'updated_by_orders', foreignKey: 'updated_by' });
	// order_document.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(order_document, {
	// 	as: 'order_documents',
	// 	foreignKey: 'created_by',
	// });
	// order_document.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(order_document, {
	// 	as: 'updated_by_order_documents',
	// 	foreignKey: 'updated_by',
	// });
	// study.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(study, { as: 'studies', foreignKey: 'created_by' });
	// study.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(study, { as: 'updated_by_studies', foreignKey: 'updated_by' });
	// study_preparation.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(study_preparation, {
	// 	as: 'study_preparations',
	// 	foreignKey: 'created_by',
	// });
	// study_preparation.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(study_preparation, {
	// 	as: 'updated_by_study_preparations',
	// 	foreignKey: 'updated_by',
	// });

	return {
		order: order,
		order_document: order_document,
		study: study,
		study_preparation: study_preparation,
	};
}
