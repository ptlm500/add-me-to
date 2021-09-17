import * as commandAssertions from '../../../test/commandAssertions';
import Deny from './Deny';

jest.mock("../../services/serverManagementService");


let command: Deny;

beforeEach(() => {
  command = new Deny();
});

describe('Deny', () => {
  it('has the name "deny"', () => {
    commandAssertions.hasName(command, "deny");
  });

  it('has no aliases', () => {
    commandAssertions.hasNoAliases(command);
  });

  it('requires admin permissions', () => {
    commandAssertions.requiresAdmin(command, true);
  });
});
