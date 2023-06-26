import colors from "colors";
import { findNodeModules } from "../utils/findNodeModules";
import loading from "loading-cli";

export async function searchForNodeModules(
  fileLocation: string,
  ignoreSystem: boolean,
): Promise<string[]> {
  /* Start node_modules search */
  const load = loading(`Looking for node_modules in ${fileLocation}`).start();
  const nodeModules = await findNodeModules(fileLocation, ignoreSystem);
  load.stop();

  console.log();
  console.log(colors.green(`Found ${nodeModules.length} node_modules folders`));
  console.log();

  return nodeModules;
}
