import type { Sequelize } from 'sequelize';
import { imaging as _imaging } from './imaging';
import type { imagingAttributes, imagingCreationAttributes } from './imaging';
import { lab as _lab } from './lab';
import type { labAttributes, labCreationAttributes } from './lab';
import { paperwork as _paperwork } from './paperwork';
import type {
	paperworkAttributes,
	paperworkCreationAttributes,
} from './paperwork';
import { procedure as _procedure } from './procedure';
import type {
	procedureAttributes,
	procedureCreationAttributes,
} from './procedure';
import { study } from '../Radiology/study';
import { user } from '../Users/user';
import { test } from '../Laboratory/test';

export {
	_imaging as imaging,
	_lab as lab,
	_paperwork as paperwork,
	_procedure as procedure,
};

export type {
	imagingAttributes,
	imagingCreationAttributes,
	labAttributes,
	labCreationAttributes,
	paperworkAttributes,
	paperworkCreationAttributes,
	procedureAttributes,
	procedureCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const imaging = _imaging.initModel(sequelize);
	const lab = _lab.initModel(sequelize);
	const paperwork = _paperwork.initModel(sequelize);
	const procedure = _procedure.initModel(sequelize);

	// imaging.belongsTo(procedure, {
	// 	as: 'procedure_ind_procedure',
	// 	foreignKey: 'procedure_ind',
	// });
	// procedure.hasMany(imaging, { as: 'imagings', foreignKey: 'procedure_ind' });
	// lab.belongsTo(procedure, {
	// 	as: 'procedure_ind_procedure',
	// 	foreignKey: 'procedure_ind',
	// });
	// procedure.hasMany(lab, { as: 'labs', foreignKey: 'procedure_ind' });
	// paperwork.belongsTo(procedure, {
	// 	as: 'procedure_ind_procedure',
	// 	foreignKey: 'procedure_ind',
	// });
	// procedure.hasMany(paperwork, {
	// 	as: 'paperworks',
	// 	foreignKey: 'procedure_ind',
	// });
	// imaging.belongsTo(study, { as: 'study', foreignKey: 'study_id' });
	// study.hasMany(imaging, { as: 'imagings', foreignKey: 'study_id' });
	// lab.belongsTo(test, { as: 'test', foreignKey: 'test_id' });
	// test.hasMany(lab, { as: 'labs', foreignKey: 'test_id' });
	// imaging.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(imaging, { as: 'imagings', foreignKey: 'created_by' });
	// imaging.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(imaging, {
	// 	as: 'updated_by_imagings',
	// 	foreignKey: 'updated_by',
	// });
	// lab.belongsTo(user, { as: 'created_by_user', foreignKey: 'created_by' });
	// user.hasMany(lab, { as: 'labs', foreignKey: 'created_by' });
	// lab.belongsTo(user, { as: 'updated_by_user', foreignKey: 'updated_by' });
	// user.hasMany(lab, { as: 'updated_by_labs', foreignKey: 'updated_by' });
	// paperwork.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(paperwork, { as: 'paperworks', foreignKey: 'created_by' });
	// paperwork.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(paperwork, {
	// 	as: 'updated_by_paperworks',
	// 	foreignKey: 'updated_by',
	// });
	// procedure.belongsTo(user, {
	// 	as: 'created_by_user',
	// 	foreignKey: 'created_by',
	// });
	// user.hasMany(procedure, { as: 'procedures', foreignKey: 'created_by' });
	// procedure.belongsTo(user, {
	// 	as: 'updated_by_user',
	// 	foreignKey: 'updated_by',
	// });
	// user.hasMany(procedure, {
	// 	as: 'updated_by_procedures',
	// 	foreignKey: 'updated_by',
	// });

	return {
		imaging: imaging,
		lab: lab,
		paperwork: paperwork,
		procedure: procedure,
	};
}
