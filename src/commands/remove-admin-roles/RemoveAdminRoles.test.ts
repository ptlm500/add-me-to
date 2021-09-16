import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import RemoveAdminRoles from './RemoveAdminRoles';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { removeAdminRoles } from "../../services/serverManagementService";
import { Server } from '../../entities';

jest.mock("../../services/serverManagementService");

const mockedRemoveAdminRoles = mocked(removeAdminRoles);

let command: RemoveAdminRoles;

const discord = new MockDiscord();

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

describe('RemoveAdminRoles.onRun', () => {
  mockedRemoveAdminRoles.mockImplementation(() => Promise.resolve(new Server()));

  it('calls removeAdminRoles with the mentioned roles and server guild id', async () => {
    const roles = discord.createRoleCollection([['admin', {}], [['moderator', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedRemoveAdminRoles).toHaveBeenCalledWith(discord.getGuild().id, message.mentions.roles);
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
