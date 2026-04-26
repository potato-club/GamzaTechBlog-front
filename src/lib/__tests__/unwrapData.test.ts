import { unwrapData } from "@/lib/unwrapData";

describe("unwrapData", () => {
  it("response.data가 있으면 data를 반환해야 함", () => {
    const data = { id: 1 };

    expect(unwrapData({ data })).toBe(data);
  });

  it("response.data가 null이면 예외를 던져야 함", () => {
    expect(() => unwrapData({ data: null })).toThrow("Response data is missing.");
  });

  it("response.data가 undefined이면 예외를 던져야 함", () => {
    expect(() => unwrapData({})).toThrow("Response data is missing.");
  });
});
