import type { Sequelize } from 'sequelize';
import { payment_category as _payment_category } from './payment_category';
import type {
	payment_categoryAttributes,
	payment_categoryCreationAttributes,
} from './payment_category';
import { user } from '../Users/user';

export { _payment_category as payment_category };

export type { payment_categoryAttributes, payment_categoryCreationAttributes };

export function initModels(sequelize: Sequelize) {
	const payment_category = _payment_category.initModel(sequelize);
	// user.hasMany(payment_category, { foreignKey: 'created_by' });
	// payment_category.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'ind',
	// });
	// user.hasMany(payment_category, {
	// 	as: 'payment_categories',
	// 	foreignKey: 'created_by',
	// });
	// payment_category.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'ind',
	// });
	// user.hasMany(payment_category, {
	// 	as: 'updated_by_payment_categories',
	// 	foreignKey: 'updated_by',
	// });

	return {
		payment_category: payment_category,
	};
}
