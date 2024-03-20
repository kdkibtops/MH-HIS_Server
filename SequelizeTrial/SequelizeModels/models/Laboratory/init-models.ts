import type { Sequelize } from 'sequelize';
import { external_lab as _external_lab } from './external_lab';
import type {
	external_labAttributes,
	external_labCreationAttributes,
} from './external_lab';
import { external_lab_test as _external_lab_test } from './external_lab_test';
import type {
	external_lab_testAttributes,
	external_lab_testCreationAttributes,
} from './external_lab_test';
import { order as _order } from './order';
import type { orderAttributes, orderCreationAttributes } from './order';
import { order_document as _order_document } from './order_document';
import type {
	order_documentAttributes,
	order_documentCreationAttributes,
} from './order_document';
import { test as _test } from './test';
import type { testAttributes, testCreationAttributes } from './test';
import { payment_category } from '../Finance/payment_category';
import { personal } from '../Patients/personal';
import { user } from '../Users/user';

export {
	_external_lab as external_lab,
	_external_lab_test as external_lab_test,
	_order as order,
	_order_document as order_document,
	_test as test,
};

export type {
	external_labAttributes,
	external_labCreationAttributes,
	external_lab_testAttributes,
	external_lab_testCreationAttributes,
	orderAttributes,
	orderCreationAttributes,
	order_documentAttributes,
	order_documentCreationAttributes,
	testAttributes,
	testCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const external_lab = _external_lab.initModel(sequelize);
	const external_lab_test = _external_lab_test.initModel(sequelize);
	const order = _order.initModel(sequelize);
	const order_document = _order_document.initModel(sequelize);
	const test = _test.initModel(sequelize);

	// external_lab_test.belongsTo(external_lab, {
	// 	as: 'external_lab',
	// 	foreignKey: 'external_lab_id',
	// });
	// external_lab.hasMany(external_lab_test, {
	// 	as: 'external_lab_tests',
	// 	foreignKey: 'external_lab_id',
	// });
	// order.belongsTo(external_lab, {
	// 	as: 'test_location_external_lab',
	// 	foreignKey: 'test_location',
	// });
	// external_lab.hasMany(order, { as: 'orders', foreignKey: 'test_location' });
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
	// external_lab_test.belongsTo(test, {
	// 	as: 'test_ind_test',
	// 	foreignKey: 'test_ind',
	// });
	// test.hasMany(external_lab_test, {
	// 	as: 'external_lab_tests',
	// 	foreignKey: 'test_ind',
	// });
	// order.belongsTo(test, { as: 'test_ind_test', foreignKey: 'test_ind' });
	// test.hasMany(order, { as: 'orders', foreignKey: 'test_ind' });
	// external_lab.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(external_lab, { as: 'external_labs', foreignKey: 'created_by' });
	// external_lab.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(external_lab, {
	// 	as: 'updated_by_external_labs',
	// 	foreignKey: 'updated_by',
	// });
	// external_lab_test.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(external_lab_test, {
	// 	as: 'external_lab_tests',
	// 	foreignKey: 'created_by',
	// });
	// external_lab_test.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(external_lab_test, {
	// 	as: 'updated_by_external_lab_tests',
	// 	foreignKey: 'updated_by',
	// });
	// order.belongsTo(user, { as: 'chemist_user', foreignKey: 'chemist' });
	// user.hasMany(order, { as: 'orders', foreignKey: 'chemist' });
	// order.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(order, { as: 'created_by_orders', foreignKey: 'created_by' });
	// order.belongsTo(user, { as: 'pathologist_user', foreignKey: 'pathologist' });
	// user.hasMany(order, { as: 'pathologist_orders', foreignKey: 'pathologist' });
	// order.belongsTo(user, {
	// 	as: 'referring_phys_user',
	// 	foreignKey: 'referring_phys',
	// });
	// user.hasMany(order, {
	// 	as: 'referring_phys_orders',
	// 	foreignKey: 'referring_phys',
	// });
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
	// test.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(test, { as: 'tests', foreignKey: 'created_by' });
	// test.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(test, { as: 'updated_by_tests', foreignKey: 'updated_by' });

	return {
		external_lab: external_lab,
		external_lab_test: external_lab_test,
		order: order,
		order_document: order_document,
		test: test,
	};
}
