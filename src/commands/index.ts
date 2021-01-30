import AddAdminRoles from './AddAdminRoles';
import AddRoles from './AddRoles';
import Allow from './Allow';
import Deny from './Deny';
import DenyList from './DenyList';
import RemoveAdminRoles from './RemoveAdminRoles';
import RemoveRoles from './RemoveRoles';
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
