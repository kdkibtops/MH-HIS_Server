import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { item_movement, item_movementId } from './item_movement';
import type { personal, personalId } from '../Patients/personal';
import type { user, userId } from '../Users/user';

export interface transactionAttributes {
	ind: number;
	id?: string;
	patient_ind?: number;
	username?: string;
	created_by?: number;
	updated_by?: number;
}

export type transactionPk = 'ind';
export type transactionId = transaction[transactionPk];
export type transactionOptionalAttributes =
	| 'ind'
	| 'id'
	| 'patient_ind'
	| 'username'
	| 'created_by'
	| 'updated_by';
export type transactionCreationAttributes = Optional<
	transactionAttributes,
	transactionOptionalAttributes
>;

export class transaction
	extends Model<transactionAttributes, transactionCreationAttributes>
	implements transactionAttributes
{
	ind!: number;
	id?: string;
	patient_ind?: number;
	username?: string;
	created_by?: number;
	updated_by?: number;

	// transaction belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// transaction hasMany item_movement via trasnaction_id
	item_movements!: item_movement[];
	getItem_movements!: Sequelize.HasManyGetAssociationsMixin<item_movement>;
	setItem_movements!: Sequelize.HasManySetAssociationsMixin<
		item_movement,
		item_movementId
	>;
	addItem_movement!: Sequelize.HasManyAddAssociationMixin<
		item_movement,
		item_movementId
	>;
	addItem_movements!: Sequelize.HasManyAddAssociationsMixin<
		item_movement,
		item_movementId
	>;
	createItem_movement!: Sequelize.HasManyCreateAssociationMixin<item_movement>;
	removeItem_movement!: Sequelize.HasManyRemoveAssociationMixin<
		item_movement,
		item_movementId
	>;
	removeItem_movements!: Sequelize.HasManyRemoveAssociationsMixin<
		item_movement,
		item_movementId
	>;
	hasItem_movement!: Sequelize.HasManyHasAssociationMixin<
		item_movement,
		item_movementId
	>;
	hasItem_movements!: Sequelize.HasManyHasAssociationsMixin<
		item_movement,
		item_movementId
	>;
	countItem_movements!: Sequelize.HasManyCountAssociationsMixin;
	// transaction belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// transaction belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof transaction {
		return sequelize.define(
			'transaction',
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
					unique: 'transaction_id_key',
				},
				patient_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'patients', tableName: 'personal' },
						key: 'ind',
					},
				},
				username: {
					type: DataTypes.STRING(50),
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
				tableName: 'transaction',
				schema: 'inventory',
				timestamps: true,
				indexes: [
					{
						name: 'transaction_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'transaction_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof transaction;
	}
}
