import colors from 'colors';
import prompts from 'prompts';
import { logWithSpace } from '../utils/log';
import { deleteNodeModules } from '../utils/deleteNodeModules';

export const promptForDelete = async (nodeModules: string[]) => {
  console.log();
  const response = await prompts({
    type: 'multiselect',
    name: 'deleted',
    message: 'Select node_modules to be deleted?',
    choices: nodeModules.map((nodeModule, key: number) => ({
      title: nodeModule,
      value: key,
    })),
  });
  const selectedNodeModules = response.deleted.map(
    (key: number) => nodeModules[key],
  );

  const confirmPrompt = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: `Delete ${selectedNodeModules.length} node_modules folders? Confirm?`,
    initial: false,
  });

  if (confirmPrompt.confirmed) {
    const deletedCount = await deleteNodeModules(selectedNodeModules);
    logWithSpace(
      colors.bgGreen(`Removed ${deletedCount} node_modules folders`),
    );
  } else {
    logWithSpace(colors.black(`Deletion skipped`));
  }
};
