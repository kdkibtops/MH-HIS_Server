import { sequelizeClient } from '../sequelizeConfig';
import { initModels as UserInit } from '../models/Users/init-models';
import { initModels as FinanceInit } from '../models/Finance/init-models';
import {
	laboratory,
	initModels as PatientInit,
} from '../models/Patients/init-models';
import { initModels as RadiologyInit } from '../models/Radiology/init-models';
import { initModels as LaboratoryInit } from '../models/Laboratory/init-models';
import { initModels as ProcedureInit } from '../models/Procedures/init-models';
import { initModels as InventoryInit } from '../models/Inventory/init-models';

export const User = UserInit(sequelizeClient);
export const Finance = FinanceInit(sequelizeClient);
export const Inventory = InventoryInit(sequelizeClient);
export const Patient = PatientInit(sequelizeClient);
export const Radiology = RadiologyInit(sequelizeClient);
export const Laboratory = LaboratoryInit(sequelizeClient);
export const Procedure = ProcedureInit(sequelizeClient);

export const sequelizeInitializeDB = async () => {
	try {
		await sequelizeClient.createSchema('users', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('procedures_schema', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('inventory', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('laboratory', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('radiology', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('patients', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await sequelizeClient.createSchema('finance', {
			logging(sql, timing) {
				console.log(`Command: ${sql}`);
				console.log(`Timing: ${timing}`);
			},
		});
		await User.user_role.sync();
		await User.job.sync();
		await User.user.sync();
		await User.user_contact.sync();
		await User.qualification_category.sync();
		await Finance.payment_category.sync();
		await Patient.personal.sync();
		await Patient.diabetes_description.sync();
		await Patient.hypertension_description.sync();
		await Patient.liver_condition.sync();
		await Patient.clinical.sync();
		await Patient.laboratory.sync();
		await Patient.imaging.sync();
		await Patient.investigation.sync();
		await Patient.intervention.sync();
		await Patient.chronic_disease.sync();
		await Patient.patients_contact.sync();
		await Patient.paperwork.sync();
		await Radiology.study_preparation.sync();
		await Radiology.study.sync();
		await Radiology.order.sync();
		await Radiology.order_document.sync();
		await Laboratory.test.sync();
		await Laboratory.external_lab.sync();
		await Laboratory.external_lab_test.sync();
		await Laboratory.order.sync();
		await Laboratory.order_document.sync();
		await Procedure.procedure.sync();
		await Procedure.lab.sync();
		await Procedure.imaging.sync();
		await Procedure.paperwork.sync();
		await Inventory.categories.sync();
		await Inventory.store.sync();
		await Inventory.material.sync();
		await Inventory.transaction.sync();
		await Inventory.item_movement.sync();
		console.log('Done');
		await User.user_role.bulkCreate([
			{
				id: 1,
				role_name: 'Admin',
				role_privileges: {
					addRoles: true,
					addUsers: true,
					addPatients: true,
					addStudies: true,
					addOrders: true,
					editRoles: true,
					editUsers: true,
					editPatients: true,
					editStudies: true,
					editOrders: true,
					showAll: true,
					showPending: true,
					showVerified: true,
					showPrinted: true,
					showDelivered: true,
					showAssigned: true,
					editAll: true,
					editPending: true,
					editVerified: true,
					editPrinted: true,
					editDelivered: true,
					editAssigned: true,
				},
			},
			{
				id: 2,
				role_name: 'Staff',
				role_privileges: {
					addRoles: true,
					addUsers: true,
					addPatients: true,
					addStudies: true,
					addOrders: true,
					editRoles: true,
					editUsers: true,
					editPatients: true,
					editStudies: true,
					editOrders: true,
					showAll: true,
					showPending: true,
					showVerified: true,
					showPrinted: true,
					showDelivered: true,
					showAssigned: true,
					editAll: true,
					editPending: true,
					editVerified: true,
					editPrinted: true,
					editDelivered: true,
					editAssigned: true,
				},
			},
			{
				id: 3,
				role_name: 'User',
				role_privileges: {
					addRoles: true,
					addUsers: true,
					addPatients: true,
					addStudies: true,
					addOrders: true,
					editRoles: true,
					editUsers: true,
					editPatients: true,
					editStudies: true,
					editOrders: true,
					showAll: true,
					showPending: true,
					showVerified: true,
					showPrinted: true,
					showDelivered: true,
					showAssigned: true,
					editAll: true,
					editPending: true,
					editVerified: true,
					editPrinted: true,
					editDelivered: true,
					editAssigned: true,
				},
			},
		]);
		await User.user.create(
			{
				username: '',
				first_name: 'Admin-first',
				middle_name: 'Admin-middle',
				last_name: 'Admin-last',
				dob: '14/12/1988',
				user_role: 1,
				user_password:
					'$2b$10$iSPvkSNRPbNfDFKRq.AFhehLKIjK02SSKjbEfD8BxckS/.e8FxZD2',
			},
			{}
		);
	} catch (error) {
		console.error(error);
	}
};

export const runQuery = async () => {
	const users = await User.user.findAll({
		attributes: { exclude: ['ind'] },
		logging: false,
	});
	console.log(users[0]);
};

// export const destroyDatabase = aasync ()=>{

// }
