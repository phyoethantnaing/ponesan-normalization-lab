import { describe, it, expect } from "vitest";
import { schema, fullRows, attributes } from "../data/sampleData";
import {
  closure,
  candidateKeys,
  checkTable,
  validateExercise,
  losslessDecomposition,
  naturalJoin,
  type PracticeTable,
  type Connection,
} from "./validation";
const tables = (level: "1NF" | "2NF" | "3NF"): PracticeTable[] =>
  schema(level).map((m) => ({
    ...m,
    id: m.name,
    rows: m.rows.map((r) =>
      Object.fromEntries(m.columns.map((c) => [c, r[c]])),
    ),
  }));
const connections = (level: "2NF" | "3NF"): Connection[] =>
  schema(level).flatMap((m) =>
    Object.entries(m.fk || {}).map(([column, target]) => ({
      from: m.name,
      column,
      to: target.split(".")[0],
      target: target.split(".")[1],
    })),
  );
describe("normalization rules and example accuracy", () => {
  it("computes transitive attribute closure", () => {
    expect(closure(["StudentID"])).toEqual(
      new Set(["StudentID", "StudentName", "DepartmentID", "DepartmentName"]),
    );
  });
  it("finds the composite enrollment candidate key from FDs", () => {
    expect(candidateKeys(attributes)).toEqual([["StudentID", "CourseID"]]);
  });
  it("accepts repeated student names in 1NF", () => {
    expect(checkTable(tables("1NF")[0], "1NF").ok).toBe(true);
  });
  it("rejects multi-valued cells for 1NF", () => {
    const t = tables("1NF")[0];
    t.rows[0].CourseName = "Math, English";
    expect(checkTable(t, "1NF").ok).toBe(false);
  });
  it("rejects StudentID as the enrollment Primary Key", () => {
    const t = tables("1NF")[0];
    t.pk = ["StudentID"];
    expect(checkTable(t, "1NF").ok).toBe(false);
  });
  it("asks for a minimal Candidate Key when extra columns are selected", () => {
    const t = tables("1NF")[0];
    t.pk = ["StudentID", "CourseID", "StudentName"];
    const result = checkTable(t, "1NF");
    expect(result.ok).toBe(false);
    expect(result.messages.join()).toContain("Candidate Key");
  });
  it("detects partial dependencies in the combined relation", () => {
    const r = checkTable(tables("1NF")[0], "2NF");
    expect(r.ok).toBe(false);
    expect(r.messages.join()).toContain("Partial Dependency");
  });
  it("accepts the 2NF decomposition including its transitive student relation", () => {
    expect(
      validateExercise(tables("2NF"), "2NF", connections("2NF"), fullRows).ok,
    ).toBe(true);
  });
  it("rejects the 2NF Students relation for 3NF", () => {
    expect(checkTable(tables("2NF")[0], "3NF").ok).toBe(false);
  });
  it("accepts all final 3NF relations and connections", () => {
    expect(
      validateExercise(tables("3NF"), "3NF", connections("3NF"), fullRows).ok,
    ).toBe(true);
  });
  it("proves lossless decomposition using the FD chase", () => {
    expect(losslessDecomposition(tables("2NF"))).toBe(true);
    expect(losslessDecomposition(tables("3NF"))).toBe(true);
  });
  it("reconstructs every original enrollment with a natural join", () => {
    const result = naturalJoin(tables("3NF"))!;
    expect(result).toHaveLength(fullRows.length);
    const serial = (r: Record<string, string>) =>
      JSON.stringify(attributes.map((a) => r[a]));
    expect(new Set(result.map(serial))).toEqual(new Set(fullRows.map(serial)));
  });
  it("rejects deletion disguised as normalization", () => {
    const t = tables("3NF");
    t[0].columns = t[0].columns.filter((c) => c !== "StudentName");
    expect(
      validateExercise(t, "3NF", connections("3NF"), fullRows).messages.join(),
    ).toContain("StudentName");
  });
  it("checks data against dependencies rather than duplicate counts", () => {
    const t = tables("1NF")[0];
    t.rows[1].StudentName = "Someone else";
    expect(checkTable(t, "1NF").ok).toBe(false);
  });
  it("does not claim a custom column is normalized without dependency information", () => {
    const t = tables("1NF")[0];
    t.columns.push("Age");
    const r = checkTable(t, "3NF");
    expect(r.ok).toBe(false);
    expect(r.unknown).toBe(true);
  });
  it("rejects missing Foreign Key connections", () => {
    expect(validateExercise(tables("3NF"), "3NF", [], fullRows).ok).toBe(false);
  });
  it("detects missing or spurious joined data", () => {
    const t = tables("3NF");
    t.find((x) => x.name === "Enrollments")!.rows.pop();
    expect(validateExercise(t, "3NF", connections("3NF"), fullRows).ok).toBe(
      false,
    );
  });
  it("rejects a structurally lossy decomposition", () => {
    const bad = [
      {
        id: "a",
        name: "a",
        columns: ["StudentName"],
        pk: ["StudentName"],
        rows: [],
      },
      {
        id: "b",
        name: "b",
        columns: attributes.filter((a) => a !== "StudentName"),
        pk: ["StudentID", "CourseID"],
        rows: [],
      },
    ];
    expect(losslessDecomposition(bad)).toBe(false);
  });
});
