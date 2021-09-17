import { Collection } from 'discord.js';
import User from './User';

jest.mock("../services/serverManagementService");

describe('canAdministerServer', () => {
  it('returns true when permissions contains the administrator permission', () => {
    const user = new User(["ADMINISTRATOR"], new Collection([]));

    expect(user.canAdministerServer()).toBeTruthy();
  });

  it('returns false when permissions contains no permissions', () => {
    const user = new User([], new Collection([]));

    expect(user.canAdministerServer()).toBeFalsy();
  });

  it('returns false when permissions doesn\'t contain the adminstrator permission', () => {
    const user = new User(["MANAGE_ROLES", "MANAGE_NICKNAMES"], new Collection([]));

    expect(user.canAdministerServer()).toBeFalsy();
  });
});
