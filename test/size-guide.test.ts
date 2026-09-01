import { describe, expect, it } from "vitest";
import { REPLICA_SIZE_ROWS } from "@/lib/size-guide";

describe("replica size guide", () => {
  it("lists adult football replica sizes", () => {
    expect(REPLICA_SIZE_ROWS.map((row) => row.size)).toEqual(["S", "M", "L", "XL", "XXL"]);
  });
});
