import type { Sequelize } from "sequelize";
import { job as _job } from "./job";
import type { jobAttributes, jobCreationAttributes } from "./job";
import { qualification_category as _qualification_category } from "./qualification_category";
import type { qualification_categoryAttributes, qualification_categoryCreationAttributes } from "./qualification_category";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";
import { user_contact as _user_contact } from "./user_contact";
import type { user_contactAttributes, user_contactCreationAttributes } from "./user_contact";
import { user_role as _user_role } from "./user_role";
import type { user_roleAttributes, user_roleCreationAttributes } from "./user_role";

export {
  _job as job,
  _qualification_category as qualification_category,
  _user as user,
  _user_contact as user_contact,
  _user_role as user_role,
};

export type {
  jobAttributes,
  jobCreationAttributes,
  qualification_categoryAttributes,
  qualification_categoryCreationAttributes,
  userAttributes,
  userCreationAttributes,
  user_contactAttributes,
  user_contactCreationAttributes,
  user_roleAttributes,
  user_roleCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const job = _job.initModel(sequelize);
  const qualification_category = _qualification_category.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const user_contact = _user_contact.initModel(sequelize);
  const user_role = _user_role.initModel(sequelize);

  user.belongsTo(job, { as: "job_job", foreignKey: "job"});
  job.hasMany(user, { as: "users", foreignKey: "job"});
  user_contact.belongsTo(user, { as: "created_by_user", foreignKey: "created_by"});
  user.hasMany(user_contact, { as: "user_contacts", foreignKey: "created_by"});
  user_contact.belongsTo(user, { as: "updated_by_user", foreignKey: "updated_by"});
  user.hasMany(user_contact, { as: "updated_by_user_contacts", foreignKey: "updated_by"});
  user_contact.belongsTo(user, { as: "user_ind_user", foreignKey: "user_ind"});
  user.hasMany(user_contact, { as: "user_ind_user_contacts", foreignKey: "user_ind"});
  user.belongsTo(user_role, { as: "user_role_user_role", foreignKey: "user_role"});
  user_role.hasMany(user, { as: "users", foreignKey: "user_role"});

  return {
    job: job,
    qualification_category: qualification_category,
    user: user,
    user_contact: user_contact,
    user_role: user_role,
  };
}
