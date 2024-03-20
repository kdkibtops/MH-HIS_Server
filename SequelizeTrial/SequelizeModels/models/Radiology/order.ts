import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { order_document, order_documentId } from './order_document';
import type {
	payment_category,
	payment_categoryId,
} from '../Finance/payment_category';
import type { personal, personalId } from '../Patients/personal';
import type { study, studyId } from './study';
import type { user, userId } from '../Users/user';

export interface orderAttributes {
	ind: number;
	id?: string;
	patient_ind?: number;
	age?: number;
	study_ind?: number;
	technician?: number;
	radiologist?: number;
	referring_phys?: number;
	o_status?: string;
	request_date?: string;
	o_date?: string;
	start_time?: string;
	end_time?: string;
	payment_category?: number;
	report_status?: string;
	cancelled_notes?: string;
	critical?: string;
	radiation_dose?: number;
	study_instance_uid?: string;
	series_count?: number;
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
	| 'study_ind'
	| 'technician'
	| 'radiologist'
	| 'referring_phys'
	| 'o_status'
	| 'request_date'
	| 'o_date'
	| 'start_time'
	| 'end_time'
	| 'payment_category'
	| 'report_status'
	| 'cancelled_notes'
	| 'critical'
	| 'radiation_dose'
	| 'study_instance_uid'
	| 'series_count'
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
	study_ind?: number;
	technician?: number;
	radiologist?: number;
	referring_phys?: number;
	o_status?: string;
	request_date?: string;
	o_date?: string;
	start_time?: string;
	end_time?: string;
	payment_category?: number;
	report_status?: string;
	cancelled_notes?: string;
	critical?: string;
	radiation_dose?: number;
	study_instance_uid?: string;
	series_count?: number;
	created_by?: number;
	updated_by?: number;

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
	// order belongsTo study via study_ind
	study_ind_study!: study;
	getStudy_ind_study!: Sequelize.BelongsToGetAssociationMixin<study>;
	setStudy_ind_study!: Sequelize.BelongsToSetAssociationMixin<study, studyId>;
	createStudy_ind_study!: Sequelize.BelongsToCreateAssociationMixin<study>;
	// order belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via radiologist
	radiologist_user!: user;
	getRadiologist_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setRadiologist_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createRadiologist_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via referring_phys
	referring_phys_user!: user;
	getReferring_phys_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setReferring_phys_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createReferring_phys_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// order belongsTo user via technician
	technician_user!: user;
	getTechnician_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setTechnician_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createTechnician_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
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
				study_ind: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'study',
						key: 'ind',
					},
				},
				technician: {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: { schema: 'users', tableName: 'user' },
						key: 'ind',
					},
				},
				radiologist: {
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
				o_status: {
					type: DataTypes.STRING(20),
					allowNull: true,
				},
				request_date: {
					type: DataTypes.DATEONLY,
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
				report_status: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				cancelled_notes: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				critical: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				radiation_dose: {
					type: DataTypes.DOUBLE,
					allowNull: true,
				},
				study_instance_uid: {
					type: DataTypes.STRING,
					allowNull: true,
					unique: 'order_study_instance_uid_key',
				},
				series_count: {
					type: DataTypes.INTEGER,
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
				schema: 'radiology',
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
					{
						name: 'order_study_instance_uid_key',
						unique: true,
						fields: [{ name: 'study_instance_uid' }],
					},
				],
			}
		) as typeof order;
	}
}
