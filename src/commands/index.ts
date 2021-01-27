import AddRoles from './AddRoles';
import Allow from './Allow';
import Deny from './Deny';
import DenyList from './DenyList';
import RemoveRoles from './RemoveRoles';

export const addRoles = new AddRoles();
const allow = new Allow();
const deny = new Deny();
const denyList = new DenyList();
const removeRoles = new RemoveRoles();

export default [
  addRoles,
  allow,
  deny,
  denyList,
  removeRoles
];
