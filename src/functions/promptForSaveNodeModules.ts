import colors from "colors";
import fs from "fs";
import prompts from "prompts";
import { logWithSpace } from "../utils/log";

export const promptForSaveNodeModules = async (nodeModules: string[]) => {
  const prompt = await prompts({
    type: "text",
    name: "fileName",
    message: `What filename do you want for saving node_modules?`,
    initial: "found_node_modules",
  });

  const fileName = prompt.fileName || "found_node_modules";

  const fileStream = fs.createWriteStream(`${fileName}.txt`);
  nodeModules.forEach((path) => fileStream.write(`${path}\n`));
  fileStream.end();

  logWithSpace(
    colors.bgGreen(
      `${nodeModules.length} node_modules saved to ${fileName}.txt`,
    ),
  );
};
