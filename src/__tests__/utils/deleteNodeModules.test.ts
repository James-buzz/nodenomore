import fs from "fs/promises";
import path from "path";
import { deleteNodeModules } from "../../utils/deleteNodeModules";

describe("deleteNodeModules", () => {
  const baseDir = path.join(__dirname, "test-simulation");

  beforeAll(async () => {
    // Ensure base directory exists
    await fs.mkdir(baseDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up the base directory
    await fs.rm(baseDir, { recursive: true });
  });

  it("should delete multiple folders and return the correct count", async () => {
    // Create three random folders inside /test-simulation
    const folderNames = Array.from(
      { length: 3 },
      () => `folder_${Math.random().toString(36).substr(2, 5)}`,
    );
    const folderPaths = folderNames.map((folderName) =>
      path.join(baseDir, folderName),
    );

    // Ensure the folders are created
    await Promise.all(
      folderPaths.map((folderPath) =>
        fs.mkdir(folderPath, { recursive: true }),
      ),
    );

    // Use deleteNodeModules function to delete the folders
    const deletedCount = await deleteNodeModules(folderPaths);

    // Assert the folders are deleted
    for (const folderPath of folderPaths) {
      try {
        await fs.access(folderPath);
        // If access doesn't throw an error, it means the folder still exists which is a failure.
        throw new Error(`Folder "${folderPath}" was not deleted`);
      } catch (error) {
        // If access throws an error, it means the folder doesn't exist, which is expected.
        if (error instanceof Error) expect(error.message).toBe("ENOENT");
      }
    }

    // Assert the correct count is returned
    expect(deletedCount).toBe(3);
  });
});
