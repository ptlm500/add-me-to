import * as commandAssertions from '../../../test/commandAssertions';
import DenyList from './DenyList';

jest.mock("../../services/serverManagementService");

let command: DenyList;


beforeEach(() => {
  command = new DenyList();
});

describe('DenyList', () => {
  it('has the name "deny list"', () => {
    commandAssertions.hasName(command, "deny list");
  });

  it('has the alias "denied"', () => {
    commandAssertions.hasAliases(command, ["denied"]);
  });

  it('doesn\'t require admin permissions', () => {
    commandAssertions.requiresAdmin(command, false);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
