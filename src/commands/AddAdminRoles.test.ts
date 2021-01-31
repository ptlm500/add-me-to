import Command from 'src/command-handler/Command';
import AddAdminRoles from './AddAdminRoles';

let _command : Command;

describe('AddAdminRoles', () => {
  beforeEach(() => {
    _command = new AddAdminRoles();
  });

  it('has the correct name and aliases', () => {
    expect(_command.name).toBe("add admin roles");
    expect(_command.aliases).toEqual(["add admin"]);
  });
});
