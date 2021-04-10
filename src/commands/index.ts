import AddAdminRoles from './add-admin-roles/AddAdminRoles';
import AddRoles from './add-roles/AddRoles';
import Allow from './allow/Allow';
import Deny from './deny/Deny';
import DenyList from './DenyList';
import RemoveAdminRoles from './remove-admin-roles/RemoveAdminRoles';
import RemoveRoles from './remove-roles/RemoveRoles';
import SettingsList from './SettingsList';

const addAdminRoles = new AddAdminRoles();
export const addRoles = new AddRoles();
const allow = new Allow();
const deny = new Deny();
const denyList = new DenyList();
const removeAdminRoles = new RemoveAdminRoles();
const removeRoles = new RemoveRoles();
const settingsList = new SettingsList();

export default [
  addAdminRoles,
  addRoles,
  allow,
  deny,
  denyList,
  removeAdminRoles,
  removeRoles,
  settingsList
];
