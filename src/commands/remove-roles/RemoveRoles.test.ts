import * as commandAssertions from '../../../test/commandAssertions';
import RemoveRoles from './RemoveRoles';

jest.mock("../../controllers/roleManagementController");

let command: RemoveRoles;

beforeEach(() => {
  command = new RemoveRoles();
});

describe('RemoveRoles', () => {
  it('has the name "remove"', () => {
    commandAssertions.hasName(command, "remove");
  });

  it('has the aliases "remove me from" and "delete', () => {
    commandAssertions.hasAliases(command, ["remove me from", "delete"]);
  });

  it('doesn\'t require admin permissions', () => {
    commandAssertions.requiresAdmin(command, false);
  });
});
