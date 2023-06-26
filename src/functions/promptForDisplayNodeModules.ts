import colors from 'colors';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { logWithSpace } from '../utils/log';

export const promptForDisplayNodeModules = async (nodeModules: string[]) => {
  if (nodeModules.length > 50) {
    logWithSpace(
      colors.bgWhite(
        'Suggestion: Consider saving node_modules to a text file since over 50 folders were found',
      ),
    );
  }

  const prompt = await prompts({
    type: 'number',
    name: 'howMany',
    message: 'How many results do you want to display?',
  });
  const showHowMany = prompt.howMany;
  const selectedNodeModules = nodeModules.slice(0, showHowMany);

  const maxLocationLength = Math.max(
    ...selectedNodeModules.map(
      (folder) => path.join('node_modules', folder).length,
    ),
    8, // Minimum length of the "Location" header
  );

  const headerLocation = 'Location'.padEnd(maxLocationLength);
  const headerSize = 'Size (GB)';
  const divider = '-'.repeat(maxLocationLength) + ' | ------------';

  let totalSize = 0;

  console.log();
  console.log(`${headerLocation} | ${headerSize}`);
  console.log(divider);

  for (const folder of selectedNodeModules) {
    const folderPath = path.join(folder);
    const size = calculateFolderSize(folderPath);
    const sizeInGB = (size / (1024 * 1024 * 1024)).toFixed(2);
    console.log(`${folderPath.padEnd(maxLocationLength)} | ${sizeInGB}`);
    totalSize += Number(sizeInGB);
  }

  console.log();

  logWithSpace(`Total: ${totalSize} GB`);
};

const calculateFolderSize = (folderPath: string): number => {
  const files = fs.readdirSync(folderPath);
  let size = 0;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    size += stats.isDirectory() ? calculateFolderSize(filePath) : stats.size;
  }

  return size;
};
