import * as commandAssertions from '../../../test/commandAssertions';
import Allow from './Allow';

jest.mock("../../services/serverManagementService");

let command: Allow;

beforeEach(() => {
  command = new Allow();
});

describe('Allow', () => {
  it('has the name "allow"', () => {
    commandAssertions.hasName(command, "allow");
  });

  it('has no aliases', () => {
    commandAssertions.hasNoAliases(command);
  });

  it('requires admin permissions', () => {
    commandAssertions.requiresAdmin(command, true);
  });
});
