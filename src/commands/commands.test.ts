import commands from '.';

describe('commands', () => {
  test('no command names clash', () => {
    let commandNames: string[] = [];

    commands.forEach(commmand => {
      commandNames = [...commandNames, commmand.name];

      if (commmand.aliases && commmand.aliases.length) {
        commandNames = [...commandNames, ...commmand.aliases]
      }
    });

    const duplicatedCommands = commandNames.reduce((acc: string[], el, i, arr) => {
      (arr.indexOf(el) !== i && acc.indexOf(el) < 0) && acc.push(el);
      return acc;
    }, []);

    expect(duplicatedCommands).toEqual([]);
  });
})
