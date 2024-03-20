import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { external_lab, external_labId } from './external_lab';
import type { order_document, order_documentId } from './order_document';
import type {
	payment_category,
	payment_categoryId,
} from '../Finance/payment_category';
import type { personal, personalId } from '../Patients/personal';
import type { test, testId } from '../Laboratory/test';
import type { user, userId } from '../Users/user';

export interface orderAttributes {
	ind: number;
	id?: string;
	patient_ind?: number;
	age?: number;
	test_ind?: number;
	request_date?: Date;
	o_status?: string;
	o_date?: string;
	start_time?: string;
	end_time?: string;
	payment_category?: number;
	test_location?: number;
	chemist?: number;
	pathologist?: number;
	referring_phys?: number;
	report_status?: string;
	critical?: string;
	created_by?: number;
	updated_by?: number;
}

export type orderPk = 'ind';
export type orderId = order[orderPk];
export type orderOptionalAttributes =
	| 'ind'
	| 'id'
	| 'patient_ind'
	| 'age'
	| 'test_ind'
	| 'request_date'
	| 'o_status'
	| 'o_date'
	| 'start_time'
	| 'end_time'
	| 'payment_category'
	| 'test_location'
	| 'chemist'
	| 'pathologist'
	| 'referring_phys'
	| 'report_status'
	| 'critical'
	| 'created_by'
	| 'updated_by';
export type orderCreationAttributes = Optional<
	orderAttributes,
	orderOptionalAttributes
>;

export class order
	extends Model<orderAttributes, orderCreationAttributes>
	implements orderAttributes
{
	ind!: number;
	id?: string;
	patient_ind?: number;
	age?: number;
	test_ind?: number;
	request_date?: Date;
	o_status?: string;
	o_date?: string;
	start_time?: string;
	end_time?: string;
	payment_category?: number;
	test_location?: number;
	chemist?: number;
	pathologist?: number;
	referring_phys?: number;
	report_status?: string;
	critical?: string;
	created_by?: number;
	updated_by?: number;

	// order belongsTo external_lab via test_location
	test_location_external_lab!: external_lab;
	getTest_location_external_lab!: Sequelize.BelongsToGetAssociationMixin<external_lab>;
	setTest_location_external_lab!: Sequelize.BelongsToSetAssociationMixin<
		external_lab,
		external_labId
	>;
	createTest_location_external_lab!: Sequelize.BelongsToCreateAssociationMixin<external_lab>;
	// order hasMany order_document via order_id
	order_documents!: order_document[];
	getOrder_documents!: Sequelize.HasManyGetAssociationsMixin<order_document>;
	setOrder_documents!: Sequelize.HasManySetAssociationsMixin<
		order_document,
		order_documentId
	>;
	addOrder_document!: Sequelize.HasManyAddAssociationMixin<
		order_document,
		order_documentId
	>;
	addOrder_documents!: Sequelize.HasManyAddAssociationsMixin<
		order_document,
		order_documentId
	>;
	createOrder_document!: Sequelize.HasManyCreateAssociationMixin<order_document>;
	removeOrder_document!: Sequelize.HasManyRemoveAssociationMixin<
		order_document,
		order_documentId
	>;
	removeOrder_documents!: Sequelize.HasManyRemoveAssociationsMixin<
		order_document,
		order_documentId
	>;
	hasOrder_document!: Sequelize.HasManyHasAssociationMixin<
		order_document,
		order_documentId
	>;
	hasOrder_documents!: Sequelize.HasManyHasAssociationsMixin<
		order_document,
		order_documentId
	>;
	countOrder_documents!: Sequelize.HasManyCountAssociationsMixin;
	// order belongsTo payment_category via payment_category
	payment_category_payment_category!: payment_category;
	getPayment_category_payment_category!: Sequelize.BelongsToGetAssociationMixin<payment_category>;
	setPayment_category_payment_category!: Sequelize.BelongsToSetAssociationMixin<
		payment_category,
		payment_categoryId
	>;
	createPayment_category_payment_category!: Sequelize.BelongsToCreateAssociationMixin<payment_category>;
	// order belongsTo personal via patient_ind
	patient_ind_personal!: personal;
	getPatient_ind_personal!: Sequelize.BelongsToGetAssociationMixin<personal>;
	setPatient_ind_personal!: Sequelize.BelongsToSetAssociationMixin<
		personal,
		personalId
	>;
	createPatient_ind_personal!: Sequelize.BelongsToCreateAssociationMixin<personal>;
	// order belongsTo test via test_ind
	test_ind_test!: test;
	getTest_ind_test!: Sequelize.BelongsToGetAssociationMixin<test>;
	setTest_ind_test!: Sequelize.BelongsToSetAssociationMixin<test, testId>;
	createTest_ind_test!: Sequelize.BelongsToCreateAssociationMixin<test>;
	// order belongsTo user via chemist
	chemist_user!: user;
	getChemist_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setChemist_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createChemist_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via pathologist
	pathologist_user!: user;
	getPathologist_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setPathologist_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createPathologist_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via referring_phys
	referring_phys_user!: user;
	getReferring_phys_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setReferring_phys_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createReferring_phys_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof order {
		return sequelize.define(
			'order',
			{
				ind: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				id: {
					type: DataTypes.STRING(100),
					allowNull: true,
					unique: 'order_id_key',
				},
				patient_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'patients', tableName: 'personal' },
						key: 'ind',
					},
				},
				age: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				test_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'test',
						key: 'ind',
					},
				},
				request_date: {
					type: DataTypes.DATE,
					allowNull: true,
				},
				o_status: {
					type: DataTypes.STRING(20),
					allowNull: true,
				},
				o_date: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				start_time: {
					type: DataTypes.TIME,
					allowNull: true,
				},
				end_time: {
					type: DataTypes.TIME,
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
				test_location: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'external_lab',
						key: 'ind',
					},
				},
				chemist: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
				pathologist: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
				referring_phys: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
				report_status: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				critical: {
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
				tableName: 'order',
				schema: 'laboratory',
				timestamps: true,
				indexes: [
					{
						name: 'order_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'order_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof order;
	}
}
