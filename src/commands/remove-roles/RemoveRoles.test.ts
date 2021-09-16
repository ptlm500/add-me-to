import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import RemoveRoles from './RemoveRoles';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { removeRoles } from "../../controllers/roleManagementController";

jest.mock("../../controllers/roleManagementController");

const mockedRemoveRoles = mocked(removeRoles);

let command: RemoveRoles;

const discord = new MockDiscord();

beforeEach(() => {
  command = new RemoveRoles();
});

describe('RemoveRoles', () => {
  it('has the name "remove"', () => {
    commandAssertions.hasName(command, "remove");
  });

  it('has the aliases "remove me from" and "delete', () => {
    commandAssertions.hasAliases(command, ["remove me from", "delete"]);
  });

  it('doesn\'t require admin permissions', () => {
    commandAssertions.requiresAdmin(command, false);
  });
});

describe('RemoveRoles.onRun', () => {
  mockedRemoveRoles.mockImplementation(() => Promise.resolve(true));

  it('calls addRoles with the mentioned roles and message sender', async () => {
    const roles = discord.createRoleCollection([['rolePlaying', {}], [['gaming', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedRemoveRoles).toHaveBeenCalledWith(message.member, message.mentions.roles);
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
