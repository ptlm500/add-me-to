import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import Deny from './Deny';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { denyRoles } from "../../services/serverManagementService";
import { Server } from '../../entities';

jest.mock("../../services/serverManagementService");

const mockedDenyRoles = mocked(denyRoles);

let command: Deny;

const discord = new MockDiscord();

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

describe('Deny.onRun', () => {
  mockedDenyRoles.mockImplementation(() => Promise.resolve(new Server()));

  it('calls denyRoles with the mentioned roles and server guild id', async () => {
    const roles = discord.createRoleCollection([['strategy games', {}], [['discussion', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedDenyRoles).toHaveBeenCalledWith(discord.getGuild().id, message.mentions.roles);
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
