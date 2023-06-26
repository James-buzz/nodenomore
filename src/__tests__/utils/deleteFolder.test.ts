import fs from "fs/promises";
import path from "path";
import { deleteFolder } from "../../utils/deleteNodeModules";

describe("deleteFolder", () => {
  const baseDir = path.join(__dirname, "test-simulation");

  beforeAll(async () => {
    // Ensure base directory exists
    await fs.mkdir(baseDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up the base directory
    await fs.rm(baseDir, { recursive: true });
  });

  it("should delete a folder if it exists", async () => {
    // Create a random folder inside /test-simulation
    const folderName = `folder_${Math.random().toString(36).substr(2, 5)}`;
    const folderPath = path.join(baseDir, folderName);

    // Ensure the folder is created
    await fs.mkdir(folderPath, { recursive: true });

    // Use deleteFolder function to delete the folder
    await deleteFolder(folderPath);

    // Assert the folder is gone
    try {
      await fs.access(folderPath);
      // If access doesn't throw an error, it means the folder still exists which is a failure.
      throw new Error(`Folder "${folderPath}" was not deleted`);
    } catch (error) {
      // If access throws an error, it means the folder doesn't exist, which is expected.
      if (error instanceof Error) expect(error.message).toBe("ENOENT");
    }
  });
});
