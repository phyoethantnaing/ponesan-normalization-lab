export interface Lesson {
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  intro: string;
  steps: string[];
  tip: string;
}
export const lessons: Lesson[] = [
  {
    title: "What is a Database?",
    subtitle: "အချက်အလက်တွေရဲ့ အိမ်လေး",
    tag: "THE FIRST LITTLE STEP",
    duration: "4 min",
    intro:
      "ကလေးလေးမှာ အရုပ်တွေ အများကြီးရှိတယ်။ သေတ္တာတစ်လုံးထဲ အကုန်ထည့်ရင် ရှာရခက်မယ်။ အမျိုးအစားအလိုက် စီထားရင် ရှာရလွယ်မယ်။",
    steps: [
      "Database ဆိုတာ အချက်အလက်တွေ စုသိမ်းတဲ့ နေရာပါ။ အရုပ်တွေ သိမ်းတဲ့ စင်လိုပါပဲ။",
      "Table ဆိုတာ အကွက်နဲ့ စီထားတဲ့ စာရင်းပါ။ ဒီစာရင်းမှာ ကလေးတွေ ပါတယ်။",
      "Row ဆိုတာ အလျားလိုက် တစ်ကြောင်းပါ။ S01 ရဲ့ အချက်အလက်ကို ကြည့်ပါ။",
      "Column ဆိုတာ ဒေါင်လိုက် အကွက်တန်းပါ။ StudentName မှာ နာမည်တွေချည်း ရှိတယ်။",
      "Primary Key ဆိုတာ Row ကို ရှာပေးတဲ့ အမှတ်အသားပါ။ ကလေးတစ်ယောက်စီရဲ့ StudentID မတူဘူး။",
    ],
    tip: "နာမည်တူတဲ့ ကလေး နှစ်ယောက် ရှိနိုင်တယ်။ ဒါကြောင့် နာမည်အစား ID ကို သုံးတယ်။",
  },
  {
    title: "What is Normalization?",
    subtitle: "အရာတိုင်းမှာ နေရာလေးရှိတယ်",
    tag: "A PLACE FOR EVERYTHING",
    duration: "5 min",
    intro:
      "အရုပ်ကားတွေကို ကားသေတ္တာထဲ၊ ဘောလုံးတွေကို ဘောလုံးသေတ္တာထဲ ထည့်မယ်။ အချက်အလက်တွေလည်း သင့်တော်တဲ့ နေရာမှာ နေသင့်တယ်။",
    steps: [
      "Normalization ဆိုတာ ဆက်နွယ်မှုနဲ့ စည်းမျဉ်းအလိုက် အချက်အလက်တွေ စီထားတာပါ။",
      "ထပ်ရေးထားတဲ့ နာမည်ကို ပြင်ရင် နေရာတိုင်းမှာ ပြင်ရမယ်။ တစ်နေရာ ကျန်ရင် စာရင်း မကိုက်တော့ဘူး။",
      "Functional Dependency ဆိုတာ အချက်တစ်ခုသိရင် နောက်အချက်ကို သေချာသိတာပါ။ StudentID → StudentName။",
      "နာမည်ကို Students မှာ သိမ်းမယ်။ ဘာသာရပ်ကို Courses မှာ သိမ်းမယ်။ ဘယ်သူ ဘာတက်လဲကို Enrollments မှာ ဆက်မယ်။",
      "Foreign Key ဆိုတာ တခြား Table ကို ညွှန်းတဲ့ ID ပါ။ Table တွေကို ပြန်ဆက်ပြီး မူလစာရင်းကို ပြန်ရနိုင်တယ်။",
    ],
    tip: "Table ကို ကြုံသလို ခွဲတာ မဟုတ်ပါ။ ဘာက ဘာပေါ်မှာ မူတည်လဲဆိုတာကို ကြည့်ပြီး ခွဲတယ်။",
  },
  {
    title: "Unnormalized Form",
    subtitle: "တစ်ကွက်ထဲမှာ အများကြီးဖြစ်နေတယ်",
    tag: "SPOT THE LITTLE PROBLEM",
    duration: "4 min",
    intro:
      "Aung Aung က Math နဲ့ English တက်တယ်။ ဒါပေမဲ့ Courses တစ်ကွက်ထဲမှာ နှစ်ခုလုံး ရေးထားတယ်။",
    steps: [
      "UNF ဆိုတာ မစီရသေးတဲ့ မူလစာရင်းပါ။ Courses အကွက်ကို နှိပ်ကြည့်ပါ။",
      "Repeating group ဆိုတာ ဒီလို တစ်ကွက်ထဲမှာ စာရင်းအများကြီး ရှိတာပါ။ ⚠ နှစ်ခုပါနေတယ်။",
      "Math တက်တဲ့ ကလေးတွေကို ရှာချင်ရင် အကွက်ထဲက စာရင်းကို ထပ်ခွဲဖတ်ရမယ်။",
      "English ပဲ ဖြုတ်ချင်ရင် တစ်ကွက်လုံးထဲက စာသားကို ပြန်ပြင်ရမယ်။",
      "အကွက်တစ်ကွက်မှာ ဘာသာရပ်တစ်ခုပဲ ထည့်ရအောင်။ နောက်အဆင့်မှာ Row လေးတွေ ခွဲမယ်။",
    ],
    tip: "နာမည် ထပ်နေတာနဲ့ တစ်ကွက်ထဲမှာ စာရင်းအများကြီး ရှိတာဟာ ပြဿနာတူ မဟုတ်ဘူး။",
  },
  {
    title: "First Normal Form",
    subtitle: "တစ်ကွက်၊ အချက်တစ်ခု",
    tag: "ONE CELL. ONE THING.",
    duration: "6 min",
    intro:
      "Atomic value ဆိုတာ ဒီစာရင်းအတွက် အကွက်တစ်ကွက်မှာ အချက်တစ်ခုပဲ ရှိတာပါ။ ဘာသာရပ်တစ်ခုကို Row တစ်ကြောင်းစီ ထားမယ်။",
    steps: [
      "မူလ Courses အကွက်တွေကို ကြည့်ပါ။ Math နဲ့ English က တစ်ကွက်ထဲမှာ ရှိနေတယ်။",
      "ဘာသာရပ်တစ်ခုစီကို ခွဲထုတ်မယ်။ ကလေးနဲ့ ဘာသာရပ် ဆက်နွယ်မှုကို မပျောက်စေရဘူး။",
      "တစ်ဘာသာရပ်စီအတွက် Row တစ်ကြောင်း ဖန်တီးမယ်။ StudentID နဲ့ StudentName ကို အတူထားမယ်။",
      "Composite Key ဆိုတာ Column တွေ ပေါင်းထားတဲ့ အမှတ်အသားပါ။ StudentID + CourseID က ဒီနေရာမှာ Row ကို ခွဲခြားပေးတယ်။",
      "1NF မှာ တစ်ကွက်၊ အချက်တစ်ခု ဖြစ်ရမယ်။ Repeating group မရှိရဘူး။ Row ကိုလည်း တိတိကျကျ ခွဲခြားနိုင်ရမယ်။",
    ],
    tip: "StudentID တစ်ခုတည်းက ဒီ Table ရဲ့ Key မဟုတ်ဘူး။ S01 က ဘာသာရပ် နှစ်ခု တက်လို့ နှစ်ကြောင်း ရှိတယ်။",
  },
  {
    title: "Second Normal Form",
    subtitle: "အချက်တစ်ခုကို သင့်တော်တဲ့အိမ်ပေးမယ်",
    tag: "FOLLOW THE DEPENDENCIES",
    duration: "8 min",
    intro:
      "Mg Mg (S03) လည်း စာရင်းဝင်လာတယ်။ Department ဆိုတာ ကျောင်းဌာနပါ။ Grade ဆိုတာ အမှတ်ပါ။ ကလေးတစ်ယောက်၊ ဘာသာရပ်တစ်ခုအတွက် အမှတ်တစ်ခု ရှိမယ်။ ဒီ Key နှစ်ခုလုံး လိုတယ်။",
    steps: [
      "1NF ကို ချဲ့ကြည့်မယ်။ CourseID, Grade နဲ့ Department အချက်အလက်တွေ ထည့်ထားတယ်။ Key က StudentID + CourseID ပါ။",
      "Functional Dependency — StudentID သိရင် StudentName နဲ့ DepartmentID ကို သိတယ်။ CourseID သိရင် CourseName ကို သိတယ်။",
      "Partial Dependency ဆိုတာ ပေါင်းထားတဲ့ Key တစ်စိတ်တစ်ပိုင်းနဲ့ပဲ အချက်တစ်ခု သိနိုင်တာပါ။ StudentName က StudentID ပေါ်မှာပဲ မူတည်တယ်။",
      "နာမည်တွေကို Students ထဲ၊ ဘာသာရပ်တွေကို Courses ထဲ ရွှေ့မယ်။ Grade က Key နှစ်ခုလုံးနဲ့ ဆိုင်လို့ Enrollments ထဲ နေမယ်။",
      "2NF = 1NF ဖြစ်ပြီး Candidate Key (Row ခွဲခြားတဲ့ အနည်းဆုံး Column အစု) ရဲ့ တစ်စိတ်တစ်ပိုင်းပေါ်မှာ non-key အချက်တွေ မမူတည်တော့တာပါ။",
    ],
    tip: "Students ထဲမှာ DepartmentName က ပြဿနာ ရှိနေသေးတယ်။ ဒါပေမဲ့ Partial Dependency မဟုတ်လို့ 3NF မှာ ဆက်ပြင်မယ်။",
  },
  {
    title: "Third Normal Form",
    subtitle: "ချိတ်ဆက်မယ်၊ ထပ်မကူးတော့ဘူး",
    tag: "EVERYTHING IN ITS RIGHT PLACE",
    duration: "7 min",
    intro:
      "Department ဆိုတာ ကျောင်းဌာနပါ။ D01 ဆိုရင် Arts လို့ သတ်မှတ်ထားတယ်။ Arts ကို ကလေးတိုင်းရဲ့ Row မှာ ထပ်မကူးရအောင်။",
    steps: [
      "2NF Students Table မှာ DepartmentName ကို ထပ်သိမ်းထားတယ်။ S01 နဲ့ S03 နှစ်ယောက်လုံး D01 မှာ ရှိတယ်။",
      "Transitive Dependency ဆိုတာ Key ကနေ ကြားခံအချက်တစ်ခုကို ဖြတ်ပြီး နောက်အချက်ကို သိတာပါ။ StudentID → DepartmentID → DepartmentName။",
      "ဌာနနာမည် ပြောင်းရင် ကျောင်းသား Row အများကြီး ပြင်ရမယ်။ DepartmentID တစ်ခုစီနဲ့ ဌာနစာရင်း ခွဲရအောင်။",
      "DepartmentName ကို Departments ထဲ ရွှေ့မယ်။ Students မှာ DepartmentID ကို Foreign Key အဖြစ် ထားမယ်။",
      "3NF က 2NF ဖြစ်ရမယ်။ non-key အချက်တွေက Key ကို ကြားခံအချက်ကနေ မမူတည်တော့ရဘူး။ ID တွေနဲ့ ပြန်ဆက်ရင် မူလ ဆက်နွယ်မှု မပျောက်ဘူး။",
    ],
    tip: "တိကျတဲ့ 3NF စည်းမျဉ်း — non-trivial X → A တိုင်းမှာ X က superkey ဖြစ်ရမယ်၊ ဒါမှမဟုတ် A က Candidate Key တစ်ခုထဲ ပါရမယ်။",
  },
];
export const levelRules = [
  [
    "UNF",
    "မူလစာရင်း",
    "Repeating groups ရှိနိုင်တယ်",
    "တစ်ကွက်ထဲမှာ စာရင်းအများကြီး ရှိနေသေးတယ်။",
  ],
  [
    "1NF",
    "တစ်ကွက်၊ အချက်တစ်ခု",
    "Atomic values + identifiable rows",
    "တစ်ကွက်မှာ တစ်ခုပဲ။ Row တိုင်းကို Key နဲ့ ရှာနိုင်တယ်။",
  ],
  [
    "2NF",
    "Partial Dependency ဖယ်မယ်",
    "1NF + no partial dependencies",
    "ပေါင်းထားတဲ့ Key အပိုင်းလေးပေါ် မူတည်တာကို သီးသန့်ထားမယ်။",
  ],
  [
    "3NF",
    "Transitive Dependency ဖယ်မယ်",
    "2NF + 3NF dependency rule",
    "ကြားခံအချက်ကနေ သိရတဲ့ non-key အချက်ကို သင့်တော်တဲ့ Table ထဲ ထားမယ်။",
  ],
];
