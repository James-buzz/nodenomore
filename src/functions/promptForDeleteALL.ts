import prompts from "prompts";
import { deleteNodeModules } from "../utils/deleteNodeModules";
import colors from "colors";
import { logWithSpace } from "../utils/log";

export const promptForDeleteALL = async (nodeModules: string[]) => {
  const prompt = await prompts({
    type: "confirm",
    name: "confirmed",
    message: `Delete ${nodeModules.length} node_modules folders? Confirm?`,
    initial: false,
  });

  if (prompt.confirmed) {
    const deletedCount = await deleteNodeModules(nodeModules);
    logWithSpace(
      colors.bgGreen(`Removed ${deletedCount} node_modules folders`),
    );
  } else {
    logWithSpace(colors.black(`Deletion skipped`));
  }
};
