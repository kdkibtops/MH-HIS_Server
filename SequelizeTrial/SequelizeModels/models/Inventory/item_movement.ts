import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { transaction, transactionId } from './transaction';
import type { user, userId } from '../Users/user';

export interface item_movementAttributes {
	ind: number;
	id?: string;
	trasnaction_id?: number;
	item_id?: string;
	amount?: number;
	movement_date?: string;
	movement_status?: string;
	cost?: number;
	created_by?: number;
	updated_by?: number;
}

export type item_movementPk = 'ind';
export type item_movementId = item_movement[item_movementPk];
export type item_movementOptionalAttributes =
	| 'ind'
	| 'id'
	| 'trasnaction_id'
	| 'item_id'
	| 'amount'
	| 'movement_date'
	| 'movement_status'
	| 'cost'
	| 'created_by'
	| 'updated_by';
export type item_movementCreationAttributes = Optional<
	item_movementAttributes,
	item_movementOptionalAttributes
>;

export class item_movement
	extends Model<item_movementAttributes, item_movementCreationAttributes>
	implements item_movementAttributes
{
	ind!: number;
	id?: string;
	trasnaction_id?: number;
	item_id?: string;
	amount?: number;
	movement_date?: string;
	movement_status?: string;
	cost?: number;
	created_by?: number;
	updated_by?: number;

	// item_movement belongsTo transaction via trasnaction_id
	trasnaction!: transaction;
	getTrasnaction!: Sequelize.BelongsToGetAssociationMixin<transaction>;
	setTrasnaction!: Sequelize.BelongsToSetAssociationMixin<
		transaction,
		transactionId
	>;
	createTrasnaction!: Sequelize.BelongsToCreateAssociationMixin<transaction>;
	// item_movement belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// item_movement belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof item_movement {
		return sequelize.define(
			'item_movement',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.STRING(50),
					allowNull: true,
					unique: 'item_movement_id_key',
				},
				trasnaction_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'transaction',
						key: 'ind',
					},
				},
				item_id: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				amount: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				movement_date: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				movement_status: {
					type: DataTypes.STRING(6),
					allowNull: true,
				},
				cost: {
					type: DataTypes.DOUBLE,
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
				tableName: 'item_movement',
				schema: 'inventory',
				timestamps: true,
				indexes: [
					{
						name: 'item_movement_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'item_movement_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof item_movement;
	}
}
