import MockDiscord from '../../test/MockDiscord';
import Command from '../command-handler/Command';
import AddAdminRoles from './AddAdminRoles';

let _command : Command;
let _mockDiscord : MockDiscord;

describe('AddAdminRoles', () => {
  beforeEach(() => {
    _command = new AddAdminRoles();
    _mockDiscord = new MockDiscord();
  });

  it('has the correct name and aliases', () => {
    expect(_command.name).toBe("add admin roles");
    expect(_command.aliases).toEqual(["add admin"]);
  });

  it('adds throws an error when called with no roles mentioned', async () => {
    const message = _mockDiscord.createMessage();
    await _command.run(message);
  });
});
