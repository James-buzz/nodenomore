import prompts from 'prompts';
import { findALLDrives } from '../utils/findDrives';

const CUSTOM_CHOICE_VALUE = 'custom';

/**
 * Prompt user for directory to scan.
 * @returns {Promise<String>} selected or inputted directory.
 */
export async function promptForDirectory() {
  const drives = await findALLDrives();
  const dirOptions = [
    { title: 'Search the current directory', value: './' },
    { title: 'Search the whole computer', value: '/' },
    ...drives.map((drive) => ({
      title: `Search only: ${drive}`,
      value: drive,
    })),
    { title: 'Search a custom filepath', value: CUSTOM_CHOICE_VALUE },
  ];

  const { dir } = await prompts({
    type: 'select',
    name: 'dir',
    message: 'Select a search method:',
    choices: dirOptions,
  });

  if (dir === CUSTOM_CHOICE_VALUE) {
    const { location } = await prompts({
      type: 'text',
      name: 'location',
      message: 'Input a custom path to search for node_modules:',
    });
    return location;
  }

  return dir;
}
