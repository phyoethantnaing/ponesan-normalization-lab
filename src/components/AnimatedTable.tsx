import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  KeyRound,
  Link2,
  Table2,
  AlertCircle,
  X,
  MousePointer2,
} from "lucide-react";
import { courses, glossary, type TableModel } from "../data/sampleData";

export function tokenId(
  row: Record<string, string>,
  column: string,
  seen: Set<string>,
) {
  const root = column.startsWith("Student")
    ? row.StudentID
    : column.startsWith("Course")
      ? row.CourseID
      : column.startsWith("Department")
        ? row.DepartmentID
        : `${row.StudentID}-${row.CourseID}`;
  const base = `${column}-${root}`;
  let id = base;
  let n = 1;
  while (seen.has(id)) id = `${base}-${n++}`;
  seen.add(id);
  return id;
}
function cellPieces(row: Record<string, string>, column: string) {
  return column === "Courses"
    ? row[column]
        .split(", ")
        .map((name) => ({
          value: name,
          column: "CourseName",
          row: {
            ...row,
            CourseID:
              courses.find((x) => x.CourseName === name)?.CourseID || name,
          },
        }))
    : [{ value: row[column], column, row }];
}
export function tableTokenIds(model: TableModel, seen = new Set<string>()) {
  const ids: Record<string, string> = {};
  model.rows.forEach((row, ri) =>
    model.columns.forEach((c) =>
      cellPieces(row, c).forEach((p, pi) => {
        ids[`${ri}-${c}-${pi}`] = tokenId(p.row, p.column, seen);
      }),
    ),
  );
  return ids;
}
export function AnimatedTable({
  model,
  highlight,
  sceneId = "scene",
  tokenIds,
  compact = false,
  speed = 1,
  onCell,
}: {
  model: TableModel;
  highlight?: string;
  sceneId?: string;
  tokenIds?: Record<string, string>;
  compact?: boolean;
  speed?: number;
  onCell?: (row: number, column: string) => void;
}) {
  const [selected, setSelected] = useState<{
    value: string;
    column: string;
  } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const ids = tokenIds || tableTokenIds(model);
  return (
    <motion.section
      layout
      className={`table-card ${model.tone || ""} ${compact ? "compact" : ""}`}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="table-title">
        <span>
          <Table2 size={15} />
          {model.name}
        </span>
        <span className="table-count">{model.rows.length} rows</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {model.columns.map((c) => (
                <th
                  key={c}
                  title={`${c} — Column ဆိုတာ ဒေါင်လိုက် အကွက်တန်းပါ။ ${model.pk.includes(c) ? "Primary Key: Row ကို ရှာတဲ့ အမှတ်အသား။ " : ""}${model.fk?.[c] ? `Foreign Key: ${model.fk[c]} ကို ညွှန်းတဲ့ ID။` : ""}`}
                  className={`${model.pk.includes(c) ? "key-col" : ""} ${model.fk?.[c] ? "foreign-col" : ""} ${hover === c ? "column-hover" : ""}`}
                  onMouseEnter={() => setHover(c)}
                  onMouseLeave={() => setHover(null)}
                >
                  <span>
                    {model.pk.includes(c) && <KeyRound size={12} />}{" "}
                    {model.fk?.[c] && <Link2 size={12} />} {c}
                  </span>
                  {model.pk.includes(c) && (
                    <small>PK{model.pk.length > 1 ? " · composite" : ""}</small>
                  )}
                  {model.fk?.[c] && (
                    <small title={model.fk[c]}>
                      FK → {model.fk[c].split(".")[0]}
                    </small>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row, ri) => (
              <motion.tr
                layout
                key={`${row.StudentID || row.DepartmentID || row.CourseID}-${row.CourseID || ri}`}
                className={
                  highlight === "row" && ri === 0 ? "row-highlight" : ""
                }
              >
                {model.columns.map((c) => {
                  const problem =
                    highlight === "problem" &&
                    (c === "Courses" ||
                      c === "StudentName" ||
                      c === "CourseName" ||
                      c === "DepartmentName");
                  const active =
                    (highlight === "column" && c === "StudentName") ||
                    (highlight === "dependency" &&
                      ["StudentName", "CourseName", "DepartmentName"].includes(
                        c,
                      )) ||
                    (highlight === "transitive" &&
                      ["DepartmentID", "DepartmentName"].includes(c));
                  const pieces = cellPieces(row, c);
                  return (
                    <td
                      key={c}
                      className={`${model.pk.includes(c) ? "key-col" : ""} ${problem ? "problem-cell" : ""} ${active ? "dependency-cell" : ""} ${highlight === "correct" ? "correct-cell" : ""} ${hover === c ? "column-hover" : ""}`}
                    >
                      <button
                        className="cell-button"
                        title={`${c}: ${row[c]}. ${model.fk?.[c] ? `Foreign Key → ${model.fk[c]}` : model.pk.includes(c) ? "Primary Key — Row ကို ရှာတဲ့ အမှတ်အသား" : "အကြောင်းကို နှိပ်ကြည့်ပါ"}`}
                        onClick={() => {
                          setSelected({ value: row[c], column: c });
                          onCell?.(ri, c);
                        }}
                      >
                        {problem && (
                          <AlertCircle size={12} aria-label="ပြဿနာ" />
                        )}
                        {pieces.map((p, pi) => (
                          <motion.span
                            layoutId={`${sceneId}-${ids[`${ri}-${c}-${pi}`]}`}
                            transition={{
                              type: reduced ? "tween" : "spring",
                              stiffness: 100 * speed * speed,
                              damping: 21 * speed,
                              duration: reduced ? 0 : undefined,
                            }}
                            key={`${p.value}-${pi}`}
                            className={c === "Courses" ? "value-chip" : ""}
                          >
                            {p.value || "—"}
                          </motion.span>
                        ))}
                      </button>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {model.rows.length === 0 && (
        <p className="empty-state">Row မရှိသေးပါ။ အချက်အလက် ထည့်ကြည့်ပါ။</p>
      )}
      {selected && (
        <div className="cell-explanation" role="status">
          <MousePointer2 size={14} />
          <div>
            <strong>
              {selected.column}: {selected.value}
            </strong>
            <p>
              {selected.column === "Courses"
                ? "ဒီတစ်ကွက်ထဲမှာ ဘာသာရပ် အများကြီး ပါနေတယ်။ Row ခွဲဖို့ လိုတယ်။"
                : model.fk?.[selected.column]
                  ? `Foreign Key — ${model.fk[selected.column]} ကို ညွှန်းထားတဲ့ အမှတ်အသားပါ။`
                  : model.pk.includes(selected.column)
                    ? `Primary Key — ${model.pk.length > 1 ? model.pk.join(" + ") + " ပေါင်းပြီး" : "ဒီ ID နဲ့"} Row ကို ခွဲခြားနိုင်တယ်။`
                    : `ဒီ Column က ${selected.column} အချက်အလက်ကို သိမ်းထားတယ်။ ${glossary.find((x) => x[0] === "Column")?.[1]}`}
            </p>
          </div>
          <button
            aria-label="အကြောင်းပြချက် ပိတ်မယ်"
            onClick={() => setSelected(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </motion.section>
  );
}
export function TableLegend() {
  return (
    <div className="table-legend">
      <span>
        <i className="blue-dot" />
        <KeyRound size={11} /> PK / FK
      </span>
      <span>
        <i className="red-dot" />⚠ ပြဿနာ
      </span>
      <span>
        <i className="yellow-dot" />↗ Dependency
      </span>
      <span>
        <i className="green-dot" />✓ စီပြီး
      </span>
    </div>
  );
}
