#!/usr/bin/env node

import colors from 'colors';
import prompts from 'prompts';
import { findNodeModules } from './utils/findNodeModules';
import { promptForDirectory } from './functions/promptForDirectory';
import { promptForDeleteALL } from './functions/promptForDeleteALL';
import { promptForSaveNodeModules } from './functions/promptForSaveNodeModules';
import { promptForDisplayNodeModules } from './functions/promptForDisplayNodeModules';
import { logWithSpace } from './utils/log';
import loading from 'loading-cli';
import { promptForDelete } from './functions/promptForDelete';

(async () => {
  console.log('');

  /* Ask where to look for node_modules  */
  const fileLocation = await promptForDirectory();

  /* Ask to skip system folders or not */
  const { ignored: ignoreSystem } = await prompts({
    type: 'confirm',
    name: 'ignored',
    message:
      'Ignore system folders (e.g. /Program Files for Windows and /Library for MacOS)?',
    initial: true,
  });

  /* Begin searching for node_modules */
  const load = await loading(
    `Searching for instances of node_modules in ${fileLocation}`,
  ).start();

  const nodeModules = await findNodeModules(fileLocation, ignoreSystem);
  load.stop();

  /* Display results */
  logWithSpace(
    colors.bgGreen(`Result: Found ${nodeModules.length} node_modules folders`),
  );

  /* Options after locating node_modules */
  const Actions = {
    SHOW: 0,
    SAVE: 1,
    FINISH: 2,
    DELETE_ALL: 3,
    DELETE: 4,
  };

  let loop = false;
  while (!loop) {
    const action = await prompts({
      type: 'select',
      name: 'action',
      message: 'Menu: ',
      choices: [
        {
          title:
            `1. Display results` +
            (nodeModules.length > 36
              ? ' (Not recommended, too many results)'
              : ''),
          value: Actions.SHOW,
        },
        {
          title:
            `2. Erase results` +
            (nodeModules.length > 36
              ? ' (Not recommended, too many results)'
              : ''),
          value: Actions.DELETE,
        },
        {
          title: `3. Save everything to .txt`,
          value: Actions.SAVE,
        },
        {
          title: `4. Erase all results`,
          value: Actions.DELETE_ALL,
        },
        { title: colors.bold('Complete'), value: Actions.FINISH },
      ],
    });

    switch (action.action) {
      case Actions.SHOW:
        await promptForDisplayNodeModules(nodeModules);
        break;
      case Actions.DELETE:
        await promptForDelete(nodeModules);
        break;
      case Actions.DELETE_ALL:
        await promptForDeleteALL(nodeModules);
        break;
      case Actions.SAVE:
        await promptForSaveNodeModules(nodeModules);
        break;
      case Actions.FINISH:
        loop = true;
        break;
    }

    console.log();
  }
})();
