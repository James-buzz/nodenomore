import * as fs from "fs";
import * as path from "path";

export async function findNodeModules(
  dir: string,
  ignoreSystemFolders: boolean,
): Promise<string[]> {
  let result: string[] = [];
  try {
    const files = await fs.promises.readdir(dir);

    // List of directories to ignore
    const ignoreDirsWindows = [
      "Program Files",
      "Program Files (x86)",
      "ProgramData",
      ".vscode",
      "AppData",
      "OneDrive",
    ];
    const ignoreDirsMacOS = [
      "/Applications",
      "/Library",
      "/System",
      "/Users/*/Library",
    ];
    const ignoreDirsLinux = [
      "/bin",
      "/etc",
      "/lib",
      "/opt",
      "/sbin",
      "/usr",
      "/var",
    ];
    const ignoreDirs = [
      ...ignoreDirsWindows,
      ...ignoreDirsMacOS,
      ...ignoreDirsLinux,
    ];

    for (const file of files) {
      try {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.lstat(filePath);

        if (stat.isDirectory()) {
          if (file === "node_modules") {
            result.push(filePath);
          } else {
            // Check if directory is one of the directories to be ignored
            const isIgnored = ignoreSystemFolders
              ? ignoreDirs.some(
                  (ignoreDir) =>
                    filePath.startsWith(ignoreDir) ||
                    filePath.includes(path.join(ignoreDir, path.sep)),
                )
              : false;

            if (!isIgnored) {
              result = result.concat(
                await findNodeModules(filePath, ignoreSystemFolders),
              );
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && !isIgnoreErrorMessage(err.message)) {
          console.error(`Error processing file: ${err.message}`);
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && !isIgnoreErrorMessage(err.message)) {
      console.error(`Error processing directory: ${err.message}`);
    }
  }

  return result;
}

export const isIgnoreErrorMessage = (message: string) =>
  message.startsWith("EPERM") ||
  message.startsWith("EBUSY") ||
  message.startsWith("EACCES");
