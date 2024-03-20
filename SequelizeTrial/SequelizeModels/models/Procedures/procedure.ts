import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { imaging, imagingId } from './imaging';
import type { lab, labId } from './lab';
import type { paperwork, paperworkId } from './paperwork';
import type { user, userId } from '../Users/user';

export interface procedureAttributes {
	ind: number;
	id?: string;
	proc_name?: string;
	price?: number;
	created_by?: number;
	updated_by?: number;
}

export type procedurePk = 'ind';
export type procedureId = procedure[procedurePk];
export type procedureOptionalAttributes =
	| 'ind'
	| 'id'
	| 'proc_name'
	| 'price'
	| 'created_by'
	| 'updated_by';
export type procedureCreationAttributes = Optional<
	procedureAttributes,
	procedureOptionalAttributes
>;

export class procedure
	extends Model<procedureAttributes, procedureCreationAttributes>
	implements procedureAttributes
{
	ind!: number;
	id?: string;
	proc_name?: string;
	price?: number;
	created_by?: number;
	updated_by?: number;

	// procedure hasMany imaging via procedure_ind
	imagings!: imaging[];
	getImagings!: Sequelize.HasManyGetAssociationsMixin<imaging>;
	setImagings!: Sequelize.HasManySetAssociationsMixin<imaging, imagingId>;
	addImaging!: Sequelize.HasManyAddAssociationMixin<imaging, imagingId>;
	addImagings!: Sequelize.HasManyAddAssociationsMixin<imaging, imagingId>;
	createImaging!: Sequelize.HasManyCreateAssociationMixin<imaging>;
	removeImaging!: Sequelize.HasManyRemoveAssociationMixin<imaging, imagingId>;
	removeImagings!: Sequelize.HasManyRemoveAssociationsMixin<imaging, imagingId>;
	hasImaging!: Sequelize.HasManyHasAssociationMixin<imaging, imagingId>;
	hasImagings!: Sequelize.HasManyHasAssociationsMixin<imaging, imagingId>;
	countImagings!: Sequelize.HasManyCountAssociationsMixin;
	// procedure hasMany lab via procedure_ind
	labs!: lab[];
	getLabs!: Sequelize.HasManyGetAssociationsMixin<lab>;
	setLabs!: Sequelize.HasManySetAssociationsMixin<lab, labId>;
	addLab!: Sequelize.HasManyAddAssociationMixin<lab, labId>;
	addLabs!: Sequelize.HasManyAddAssociationsMixin<lab, labId>;
	createLab!: Sequelize.HasManyCreateAssociationMixin<lab>;
	removeLab!: Sequelize.HasManyRemoveAssociationMixin<lab, labId>;
	removeLabs!: Sequelize.HasManyRemoveAssociationsMixin<lab, labId>;
	hasLab!: Sequelize.HasManyHasAssociationMixin<lab, labId>;
	hasLabs!: Sequelize.HasManyHasAssociationsMixin<lab, labId>;
	countLabs!: Sequelize.HasManyCountAssociationsMixin;
	// procedure hasMany paperwork via procedure_ind
	paperworks!: paperwork[];
	getPaperworks!: Sequelize.HasManyGetAssociationsMixin<paperwork>;
	setPaperworks!: Sequelize.HasManySetAssociationsMixin<paperwork, paperworkId>;
	addPaperwork!: Sequelize.HasManyAddAssociationMixin<paperwork, paperworkId>;
	addPaperworks!: Sequelize.HasManyAddAssociationsMixin<paperwork, paperworkId>;
	createPaperwork!: Sequelize.HasManyCreateAssociationMixin<paperwork>;
	removePaperwork!: Sequelize.HasManyRemoveAssociationMixin<
		paperwork,
		paperworkId
	>;
	removePaperworks!: Sequelize.HasManyRemoveAssociationsMixin<
		paperwork,
		paperworkId
	>;
	hasPaperwork!: Sequelize.HasManyHasAssociationMixin<paperwork, paperworkId>;
	hasPaperworks!: Sequelize.HasManyHasAssociationsMixin<paperwork, paperworkId>;
	countPaperworks!: Sequelize.HasManyCountAssociationsMixin;
	// procedure belongsTo user via created_by
	created_by_user!: user;
	getCreated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setCreated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createCreated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;
	// procedure belongsTo user via updated_by
	updated_by_user!: user;
	getUpdated_by_user!: Sequelize.BelongsToGetAssociationMixin<user>;
	setUpdated_by_user!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
	createUpdated_by_user!: Sequelize.BelongsToCreateAssociationMixin<user>;

	static initModel(sequelize: Sequelize.Sequelize): typeof procedure {
		return sequelize.define(
			'procedure',
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
					unique: 'procedure_id_key',
				},
				proc_name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				price: {
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
				tableName: 'procedure',
				schema: 'procedures_schema',
				timestamps: true,
				indexes: [
					{
						name: 'procedure_id_key',
						unique: true,
						fields: [{ name: 'id' }],
					},
					{
						name: 'procedure_pkey',
						unique: true,
						fields: [{ name: 'ind' }],
					},
				],
			}
		) as typeof procedure;
	}
}
