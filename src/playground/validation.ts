import { attributes, type RecordRow, type Level } from "../data/sampleData";
export interface FD {
  left: string[];
  right: string[];
}
export interface PracticeTable {
  id: string;
  name: string;
  columns: string[];
  rows: RecordRow[];
  pk: string[];
}
export interface Connection {
  from: string;
  column: string;
  to: string;
  target: string;
}
export interface Validation {
  ok: boolean;
  unknown?: boolean;
  messages: string[];
}
export const dependencies: FD[] = [
  { left: ["StudentID"], right: ["StudentName", "DepartmentID"] },
  { left: ["DepartmentID"], right: ["DepartmentName"] },
  { left: ["CourseID"], right: ["CourseName"] },
  { left: ["StudentID", "CourseID"], right: ["Grade"] },
];
export function closure(seed: string[], fds: FD[] = dependencies): Set<string> {
  const result = new Set(seed);
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of fds)
      if (fd.left.every((x) => result.has(x)))
        for (const x of fd.right)
          if (!result.has(x)) {
            result.add(x);
            changed = true;
          }
  }
  return result;
}
function subsets(items: string[]): string[][] {
  return Array.from({ length: 2 ** items.length }, (_, mask) =>
    items.filter((_, i) => mask & (1 << i)),
  ).sort((a, b) => a.length - b.length);
}
export function candidateKeys(
  columns: string[],
  fds = dependencies,
): string[][] {
  const keys: string[][] = [];
  for (const subset of subsets(columns)) {
    if (keys.some((k) => k.every((x) => subset.includes(x)))) continue;
    const result = closure(subset, fds);
    if (columns.every((x) => result.has(x))) keys.push(subset);
  }
  return keys;
}
export function projectFDs(columns: string[], fds = dependencies): FD[] {
  const result: FD[] = [];
  for (const left of subsets(columns)) {
    const found = closure(left, fds);
    const right = columns.filter((x) => !left.includes(x) && found.has(x));
    if (right.length) result.push({ left, right });
  }
  return result;
}
export function checkTable(t: PracticeTable, level: Level): Validation {
  const messages: string[] = [];
  if (t.columns.length === 0)
    return {
      ok: false,
      messages: [`${t.name}: Column အနည်းဆုံး တစ်ခုလိုတယ်။`],
    };
  if (t.columns.length > 10)
    return {
      ok: false,
      unknown: true,
      messages: [
        "ဒီစမ်းသပ်ခန်းမှာ Table တစ်ခုကို Column ၁၀ ခုအထိပဲ စစ်နိုင်တယ်။",
      ],
    };
  if (!t.rows.length)
    return {
      ok: false,
      unknown: true,
      messages: [
        `${t.name}: Row မရှိလို့ Key နဲ့ Data ကို စစ်ဖို့ အချက်အလက် မလုံလောက်ပါ။`,
      ],
    };
  if (level === "UNF")
    return {
      ok: true,
      messages: [
        `${t.name}: UNF က မူလပုံစံပါ။ Normalization ပြီးပြီလို့ မဆိုလိုပါ။`,
      ],
    };
  for (const col of t.columns)
    if (t.rows.some((r) => /[,;\n/|]/.test(r[col] || "")))
      messages.push(
        `${t.name}.${col}: ⚠ ဒီ Column မှာ အချက်အလက် အများကြီး တစ်ကွက်ထဲ ပါနေတယ်။ 1NF အတွက် တစ်ကွက်မှာ အချက်တစ်ခု ထားပါ။`,
      );
  if (t.columns.some((c) => /^Course\d+$/.test(c)))
    messages.push(
      `${t.name}: Course1, Course2 လို Repeating group တွေကို Row ခွဲပါ။`,
    );
  if (!t.pk.length || t.pk.some((c) => !t.columns.includes(c)))
    messages.push(`${t.name}: Primary Key ရွေးပေးပါ။`);
  else {
    if (t.rows.some((r) => t.pk.some((c) => !r[c]?.trim())))
      messages.push(`${t.name}: Primary Key အကွက်ကို အလွတ်မထားရပါ။`);
    const values = t.rows.map((r) => JSON.stringify(t.pk.map((c) => r[c])));
    if (new Set(values).size !== values.length)
      messages.push(
        `${t.name}: ရွေးထားတဲ့ Primary Key က ထပ်နေတယ်။ StudentID + CourseID နှစ်ခုလုံး လိုနိုင်တယ်။`,
      );
    const pkClosure = closure(t.pk);
    if (!t.columns.every((c) => pkClosure.has(c)))
      messages.push(
        `${t.name}: ပေးထားတဲ့ Dependency စည်းမျဉ်းအရ ဒီ Key နဲ့ Row ရဲ့ အချက်အားလုံးကို မသတ်မှတ်နိုင်ပါ။`,
      );
  }
  const unknown = t.columns.filter((c) => !attributes.includes(c));
  if (unknown.length)
    return {
      ok: false,
      unknown: true,
      messages: [
        ...messages,
        `${unknown.join(", ")} အတွက် Functional Dependency မပေးထားလို့ ${level} ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ အချက်အလက် မလုံလောက်ပါ။`,
      ],
    };
  const keys = candidateKeys(t.columns);
  if (
    t.pk.length &&
    t.columns.every((c) => closure(t.pk).has(c)) &&
    !keys.some((k) => k.length === t.pk.length && k.every((c) => t.pk.includes(c)))
  )
    messages.push(
      `${t.name}: ဒီ exercise မှာ Primary Key အတွက် အနည်းဆုံး Candidate Key ကို ရွေးပါ။ မလိုအပ်တဲ့ Column အပိုတွေ ပါနေတယ်။`,
    );
  const projected = projectFDs(t.columns);
  for (const fd of projected) {
    const observed = new Map<string, string>();
    for (const row of t.rows) {
      const key = JSON.stringify(fd.left.map((c) => row[c]));
      const val = JSON.stringify(fd.right.map((c) => row[c]));
      if (observed.has(key) && observed.get(key) !== val) {
        messages.push(
          `${t.name}: ${fd.left.join(" + ")} → ${fd.right.join(", ")} စည်းမျဉ်းနဲ့ Data မကိုက်ပါ။ ID တူပေမဲ့ မူတည်တဲ့ အချက်တွေ မတူနေတယ်။`,
        );
        break;
      }
      observed.set(key, val);
    }
  }
  if (level === "2NF" || level === "3NF") {
    const prime = new Set(keys.flat());
    for (const fd of projected) {
      const nonprime = fd.right.filter((x) => !prime.has(x));
      if (!nonprime.length) continue;
      if (
        keys.some(
          (k) =>
            fd.left.length < k.length && fd.left.every((x) => k.includes(x)),
        )
      ) {
        messages.push(
          `${t.name}: Partial Dependency — ${nonprime.join(", ")} က ${fd.left.join(" + ")} ပေါ်မှာပဲ မူတည်နေပါတယ်။ သီးသန့် Table ထဲ ထားပါ။`,
        );
        break;
      }
    }
    if (level === "3NF")
      for (const fd of projected) {
        if (t.columns.every((c) => closure(fd.left).has(c))) continue;
        const bad = fd.right.filter((x) => !prime.has(x));
        if (bad.length) {
          messages.push(
            `${t.name}: 3NF မဖြစ်သေးပါ။ ${fd.left.join(" + ")} → ${bad.join(", ")} မှာ ဘယ်ဘက်က superkey မဟုတ်၊ ညာဘက်က Candidate Key ထဲ မပါပါ။ DepartmentName ကို Departments ထဲ ခွဲထားပါ။`,
          );
          break;
        }
      }
  }
  return {
    ok: messages.length === 0,
    messages: messages.length
      ? messages
      : [`${t.name}: ✓ ပေးထားတဲ့ Dependency စည်းမျဉ်းအရ ${level} ဖြစ်ပါတယ်။`],
  };
}
export function losslessDecomposition(
  tables: PracticeTable[],
  all: string[] = attributes,
  fds = dependencies,
): boolean {
  const matrix = tables.map((t, i) =>
    all.map((a, j) => (t.columns.includes(a) ? `a${j}` : `b${i}-${j}`)),
  );
  let changed = true;
  let rounds = 0;
  while (changed && rounds++ < 100) {
    changed = false;
    for (const fd of fds) {
      const left = fd.left.map((x) => all.indexOf(x)),
        right = fd.right.map((x) => all.indexOf(x));
      if ([...left, ...right].some((i) => i < 0)) continue;
      for (let i = 0; i < matrix.length; i++)
        for (let j = i + 1; j < matrix.length; j++)
          if (left.every((k) => matrix[i][k] === matrix[j][k]))
            for (const k of right) {
              const a = matrix[i][k],
                b = matrix[j][k];
              if (a === b) continue;
              const winner = a.startsWith("a") ? a : b.startsWith("a") ? b : a,
                loser = winner === a ? b : a;
              for (const r of matrix)
                for (let c = 0; c < r.length; c++)
                  if (r[c] === loser) r[c] = winner;
              changed = true;
            }
    }
  }
  return matrix.some((r) => r.every((value, j) => value === `a${j}`));
}
export function naturalJoin(tables: PracticeTable[]): RecordRow[] | null {
  let joined: RecordRow[] = [{}];
  let columns: string[] = [];
  for (const t of tables) {
    const shared = t.columns.filter((c) => columns.includes(c));
    const next: RecordRow[] = [];
    for (const a of joined)
      for (const b of t.rows)
        if (shared.every((c) => a[c] === b[c])) {
          next.push({
            ...a,
            ...Object.fromEntries(t.columns.map((c) => [c, b[c]])),
          });
          if (next.length > 2000) return null;
        }
    joined = next;
    columns = [...new Set([...columns, ...t.columns])];
  }
  return joined;
}
export function validateExercise(
  tables: PracticeTable[],
  level: Level,
  connections: Connection[],
  original: RecordRow[],
): Validation {
  const results = tables.map((t) => checkTable(t, level));
  const messages = results.flatMap((r) => r.messages);
  let ok = results.every((r) => r.ok),
    unknown = results.some((r) => r.unknown);
  const missing = attributes.filter(
    (a) => !tables.some((t) => t.columns.includes(a)),
  );
  if (missing.length) {
    ok = false;
    messages.push(
      `မူလအချက်အလက် ${missing.join(", ")} ပျောက်နေတယ်။ Column ဖျက်တာနဲ့ Normalization ပြီးမသွားပါ။`,
    );
  }
  if (level !== "UNF" && !missing.length && !unknown) {
    if (!losslessDecomposition(tables)) {
      ok = false;
      messages.push(
        "ဒီလို Table ခွဲရင် မူလ ဆက်နွယ်မှုကို အမြဲ ပြန်မရနိုင်ပါ။ Lossless join ဖြစ်ဖို့ မျှဝေထားတဲ့ Key လိုပါတယ်။",
      );
    }
    const reconstructed = naturalJoin(tables);
    if (reconstructed === null) {
      ok = false;
      unknown = true;
      messages.push(
        "ပြန်ဆက်တဲ့ Row အရေအတွက် များလွန်းလို့ ဒီစမ်းသပ်ခန်းမှာ မစစ်နိုင်ပါ။ ဆက်နွယ်မှုကို ပြန်ကြည့်ပါ။",
      );
    } else {
      const serialize = (rows: RecordRow[]) =>
        new Set(rows.map((r) => JSON.stringify(attributes.map((a) => r[a]))));
      const a = serialize(original),
        b = serialize(reconstructed);
      if (a.size !== b.size || [...a].some((x) => !b.has(x))) {
        ok = false;
        messages.push(
          "Table တွေကို ပြန်ဆက်တဲ့အခါ မူလ Data နဲ့ မတူပါ။ Row ပျောက်တာ၊ ပိုလာတာ၊ ပြင်ထားတာ ရှိနိုင်ပါတယ်။",
        );
      }
      for (const fd of dependencies) {
        const observed = new Map<string, string>();
        for (const r of reconstructed) {
          const k = JSON.stringify(fd.left.map((c) => r[c])),
            v = JSON.stringify(fd.right.map((c) => r[c]));
          if (observed.has(k) && observed.get(k) !== v) {
            ok = false;
            messages.push(
              `${fd.left.join(" + ")} → ${fd.right.join(", ")} နဲ့ ပြန်ဆက်ထားတဲ့ Data မကိုက်ပါ။`,
            );
            break;
          }
          observed.set(k, v);
        }
      }
    }
    const projected = tables.flatMap((t) => projectFDs(t.columns));
    if (
      dependencies.some((fd) =>
        fd.right.some((x) => !closure(fd.left, projected).has(x)),
      )
    ) {
      ok = false;
      messages.push(
        "မူလ Functional Dependency အားလုံးကို Table တစ်ခုချင်းမှာ ထိန်းမထားနိုင်သေးပါ။",
      );
    }
  }
  for (const link of connections) {
    const from = tables.find((t) => t.id === link.from),
      to = tables.find((t) => t.id === link.to);
    if (
      !from ||
      !to ||
      !from.columns.includes(link.column) ||
      !to.columns.includes(link.target)
    ) {
      ok = false;
      messages.push("ဒီ Connection မှာ Table သို့မဟုတ် Column ပျောက်နေတယ်။");
      continue;
    }
    if (to.pk.length !== 1 || to.pk[0] !== link.target) {
      ok = false;
      messages.push(
        `${to.name}.${link.target} က တစ်ခုတည်းသော Primary Key မဟုတ်ပါ။`,
      );
    }
    if (
      from.rows.some(
        (r) => !to.rows.some((s) => r[link.column] === s[link.target]),
      )
    ) {
      ok = false;
      messages.push(
        `${from.name}.${link.column} ရဲ့ ID ကို ${to.name} မှာ ရှာမတွေ့ပါ။`,
      );
    }
    if (link.column !== link.target) {
      ok = false;
      messages.push("ဒီ exercise မှာ အမျိုးအစားတူတဲ့ ID Column တွေကို ဆက်ပါ။");
    }
  }
  if (level === "2NF" || level === "3NF")
    for (const t of tables)
      for (const col of t.columns.filter((c) => c.endsWith("ID"))) {
        const parent = tables.find(
          (p) => p.id !== t.id && p.pk.length === 1 && p.pk[0] === col,
        );
        if (
          parent &&
          !connections.some(
            (l) =>
              l.from === t.id &&
              l.column === col &&
              l.to === parent.id &&
              l.target === col,
          )
        ) {
          ok = false;
          messages.push(
            `${t.name}.${col} → ${parent.name}.${col} ကို Foreign Key နဲ့ ဆက်ပေးပါ။`,
          );
        }
      }
  if (ok)
    messages.push(
      level === "UNF"
        ? "မူလပုံစံကို ပြထားပါတယ်။ 1NF ကို ရွေးပြီး စမ်းကြည့်ပါ။"
        : `အရမ်းကောင်းတယ်။ ဒီ Table အစုက ${level} ဖြစ်သွားပါပြီ။ မူလ Data နဲ့ ဆက်နွယ်မှုကို ပြန်ရပါတယ်။`,
    );
  return { ok, unknown, messages: [...new Set(messages)] };
}
