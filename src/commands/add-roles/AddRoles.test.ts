import { mocked } from 'ts-jest/utils';
import * as commandAssertions from '../../../test/commandAssertions';
import MockDiscord from '../../../test/MockDiscord';
import AddRoles from './AddRoles';
import InvalidCommandError from "../../errors/InvalidCommandError";
import { addRoles } from "../../controllers/roleManagementController";

jest.mock("../../controllers/roleManagementController");

const mockedAddRoles = mocked(addRoles);

let command: AddRoles;

const discord = new MockDiscord();

beforeEach(() => {
  command = new AddRoles();
});

describe('AddRoles', () => {
  it('has the name "add me to"', () => {
    commandAssertions.hasName(command, "add me to");
  });

  it('has the aliases "to" and "add', () => {
    commandAssertions.hasAliases(command, ["to", "add"]);
  });

  it('doesn\'t require admin permissions', () => {
    commandAssertions.requiresAdmin(command, false);
  });
});

describe('AddRoles.onRun', () => {
  mockedAddRoles.mockImplementation(() => Promise.resolve(true));

  it('calls addRoles with the mentioned roles and message sender', async () => {
    const roles = discord.createRoleCollection([['rolePlaying', {}], [['gaming', {}]]]);
    const message = discord.createMessage({mention_roles: roles});

    const response = await command.onRun(message);

    expect(response).toBeTruthy();
    expect(mockedAddRoles).toHaveBeenCalledWith(message.member, message.mentions.roles);
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
