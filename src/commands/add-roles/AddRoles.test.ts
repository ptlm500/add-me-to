import * as commandAssertions from '../../../test/commandAssertions';
import AddRoles from './AddRoles';

jest.mock("../../controllers/roleManagementController");

let command: AddRoles;

beforeEach(() => {
  command = new AddRoles();
});

describe('AddRoles', () => {
  it('has the name "add me to"', () => {
    commandAssertions.hasName(command, "add me to");
  });

  it('has the aliases "to" and "add', () => {
    commandAssertions.hasAliases(command, ["to", "add"]);
  });

  it('doesn\'t require admin permissions', () => {
    commandAssertions.requiresAdmin(command, false);
  });
});
