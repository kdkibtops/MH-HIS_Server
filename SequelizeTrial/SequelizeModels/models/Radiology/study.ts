import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { order, orderId } from './order';
import type {
	study_preparation,
	study_preparationId,
} from './study_preparation';
import type { user, userId } from '../Users/user';

export interface studyAttributes {
	ind: number;
	id?: string;
	modality?: string;
	study_name?: string;
	arabic_name?: string;
	price?: number;
	study_preparation?: number;
	created_by?: number;
	updated_by?: number;
}

export type studyPk = 'ind';
export type studyId = study[studyPk];
export type studyOptionalAttributes =
	| 'ind'
	| 'id'
	| 'modality'
	| 'study_name'
	| 'arabic_name'
	| 'price'
	| 'study_preparation'
	| 'created_by'
	| 'updated_by';
export type studyCreationAttributes = Optional<
	studyAttributes,
	studyOptionalAttributes
>;

export class study
	extends Model<studyAttributes, studyCreationAttributes>
	implements studyAttributes
{
	ind!: number;
	id?: string;
	modality?: string;
	study_name?: string;
	arabic_name?: string;
	price?: number;
	study_preparation?: number;
	created_by?: number;
	updated_by?: number;

	// study hasMany order via study_ind
	orders!: order[];
	getOrders!: Sequelize.HasManyGetAssociationsMixin<order>;
	setOrders!: Sequelize.HasManySetAssociationsMixin<order, orderId>;
	addOrder!: Sequelize.HasManyAddAssociationMixin<order, orderId>;
	addOrders!: Sequelize.HasManyAddAssociationsMixin<order, orderId>;
	createOrder!: Sequelize.HasManyCreateAssociationMixin<order>;
	removeOrder!: Sequelize.HasManyRemoveAssociationMixin<order, orderId>;
	removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<order, orderId>;
	hasOrder!: Sequelize.HasManyHasAssociationMixin<order, orderId>;
	hasOrders!: Sequelize.HasManyHasAssociationsMixin<order, orderId>;
	countOrders!: Sequelize.HasManyCountAssociationsMixin;
	// study belongsTo study_preparation via study_preparation
	study_preparation_study_preparation!: study_preparation;
	getStudy_preparation_study_preparation!: Sequelize.BelongsToGetAssociationMixin<study_preparation>;
	setStudy_preparation_study_preparation!: Sequelize.BelongsToSetAssociationMixin<
		study_preparation,
		study_preparationId
	>;
	createStudy_preparation_study_preparation!: Sequelize.BelongsToCreateAssociationMixin<study_preparation>;
	// study belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// study belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof study {
		return sequelize.define(
			'study',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.STRING(150),
					allowNull: true,
					unique: 'study_id_key',
				},
				modality: {
					type: DataTypes.STRING(10),
					allowNull: true,
				},
				study_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				arabic_name: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				price: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				study_preparation: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'study_preparation',
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
				tableName: 'study',
				schema: 'radiology',
				timestamps: true,
				indexes: [
					{
						name: 'study_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'study_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof study;
	}
}
