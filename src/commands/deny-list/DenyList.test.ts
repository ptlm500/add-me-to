import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import DenyList from './DenyList';

jest.mock("../../services/serverManagementService");

let command: DenyList;

const discord = new MockDiscord();

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
  discord.cleanup();
  jest.restoreAllMocks();
});
