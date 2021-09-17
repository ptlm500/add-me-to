import * as commandAssertions from '../../../test/commandAssertions';
import AddAdminRoles from './AddAdminRoles';

jest.mock("../../services/serverManagementService");

let command: AddAdminRoles;

beforeEach(() => {
  command = new AddAdminRoles();
});

describe('AddAdminRoles', () => {
  it('has the name "add admin roles"', () => {
    commandAssertions.hasName(command, "add admin roles");
  });

  it('has the alias "add admin"', () => {
    commandAssertions.hasAliases(command, ["add admin"]);
  });

  it('requires admin permissions', () => {
    commandAssertions.requiresAdmin(command, true);
  });
});
