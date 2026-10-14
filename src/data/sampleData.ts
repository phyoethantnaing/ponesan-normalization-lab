export type Level = "UNF" | "1NF" | "2NF" | "3NF";
export type RecordRow = Record<string, string>;
export interface TableModel {
  name: string;
  columns: string[];
  rows: RecordRow[];
  pk: string[];
  fk?: Record<string, string>;
  tone?: string;
}
export const students: RecordRow[] = [
  {
    StudentID: "S01",
    StudentName: "Aung Aung",
    DepartmentID: "D01",
    DepartmentName: "Arts",
  },
  {
    StudentID: "S02",
    StudentName: "Su Su",
    DepartmentID: "D02",
    DepartmentName: "Science",
  },
  {
    StudentID: "S03",
    StudentName: "Mg Mg",
    DepartmentID: "D01",
    DepartmentName: "Arts",
  },
];
export const courses: RecordRow[] = [
  { CourseID: "C01", CourseName: "Math" },
  { CourseID: "C02", CourseName: "English" },
  { CourseID: "C03", CourseName: "Science" },
];
export const enrollments: RecordRow[] = [
  { StudentID: "S01", CourseID: "C01", Grade: "A" },
  { StudentID: "S01", CourseID: "C02", Grade: "B" },
  { StudentID: "S02", CourseID: "C03", Grade: "A" },
  { StudentID: "S02", CourseID: "C01", Grade: "B" },
  { StudentID: "S03", CourseID: "C02", Grade: "A" },
];
export const fullRows = enrollments.map((e) => ({
  ...students.find((s) => s.StudentID === e.StudentID)!,
  ...courses.find((c) => c.CourseID === e.CourseID)!,
  ...e,
}));
export const attributes = [
  "StudentID",
  "StudentName",
  "DepartmentID",
  "DepartmentName",
  "CourseID",
  "CourseName",
  "Grade",
];
export const unf: TableModel = {
  name: "Student courses",
  columns: ["StudentID", "StudentName", "Courses"],
  pk: ["StudentID"],
  rows: [
    { StudentID: "S01", StudentName: "Aung Aung", Courses: "Math, English" },
    { StudentID: "S02", StudentName: "Su Su", Courses: "Science, Math" },
  ],
};
export function schema(level: Level, extended = true): TableModel[] {
  if (level === "UNF") return [unf];
  if (level === "1NF")
    return [
      {
        name: "Student enrollments",
        columns: extended
          ? [...attributes]
          : ["StudentID", "StudentName", "CourseID", "CourseName"],
        rows: extended ? fullRows : fullRows.slice(0, 4),
        pk: ["StudentID", "CourseID"],
      },
    ];
  return [
    {
      name: "Students",
      columns:
        level === "3NF"
          ? ["StudentID", "StudentName", "DepartmentID"]
          : ["StudentID", "StudentName", "DepartmentID", "DepartmentName"],
      rows: students,
      pk: ["StudentID"],
      fk:
        level === "3NF"
          ? { DepartmentID: "Departments.DepartmentID" }
          : undefined,
      tone: "mint",
    },
    ...(level === "3NF"
      ? [
          {
            name: "Departments",
            columns: ["DepartmentID", "DepartmentName"],
            rows: [
              { DepartmentID: "D01", DepartmentName: "Arts" },
              { DepartmentID: "D02", DepartmentName: "Science" },
            ],
            pk: ["DepartmentID"],
            tone: "peach",
          },
        ]
      : []),
    {
      name: "Courses",
      columns: ["CourseID", "CourseName"],
      rows: courses,
      pk: ["CourseID"],
      tone: "lavender",
    },
    {
      name: "Enrollments",
      columns: ["StudentID", "CourseID", "Grade"],
      rows: enrollments,
      pk: ["StudentID", "CourseID"],
      fk: { StudentID: "Students.StudentID", CourseID: "Courses.CourseID" },
      tone: "blue",
    },
  ];
}
export const glossary: [string, string][] = [
  [
    "Database",
    "အချက်အလက်တွေကို စုသိမ်းထားတဲ့ နေရာ။ အရုပ်တွေ သိမ်းတဲ့ စင်လိုပါပဲ။",
  ],
  ["Table", "အချက်အလက်တွေကို အကွက်နဲ့ စီထားတဲ့ စာရင်း။"],
  ["Row", "စာရင်းထဲက အလျားလိုက် တစ်ကြောင်း။ ကလေးတစ်ယောက်ရဲ့ အချက်အလက်လိုပါပဲ။"],
  ["Column", "ဒေါင်လိုက် အကွက်တန်း။ နာမည်တွေချည်း ရေးထားတဲ့ အတန်းလိုပါပဲ။"],
  [
    "Primary Key",
    "Row တစ်ကြောင်းကို တိတိကျကျ ရှာနိုင်တဲ့ အမှတ်အသား။ တစ်ခု သို့မဟုတ် Column တွေ ပေါင်းထားတာ ဖြစ်နိုင်တယ်။",
  ],
  [
    "Foreign Key",
    "တခြား Table ရဲ့ Key ကို ညွှန်းထားတဲ့ အမှတ်အသား။ စာရင်းတွေ ဆက်ပေးတဲ့ တံတားလိုပါပဲ။",
  ],
  [
    "Functional Dependency",
    "အချက်တစ်ခု သိရင် တခြားအချက်ကို တစ်မျိုးတည်း သေချာသိနိုင်တာ။ StudentID သိရင် StudentName သိမယ်။",
  ],
  [
    "Candidate Key",
    "Row ကို ခွဲခြားနိုင်တဲ့ အနည်းဆုံး Column အစု။ ဒီအစုထဲက Column တစ်ခု ဖြုတ်ရင် မလုံလောက်တော့ဘူး။",
  ],
  [
    "Superkey",
    "Row ကို ခွဲခြားနိုင်တဲ့ Column အစု။ မလိုအပ်တဲ့ Column အပို ပါနေလည်း Superkey ဖြစ်နိုင်တယ်။",
  ],
  [
    "Non-prime attribute",
    "Candidate Key တစ်ခုခုထဲမှာ မပါတဲ့ Column။ သင်ခန်းစာမှာ non-key အချက်လို့ အလွယ်ပြောထားတယ်။",
  ],
  ["Composite Key", "Column နှစ်ခု သို့မဟုတ် ပိုများတာ ပေါင်းထားတဲ့ Key။"],
  [
    "Partial Dependency",
    "ပေါင်းထားတဲ့ Key ထဲက တစ်စိတ်တစ်ပိုင်းနဲ့ပဲ အချက်တစ်ခု သိနိုင်တာ။",
  ],
  [
    "Transitive Dependency",
    "Key ကနေ အခြားအချက်တစ်ခုကို ဖြတ်ပြီး နောက်အချက်ကို သိနိုင်တာ။ A → B → C လိုပါပဲ။",
  ],
  [
    "Normalization",
    "အချက်အလက်တွေကို ဆက်နွယ်မှုနဲ့ စည်းမျဉ်းအလိုက် သင့်တော်တဲ့ Table တွေထဲ စီထားတာ။",
  ],
  ["Atomic value", "ဒီအကြောင်းအရာအတွက် အကွက်တစ်ကွက်မှာ အချက်တစ်ခုပဲ ရှိတာ။"],
  [
    "Repeating group",
    "တစ်ကွက်ထဲမှာ စာရင်းအများကြီး ဒါမှမဟုတ် Course1, Course2 လို ထပ်ထားတဲ့ Column အုပ်စု။",
  ],
];
