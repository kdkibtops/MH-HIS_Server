import type { Sequelize } from 'sequelize';
import { categories as _categories } from './categories';
import type {
	categoriesAttributes,
	categoriesCreationAttributes,
} from './categories';
import { item_movement as _item_movement } from './item_movement';
import type {
	item_movementAttributes,
	item_movementCreationAttributes,
} from './item_movement';
import { material as _material } from './material';
import type {
	materialAttributes,
	materialCreationAttributes,
} from './material';
import { store as _store } from './store';
import type { storeAttributes, storeCreationAttributes } from './store';
import { transaction as _transaction } from './transaction';
import type {
	transactionAttributes,
	transactionCreationAttributes,
} from './transaction';
import { personal } from '../Patients/personal';
import { user } from '../Users/user';

export {
	_categories as categories,
	_item_movement as item_movement,
	_material as material,
	_store as store,
	_transaction as transaction,
};

export type {
	categoriesAttributes,
	categoriesCreationAttributes,
	item_movementAttributes,
	item_movementCreationAttributes,
	materialAttributes,
	materialCreationAttributes,
	storeAttributes,
	storeCreationAttributes,
	transactionAttributes,
	transactionCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const categories = _categories.initModel(sequelize);
	const store = _store.initModel(sequelize);
	const material = _material.initModel(sequelize);
	const transaction = _transaction.initModel(sequelize);
	const item_movement = _item_movement.initModel(sequelize);

	// transaction.belongsTo(personal, {
	// 	as: 'patient_ind_personal',
	// 	foreignKey: 'patient_ind',
	// });
	// personal.hasMany(transaction, {
	// 	as: 'transactions',
	// 	foreignKey: 'patient_ind',
	// });
	// material.belongsTo(store, { as: 'category_store', foreignKey: 'category' });
	// store.hasMany(material, { as: 'materials', foreignKey: 'category' });
	// material.belongsTo(store, { as: 'store', foreignKey: 'store_id' });
	// store.hasMany(material, { as: 'store_materials', foreignKey: 'store_id' });
	// item_movement.belongsTo(transaction, {
	// 	as: 'trasnaction',
	// 	foreignKey: 'trasnaction_id',
	// });
	// transaction.hasMany(item_movement, {
	// 	as: 'item_movements',
	// 	foreignKey: 'trasnaction_id',
	// });
	// categories.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(categories, { as: 'categories', foreignKey: 'created_by' });
	// categories.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(categories, {
	// 	as: 'updated_by_categories',
	// 	foreignKey: 'updated_by',
	// });
	// item_movement.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(item_movement, {
	// 	as: 'item_movements',
	// 	foreignKey: 'created_by',
	// });
	// item_movement.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(item_movement, {
	// 	as: 'updated_by_item_movements',
	// 	foreignKey: 'updated_by',
	// });
	// material.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(material, { as: 'materials', foreignKey: 'created_by' });
	// material.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(material, {
	// 	as: 'updated_by_materials',
	// 	foreignKey: 'updated_by',
	// });
	// store.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(store, { as: 'stores', foreignKey: 'created_by' });
	// store.belongsTo(user, { as: 'trustee_user', foreignKey: 'trustee' });
	// user.hasMany(store, { as: 'trustee_stores', foreignKey: 'trustee' });
	// store.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(store, { as: 'updated_by_stores', foreignKey: 'updated_by' });
	// transaction.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(transaction, { as: 'transactions', foreignKey: 'created_by' });
	// transaction.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(transaction, {
	// 	as: 'updated_by_transactions',
	// 	foreignKey: 'updated_by',
	// });

	return {
		categories: categories,
		store: store,
		material: material,
		transaction: transaction,
		item_movement: item_movement,
	};
}
