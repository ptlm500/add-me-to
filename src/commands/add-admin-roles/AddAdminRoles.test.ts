import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import AddAdminRoles from './AddAdminRoles';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { addAdminRoles } from "../../services/serverManagementService";
import { Server } from '../../entities';

jest.mock("../../services/serverManagementService");

const mockedAddAdminRoles = mocked(addAdminRoles);

let command: AddAdminRoles;

const discord = new MockDiscord();

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

describe('AddAdminRoles.onRun', () => {
  mockedAddAdminRoles.mockImplementation(() => Promise.resolve(new Server()));

  it('calls addAdminRoles with the mentioned roles and server guild id', async () => {
    const roles = discord.createRoleCollection([['admin', {}], [['moderator', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedAddAdminRoles).toHaveBeenCalledWith(discord.getGuild().id, message.mentions.roles);
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
