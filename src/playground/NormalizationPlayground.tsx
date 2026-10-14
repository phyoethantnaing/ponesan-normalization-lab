import { useState } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Plus,
  Trash2,
  Scissors,
  Link2,
  CheckCircle2,
  RotateCcw,
  KeyRound,
  X,
  Info,
  ArrowRight,
  Eye,
} from "lucide-react";
import {
  attributes,
  fullRows,
  schema,
  type Level,
  type RecordRow,
} from "../data/sampleData";
import {
  dependencies,
  validateExercise,
  type PracticeTable,
  type Connection,
  type Validation,
} from "./validation";
const initial = (): PracticeTable[] => [
  {
    id: "source",
    name: "Student enrollments",
    columns: [...attributes],
    rows: fullRows.map((r) => ({ ...r })),
    pk: ["StudentID", "CourseID"],
  },
];
const projectRows = (rows: RecordRow[], columns: string[]) =>
  Array.from(
    new Map(
      rows.map((r) => {
        const row = Object.fromEntries(columns.map((c) => [c, r[c] || ""]));
        return [JSON.stringify(row), row];
      }),
    ).values(),
  );
export default function NormalizationPlayground({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [tables, setTables] = useState(initial);
  const [original, setOriginal] = useState(fullRows);
  const [level, setLevel] = useState<Level>("2NF");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [result, setResult] = useState<Validation | null>(null);
  const [source, setSource] = useState("source");
  const [selected, setSelected] = useState<string[]>([]);
  const [newName, setNewName] = useState("Students");
  const [newPK, setNewPK] = useState<string[]>([]);
  const [newColumn, setNewColumn] = useState("");
  const [columnTable, setColumnTable] = useState("source");
  const [linkFrom, setLinkFrom] = useState("");
  const [linkTo, setLinkTo] = useState("");
  const [notice, setNotice] = useState("");
  const sourceTable = tables.find((t) => t.id === source) || tables[0];
  function update(id: string, fn: (t: PracticeTable) => PracticeTable) {
    setTables((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));
    setResult(null);
    setNotice("");
  }
  function reset() {
    setTables(initial());
    setOriginal(fullRows);
    setConnections([]);
    setSource("source");
    setColumnTable("source");
    setSelected([]);
    setNewPK([]);
    setResult(null);
    setNotice("မူလ Example ကို ပြန်ထားပြီးပါပြီ။");
  }
  function split() {
    if (
      !selected.length ||
      !newPK.length ||
      newPK.some((c) => !selected.includes(c))
    ) {
      setNotice(
        "ခွဲထုတ်မယ့် Column တွေနဲ့ Table အသစ်ရဲ့ Primary Key ကို ရွေးပါ။",
      );
      return;
    }
    if (!newName.trim() || tables.some((t) => t.name === newName.trim())) {
      setNotice("Table အသစ်အတွက် မတူတဲ့ နာမည်ပေးပါ။");
      return;
    }
    const keep = sourceTable.columns.filter(
      (c) =>
        !selected.includes(c) ||
        sourceTable.pk.includes(c) ||
        newPK.includes(c),
    );
    if (keep.length === sourceTable.columns.length) {
      setNotice("Key အပြင် ရွှေ့မယ့် အချက်အလက် Column တစ်ခု ရွေးပါ။");
      return;
    }
    if (
      tables.length === 1 &&
      attributes.every((c) => sourceTable.columns.includes(c))
    )
      setOriginal(sourceTable.rows.map((r) => ({ ...r })));
    const newTable: PracticeTable = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      columns: sourceTable.columns.filter((c) => selected.includes(c)),
      rows: projectRows(
        sourceTable.rows,
        sourceTable.columns.filter((c) => selected.includes(c)),
      ),
      pk: [...newPK],
    };
    setTables((ts) => [
      ...ts.map((t) =>
        t.id === sourceTable.id
          ? { ...t, columns: keep, rows: projectRows(t.rows, keep) }
          : t,
      ),
      newTable,
    ]);
    setSelected([]);
    setNewPK([]);
    setNewName("");
    setResult(null);
    setNotice(
      `✓ ${newTable.name} ဖန်တီးပြီးပြီ။ မျှဝေထားတဲ့ Key ကို မူလ Table မှာ ထားခဲ့တယ်။ Foreign Key နဲ့ ဆက်ပေးပါ။`,
    );
  }
  function addColumn() {
    const name = newColumn.trim();
    const target = tables.find((t) => t.id === columnTable) || tables[0];
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
      setNotice("Column နာမည်ကို English စာလုံးနဲ့ စရေးပါ။ ဥပမာ: Age");
      return;
    }
    if (target.columns.includes(name)) {
      setNotice("ဒီ Column ရှိပြီးသားပါ။");
      return;
    }
    if (target.columns.length >= 10) {
      setNotice("Table တစ်ခုမှာ Column ၁၀ ခုအထိ ထည့်နိုင်ပါတယ်။");
      return;
    }
    update(target.id, (t) => ({
      ...t,
      columns: [...t.columns, name],
      rows: t.rows.map((r) => ({ ...r, [name]: "" })),
    }));
    setNewColumn("");
  }
  function connect() {
    if (!linkFrom || !linkTo) {
      setNotice("ဆက်မယ့် Column နှစ်ခုကို ရွေးပါ။");
      return;
    }
    const [from, column] = linkFrom.split("::"),
      [to, target] = linkTo.split("::");
    if (from === to) {
      setNotice("ဒီ exercise မှာ မတူတဲ့ Table နှစ်ခုကို ဆက်ပါ။");
      return;
    }
    if (
      connections.some(
        (c) =>
          c.from === from &&
          c.column === column &&
          c.to === to &&
          c.target === target,
      )
    ) {
      setNotice("ဒီ Connection ရှိပြီးသားပါ။");
      return;
    }
    setConnections((cs) => [...cs, { from, column, to, target }]);
    setResult(null);
    setNotice(
      "Connection ထည့်ပြီးပါပြီ။ အဖြေစစ်ပြီး ID တွေ ကိုက်မကိုက် ကြည့်ပါ။",
    );
  }
  function solution() {
    const models = schema(level === "UNF" || level === "1NF" ? "1NF" : level);
    const next = models.map((m) => ({
      id: m.name,
      name: m.name,
      columns: m.columns,
      rows: projectRows(m.rows, m.columns),
      pk: m.pk,
    }));
    const links: Connection[] = models.flatMap((m) =>
      Object.entries(m.fk || {}).map(([column, v]) => ({
        from: m.name,
        column,
        to: v.split(".")[0],
        target: v.split(".")[1],
      })),
    );
    setTables(next);
    setOriginal(fullRows);
    setConnections(links);
    setSource(next[0].id);
    setColumnTable(next[0].id);
    setSelected([]);
    setNewPK([]);
    setResult(null);
    setNotice(
      `${level === "UNF" ? "1NF" : level} ရဲ့ ဖြေရှင်းပုံပါ။ Dependency တွေနဲ့ ဘာကြောင့် ဒီလိုခွဲရလဲ ကြည့်ပါ။`,
    );
  }
  function check() {
    const baseline =
      tables.length === 1 &&
      attributes.every((c) => tables[0].columns.includes(c))
        ? tables[0].rows
        : original;
    const r = validateExercise(tables, level, connections, baseline);
    setResult(r);
    if (r.ok && level !== "UNF") onComplete();
  }
  return (
    <div className="playground">
      <div className="page-heading">
        <div className="eyebrow">
          <FlaskConical size={14} /> YOUR LITTLE DATABASE LAB
        </div>
        <h1>ကိုယ်တိုင် စီကြည့်မယ်</h1>
        <p>အကွက်တွေ ပြင်ပါ။ Table ခွဲပါ။ Key တွေနဲ့ ပြန်ဆက်ပါ။</p>
      </div>
      <div className="exercise-rules card">
        <div className="eyebrow">
          <Info size={14} /> OUR EXERCISE RULES
        </div>
        <p>
          ကျောင်းသားတစ်ယောက်က ဘာသာရပ်တစ်ခုကို တစ်ကြိမ်ပဲ စာရင်းသွင်းတယ်။ Grade က
          အဲဒီ ကျောင်းသား–ဘာသာရပ် အတွဲရဲ့ အမှတ်ပါ။
        </p>
        <div className="fd-chips">
          {dependencies.map((fd) => (
            <span key={fd.left.join()}>
              {fd.left.join(" + ")} <ArrowRight size={12} />{" "}
              {fd.right.join(", ")}
            </span>
          ))}
        </div>
        <p className="small muted">
          အထက်က Functional Dependency (အချက်တစ်ခု သိရင် နောက်အချက်ကို သေချာသိတဲ့
          စည်းမျဉ်း) တွေနဲ့ စစ်ပါတယ်။ ID တူလို့ အချက်အလက်တူရမယ်လို့
          သတ်မှတ်ထားတာပါ။
        </p>
      </div>
      <div className="playground-toolbar">
        <label>
          ရည်မှန်းချက်{" "}
          <select
            aria-label="Target normalization level"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as Level);
              setResult(null);
            }}
          >
            {["UNF", "1NF", "2NF", "3NF"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <button className="text-button" onClick={solution}>
          <Eye size={15} /> ဖြေရှင်းပုံကြည့်မယ်
        </button>
        <button className="secondary-button" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
        <button className="primary-button" onClick={check}>
          <CheckCircle2 size={16} /> အဖြေစစ်မယ်
        </button>
      </div>
      <div className="editable-tables">
        {tables.map((t) => (
          <motion.section layout key={t.id} className="editable-table card">
            <div className="editable-table-heading">
              <input
                aria-label={`Rename ${t.name}`}
                value={t.name}
                onChange={(e) =>
                  update(t.id, (x) => ({ ...x, name: e.target.value }))
                }
              />
              <span>{t.rows.length} rows</span>
              <button
                className="icon-button danger"
                aria-label={`Delete table ${t.name}`}
                disabled={tables.length === 1}
                onClick={() => {
                  setTables((ts) => ts.filter((x) => x.id !== t.id));
                  setConnections((cs) =>
                    cs.filter((c) => c.from !== t.id && c.to !== t.id),
                  );
                  setResult(null);
                  setSelected([]);
                  setNewPK([]);
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {t.columns.map((c) => (
                      <th key={c}>
                        <div className="editable-column">
                          <label
                            className={t.pk.includes(c) ? "key-selected" : ""}
                          >
                            <input
                              type="checkbox"
                              aria-label={`${t.name} Primary Key ${c}`}
                              checked={t.pk.includes(c)}
                              onChange={() =>
                                update(t.id, (x) => ({
                                  ...x,
                                  pk: x.pk.includes(c)
                                    ? x.pk.filter((k) => k !== c)
                                    : [...x.pk, c],
                                }))
                              }
                            />
                            <KeyRound size={11} />
                            {c}
                          </label>
                          <button
                            aria-label={`Remove ${c} from ${t.name}`}
                            disabled={t.columns.length === 1}
                            onClick={() => {
                              update(t.id, (x) => ({
                                ...x,
                                columns: x.columns.filter((v) => v !== c),
                                pk: x.pk.filter((v) => v !== c),
                                rows: x.rows.map((r) =>
                                  Object.fromEntries(
                                    Object.entries(r).filter(([k]) => k !== c),
                                  ),
                                ),
                              }));
                              setConnections((cs) =>
                                cs.filter(
                                  (l) =>
                                    !(l.from === t.id && l.column === c) &&
                                    !(l.to === t.id && l.target === c),
                                ),
                              );
                              setSelected([]);
                              setNewPK([]);
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th>
                      <span className="sr-only">Delete row</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, ri) => (
                    <tr key={ri}>
                      {t.columns.map((c) => (
                        <td
                          key={c}
                          className={t.pk.includes(c) ? "key-col" : ""}
                        >
                          <input
                            aria-label={`${t.name} row ${ri + 1} ${c}`}
                            value={r[c] || ""}
                            onChange={(e) =>
                              update(t.id, (x) => ({
                                ...x,
                                rows: x.rows.map((v, i) =>
                                  i === ri ? { ...v, [c]: e.target.value } : v,
                                ),
                              }))
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          aria-label={`Delete row ${ri + 1} from ${t.name}`}
                          onClick={() =>
                            update(t.id, (x) => ({
                              ...x,
                              rows: x.rows.filter((_, i) => i !== ri),
                            }))
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!t.rows.length && (
              <p className="empty-state">
                စာရင်းအလွတ်ပါ။ Row ထည့်ပြီး စမ်းကြည့်ပါ။
              </p>
            )}
            <div className="editable-table-footer">
              <span>
                <KeyRound size={12} />{" "}
                {t.pk.length ? t.pk.join(" + ") : "Primary Key ရွေးပါ"}
              </span>
              <button
                className="text-button"
                onClick={() =>
                  update(t.id, (x) => ({
                    ...x,
                    rows: [
                      ...x.rows,
                      Object.fromEntries(x.columns.map((c) => [c, ""])),
                    ],
                  }))
                }
              >
                <Plus size={14} /> Add row
              </button>
            </div>
          </motion.section>
        ))}
      </div>
      <div className="practice-tools">
        <section className="card tool-card">
          <div className="tool-title">
            <Scissors size={18} />
            <h3>Table ခွဲမယ်</h3>
          </div>
          <label>
            မူလ Table
            <select
              aria-label="Table to split"
              value={sourceTable.id}
              onChange={(e) => {
                setSource(e.target.value);
                setSelected([]);
                setNewPK([]);
              }}
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <p className="small muted">
            ရွှေ့မယ့် Column တွေ ရွေးပါ။ Table အသစ်ရဲ့ Key ကို မူလ Table မှာ
            ချန်ထားမယ်။
          </p>
          <div className="column-picker">
            {sourceTable.columns.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={selected.includes(c)}
                  onChange={() => {
                    setSelected((s) =>
                      s.includes(c) ? s.filter((x) => x !== c) : [...s, c],
                    );
                    setNewPK((p) => p.filter((x) => x !== c));
                  }}
                />
                {c}
              </label>
            ))}
          </div>
          <label>
            Table အသစ် နာမည်
            <input
              aria-label="New table name"
              placeholder="ဥပမာ: Students"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <div className="small muted">Table အသစ်ရဲ့ Primary Key</div>
          <div className="column-picker">
            {selected.length ? (
              selected.map((c) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={newPK.includes(c)}
                    onChange={() =>
                      setNewPK((p) =>
                        p.includes(c) ? p.filter((x) => x !== c) : [...p, c],
                      )
                    }
                  />
                  <KeyRound size={12} />
                  {c}
                </label>
              ))
            ) : (
              <span className="small muted">Column အရင်ရွေးပါ။</span>
            )}
          </div>
          <button className="primary-button" onClick={split}>
            <Scissors size={14} /> ရွေးထားတာတွေ ခွဲမယ်
          </button>
        </section>
        <section className="card tool-card">
          <div className="tool-title">
            <Link2 size={18} />
            <h3>ဆက်နွယ်မှု တည်ဆောက်မယ်</h3>
          </div>
          <label>
            Foreign Key
            <select
              aria-label="Foreign Key source"
              value={linkFrom}
              onChange={(e) => setLinkFrom(e.target.value)}
            >
              <option value="">Column ရွေးပါ</option>
              {tables.flatMap((t) =>
                t.columns.map((c) => (
                  <option key={`${t.id}-${c}`} value={`${t.id}::${c}`}>
                    {t.name}.{c}
                  </option>
                )),
              )}
            </select>
          </label>
          <label>
            Primary Key ကို ညွှန်းမယ်
            <select
              aria-label="Referenced Primary Key"
              value={linkTo}
              onChange={(e) => setLinkTo(e.target.value)}
            >
              <option value="">Key ရွေးပါ</option>
              {tables.flatMap((t) =>
                t.pk.map((c) => (
                  <option key={`${t.id}-${c}`} value={`${t.id}::${c}`}>
                    {t.name}.{c}
                  </option>
                )),
              )}
            </select>
          </label>
          <button className="secondary-button" onClick={connect}>
            <Link2 size={14} /> Connect tables
          </button>
          <div className="practice-connections">
            {connections.length ? (
              connections.map((c, i) => (
                <div key={`${c.from}-${c.column}-${i}`}>
                  <span>
                    {tables.find((t) => t.id === c.from)?.name}.{c.column} →{" "}
                    {tables.find((t) => t.id === c.to)?.name}.{c.target}
                  </span>
                  <button
                    aria-label={`Remove connection ${i + 1}`}
                    onClick={() => {
                      setConnections((cs) => cs.filter((_, n) => i !== n));
                      setResult(null);
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))
            ) : (
              <p className="muted small">
                Connection မရှိသေးပါ။ Table ခွဲပြီး ID တွေနဲ့ ဆက်ကြည့်ပါ။
              </p>
            )}
          </div>
          <div className="add-column-form">
            <h4>
              <Plus size={14} /> Column ထည့်မယ်
            </h4>
            <select
              aria-label="Add column to table"
              value={
                tables.some((t) => t.id === columnTable)
                  ? columnTable
                  : tables[0].id
              }
              onChange={(e) => setColumnTable(e.target.value)}
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div>
              <input
                aria-label="New column name"
                placeholder="Column name"
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
              />
              <button
                className="secondary-button"
                onClick={addColumn}
                aria-label="Add column"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
      {notice && (
        <div className="notice" role="status">
          <Info size={16} />
          {notice}
        </div>
      )}
      {result && (
        <div
          className={`validation-result ${result.ok ? "success" : result.unknown ? "unknown" : "retry"}`}
          role="status"
        >
          <h3>
            {result.ok
              ? "✓ အရမ်းကောင်းတယ်။"
              : result.unknown
                ? "အချက်အလက် ထပ်လိုပါတယ်။"
                : "ဖြည်းဖြည်း ပြန်စီကြည့်မယ်။"}
          </h3>
          <ul>
            {result.messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
