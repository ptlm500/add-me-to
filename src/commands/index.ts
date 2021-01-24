import AddRoles from './AddRoles';
import Allow from './Allow';
import Deny from './Deny';
import DenyList from './DenyList';

export const addRoles = new AddRoles();
const allow = new Allow();
const deny = new Deny();
const denyList = new DenyList();

export default [
  addRoles,
  allow,
  deny,
  denyList
];
