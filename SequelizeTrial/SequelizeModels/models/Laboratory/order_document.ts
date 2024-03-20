import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { order, orderId } from './order';
import type { user, userId } from '../Users/user';

export interface order_documentAttributes {
	ind: number;
	order_id?: number;
	document_name?: string;
	document_description?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;
}

export type order_documentPk = 'ind';
export type order_documentId = order_document[order_documentPk];
export type order_documentOptionalAttributes =
	| 'ind'
	| 'order_id'
	| 'document_name'
	| 'document_description'
	| 'document_file_path'
	| 'created_by'
	| 'updated_by';
export type order_documentCreationAttributes = Optional<
	order_documentAttributes,
	order_documentOptionalAttributes
>;

export class order_document
	extends Model<order_documentAttributes, order_documentCreationAttributes>
	implements order_documentAttributes
{
	ind!: number;
	order_id?: number;
	document_name?: string;
	document_description?: string;
	document_file_path?: string;
	created_by?: number;
	updated_by?: number;

	// order_document belongsTo order via order_id
	order!: order;
	getOrder!: Sequelize.BelongsToGetAssociationMixin<order>;
	setOrder!: Sequelize.BelongsToSetAssociationMixin<order, orderId>;
	createOrder!: Sequelize.BelongsToCreateAssociationMixin<order>;
	// order_document belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order_document belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof order_document {
		return sequelize.define(
			'order_document',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				order_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'order',
						key: 'ind',
					},
				},
				document_name: {
					type: DataTypes.STRING(50),
					allowNull: true,
					defaultValue: 'Report',
				},
				document_description: {
					type: DataTypes.STRING(150),
					allowNull: true,
				},
				document_file_path: {
					type: DataTypes.TEXT,
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
				tableName: 'order_document',
				schema: 'laboratory',
				timestamps: true,
				indexes: [
					{
						name: 'order_document_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof order_document;
	}
}
