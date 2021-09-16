import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import Allow from './Allow';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { allowRoles } from "../../services/serverManagementService";
import { Server } from '../../entities';

jest.mock("../../services/serverManagementService");

const mockedAllowRoles = mocked(allowRoles);

let command: Allow;

const discord = new MockDiscord();

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

describe('Allow.onRun', () => {
  mockedAllowRoles.mockImplementation(() => Promise.resolve(new Server()));

  it('calls allowRoles with the mentioned roles and server guild id', async () => {
    const roles = discord.createRoleCollection([['strategy games', {}], [['discussion', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedAllowRoles).toHaveBeenCalledWith(discord.getGuild().id, message.mentions.roles);
  });

  it('throws an error when no roles are mentioned', async () => {
    const message = discord.createMessage();

    try {
      await command.onRun(message);
    } catch (e) {
      expect(e).toEqual(new InvalidCommandError("🤷 No roles mentioned"));
    }
  });
});

afterAll(() => {
  discord.cleanup();
  jest.restoreAllMocks();
});
