import * as commandAssertions from '../../../test/commandAssertions';
import RemoveAdminRoles from './RemoveAdminRoles';

jest.mock("../../services/serverManagementService");


let command: RemoveAdminRoles;

beforeEach(() => {
  command = new RemoveAdminRoles();
});

describe('RemoveAdminRoles', () => {
  it('has the name "remove admin roles"', () => {
    commandAssertions.hasName(command, "remove admin roles");
  });

  it('has the aliases "remove admin", "delete admin" and "delete admin roles"', () => {
    commandAssertions.hasAliases(command, ["remove admin", "delete admin", "delete admin roles"]);
  });

  it('requires admin permissions', () => {
    commandAssertions.requiresAdmin(command, true);
  });
});
