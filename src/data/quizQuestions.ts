export interface Question {
  id: string;
  type: "choice" | "cell" | "key" | "match" | "order";
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
export const lessonQuestions: Question[] = [
  {
    id: "database",
    type: "choice",
    prompt: "ကလေးတစ်ယောက်ရဲ့ အချက်အလက်ပါတဲ့ အလျားလိုက် တစ်ကြောင်းကို ဘာခေါ်လဲ?",
    options: ["Column", "Row", "Database"],
    answer: 1,
    explanation: "Row က အလျားလိုက် တစ်ကြောင်းပါ။ Column က ဒေါင်လိုက် အတန်းပါ။",
  },
  {
    id: "normalization",
    type: "choice",
    prompt: "Normalization လုပ်တဲ့အခါ ဘာကိုကြည့်ပြီး Table ခွဲသင့်လဲ?",
    options: [
      "Column အရေအတွက်ပဲ ကြည့်မယ်",
      "နာမည်ထပ်တာတိုင်း ဖျက်မယ်",
      "အချက်အလက်တွေရဲ့ ဆက်နွယ်မှုနဲ့ Dependency",
    ],
    answer: 2,
    explanation:
      "ဆက်နွယ်မှုနဲ့ Dependency ကိုကြည့်တယ်။ ကြုံသလို ခွဲရင် အချက်အလက် ဆက်နွယ်မှု ပျောက်နိုင်တယ်။",
  },
  {
    id: "unf",
    type: "cell",
    prompt: "အချက်အလက် တစ်ခုထက်ပိုပါတဲ့ ပြဿနာရှိသော အကွက်ကို ရွေးပါ။",
    options: ["S01", "Aung Aung", "Math, English"],
    answer: 2,
    explanation:
      "Courses မှာ Math နဲ့ English နှစ်ခု ပါနေတယ်။ သီးသန့် Row နှစ်ကြောင်း ခွဲနိုင်တယ်။",
  },
  {
    id: "1nf",
    type: "key",
    prompt: "Enrollment Row တစ်ကြောင်းကို တိတိကျကျ ရှာဖို့ ဘယ် Key လိုလဲ?",
    options: ["StudentID", "StudentName", "StudentID + CourseID"],
    answer: 2,
    explanation:
      "ကလေးတစ်ယောက်က ဘာသာရပ်အများကြီး တက်နိုင်လို့ StudentID + CourseID နှစ်ခုလုံး လိုတယ်။ ဒီဥပမာမှာ တစ်ဘာသာရပ်ကို တစ်ကြိမ်ပဲ စာရင်းသွင်းတယ်။",
  },
  {
    id: "2nf",
    type: "choice",
    prompt: "StudentName ကို ဘယ် Table ထဲမှာ ထားသင့်လဲ?",
    options: ["Students", "Courses", "Enrollments"],
    answer: 0,
    explanation:
      "StudentName က StudentID ပေါ်မှာပဲ မူတည်လို့ Students ထဲမှာ ထားတယ်။",
  },
  {
    id: "3nf",
    type: "match",
    prompt: "Students.DepartmentID က ဘယ် Primary Key ကို ညွှန်းရမလဲ?",
    options: [
      "Courses.CourseID",
      "Departments.DepartmentID",
      "Enrollments.StudentID",
    ],
    answer: 1,
    explanation:
      "DepartmentID က Departments.DepartmentID ကို ညွှန်းတယ်။ ID နဲ့ ဆက်ရင် ဌာနနာမည်ကို ပြန်သိနိုင်တယ်။",
  },
];
export const finalQuestions: Question[] = [
  ...lessonQuestions,
  {
    id: "atomic",
    type: "choice",
    prompt: "1NF ဖြစ်တဲ့ အကွက်ကို ရွေးပါ။",
    options: ["Math, English", "Math", "Math / English"],
    answer: 1,
    explanation: "ဒီဥပမာမှာ တစ်ကွက်မှာ ဘာသာရပ်တစ်ခုပဲ ပါရမယ်။",
  },
  {
    id: "grade",
    type: "choice",
    prompt: "ဒီဥပမာမှာ Grade က ဘာပေါ်မှာ မူတည်လဲ?",
    options: [
      "StudentID တစ်ခုတည်း",
      "CourseID တစ်ခုတည်း",
      "StudentID + CourseID နှစ်ခုလုံး",
    ],
    answer: 2,
    explanation:
      "ကျောင်းသားတစ်ယောက်ရဲ့ ဘာသာရပ်တစ်ခုအတွက် အမှတ် ဖြစ်လို့ Key နှစ်ခုလုံး လိုတယ်။",
  },
  {
    id: "order",
    type: "order",
    prompt: "Normalization အဆင့်တွေကို အစဉ်လိုက် စီပါ။",
    options: ["UNF", "1NF", "2NF", "3NF"],
    answer: 0,
    explanation:
      "မူလ UNF ကနေ Atomic values အတွက် 1NF၊ Partial Dependency ဖယ်ဖို့ 2NF၊ Transitive Dependency ဖယ်ဖို့ 3NF။",
  },
  {
    id: "lossless",
    type: "choice",
    prompt: "Table ခွဲပြီးရင် ဘာကို သေချာစေရမလဲ?",
    options: [
      "Row အရေအတွက် အမြဲ လျော့ရမယ်",
      "Key တွေနဲ့ ပြန်ဆက်ရင် မူလ အချက်အလက်ကို ရရမယ်",
      "နာမည်တူသမျှ ဖျက်ရမယ်",
    ],
    answer: 1,
    explanation:
      "ID တွေနဲ့ ပြန်ဆက်တဲ့အခါ မူလ ကျောင်းသား–ဘာသာရပ် ဆက်နွယ်မှု မပျောက်ရဘူး။",
  },
];
