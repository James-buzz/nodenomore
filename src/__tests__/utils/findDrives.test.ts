import * as drivelist from "drivelist";
import { findALLDrives } from "../../utils/findDrives";

jest.mock("drivelist", () => ({
  list: jest.fn(),
}));

describe("findALLDrives", () => {
  it("should return an array of drive paths", async () => {
    const mockDrives = [
      { mountpoints: [{ path: "/mnt/drive1" }] },
      { mountpoints: [{ path: "/mnt/drive2" }] },
      { mountpoints: [{ path: "/mnt/drive3" }] },
    ];

    (drivelist.list as jest.Mock).mockResolvedValue(mockDrives);

    const result = await findALLDrives();

    expect(result).toEqual(["/mnt/drive1", "/mnt/drive2", "/mnt/drive3"]);
    expect(drivelist.list).toHaveBeenCalled();
  });
});
