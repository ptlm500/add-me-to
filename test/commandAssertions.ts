import Command from '../src/command-handler/Command';

export function hasName(command: Command, name: string): void {
  expect(command.name).toBe(name);
}

export function hasAliases(command: Command, aliases: string[]): void {
  expect(command.aliases).toEqual(aliases);
}

export function hasNoAliases(command: Command): void {
  expect(command.aliases).toBeUndefined();
}

export function requiresAdmin(command: Command, requiresAdmin: boolean): void {
  if (requiresAdmin) {
    expect(command.requiresAdmin).toBeTruthy();
  } else {
    expect(command.requiresAdmin).toBeFalsy();
  }
}
