import * as drivelist from 'drivelist';

export async function findALLDrives(): Promise<string[]> {
  const drives = await drivelist.list();
  const drivePaths: string[] = [];
  drives.forEach((drive) => {
    drivePaths.push(drive.mountpoints[0].path);
  });
  return drivePaths;
}
