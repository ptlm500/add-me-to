import { mocked } from 'ts-jest/utils';
import { Role as DiscordRole } from 'discord.js';
import User from './User';
import { AdminRole } from '../entities';
import MockDiscord from '../../test/MockDiscord';
import { getAdminRoles} from "../services/serverManagementService";

jest.mock("../services/serverManagementService");

const mockedGetAdminRoles = mocked(getAdminRoles);

const discord = new MockDiscord();

describe('canAdministerServer', () => {
  it('returns true when permissions contains the administrator permission', () => {
    const user = new User(["ADMINISTRATOR"], []);

    expect(user.canAdministerServer()).toBeTruthy();
  });

  it('returns false when permissions contains no permissions', () => {
    const user = new User([], []);

    expect(user.canAdministerServer()).toBeFalsy();
  });

  it('returns false when permissions doesn\'t contain the adminstrator permission', () => {
    const user = new User(["MANAGE_ROLES", "MANAGE_NICKNAMES"], []);

    expect(user.canAdministerServer()).toBeFalsy();
  });
});

describe('canAdministerRoles', () => {
  const serverId = 'test_server';
  const adminDiscordRole = getDiscordRole('admin');
  const nonAdminDiscordRole = getDiscordRole('user');
  const adminRole = new AdminRole();
  adminRole.discordId = adminDiscordRole.id;

  mockedGetAdminRoles.mockImplementation(() => Promise.resolve([adminRole]));

  it('returns true when permissions contain the administrator permission, and user has an admin role', async () => {
    const user = new User(["ADMINISTRATOR"], [adminDiscordRole]);

    const result = await user.canAdministerRoles(serverId);
    expect(result).toBeTruthy();
  });

  it('returns true when permissions contain the administrator permission, and user has no admin role', async () => {
    const user = new User(["ADMINISTRATOR"], []);

    const result = await user.canAdministerRoles(serverId);
    expect(result).toBeTruthy();
  });

  it('returns true when permissions don\'t contain the administrator permission, and user has an admin role', async () => {
    const user = new User(["ADD_REACTIONS"], [adminDiscordRole]);

    const result = await user.canAdministerRoles(serverId);
    expect(result).toBeTruthy();
  });

  it('returns false when permissions don\'t contain the administrator permission, and user has no admin role', async () => {
    const user = new User(["ADD_REACTIONS"], [nonAdminDiscordRole]);

    const result = await user.canAdministerRoles(serverId);
    expect(result).toBeFalsy();
  });

  it('returns false when permissions don\'t contain the administrator permission, and user has no admin role', async () => {
    const user = new User(["ADD_REACTIONS"], []);

    const result = await user.canAdministerRoles(serverId);
    expect(result).toBeFalsy();
  });
});

afterAll(() => {
  discord.cleanup();
  jest.restoreAllMocks();
});

function getDiscordRole(id: string): DiscordRole {
  return new DiscordRole(discord.getClient(), { id }, discord.getGuild());
}
