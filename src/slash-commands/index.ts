import AddAdmin from './add-admin-role/AddAdmin';
import Add from './add/Add';
import Deny from './deny/Deny';
import RemoveAdminRole from './remove-admin-role/RemoveAdmin';
import Remove from './remove/Remove';
import Settings from './settings/Settings';

const add = new Add();
const addAdmin = new AddAdmin();
const deny = new Deny();
const remove = new Remove();
const removeAdmin = new RemoveAdminRole();
const settings = new Settings();

export default [
  add,
  addAdmin,
  deny,
  remove,
  removeAdmin,
  settings
];
