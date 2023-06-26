import fs from "fs";

export const deleteNodeModules = async (
  nodeModules: string[],
): Promise<number> => {
  let deleted = 0;
  const deletionPromises = await nodeModules.map(async (folder) => {
    await deleteFolder(folder);
    deleted++;
  });

  await Promise.all(deletionPromises);

  return deleted;
};

export const deleteFolder = async (folder: string) => {
  try {
    await fs.promises.rm(folder, { recursive: true });
  } catch (error) {
    console.error(`Error deleting folder '${folder}': ${error}`);
  }
};
