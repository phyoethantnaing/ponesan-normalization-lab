import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Check,
  MousePointer2,
  BookOpen,
  ChevronRight,
  X,
} from "lucide-react";
import AnimationControls from "../components/AnimationControls";
import {
  AnimatedTable,
  TableLegend,
  tableTokenIds,
} from "../components/AnimatedTable";
import RelationshipDiagram from "../components/RelationshipDiagram";
import { QuizCard } from "../components/QuizCard";
import { lessons } from "../data/lessons";
import { lessonQuestions } from "../data/quizQuestions";
import { schema, students, type TableModel } from "../data/sampleData";

const lessonWords = [
  [
    ["Database", "အချက်အလက်တွေ သိမ်းတဲ့နေရာ"],
    ["Table", "အကွက်နဲ့ စီထားတဲ့ စာရင်း"],
    ["Row", "အလျားလိုက် တစ်ကြောင်း"],
    ["Column", "ဒေါင်လိုက် အကွက်တန်း"],
    ["Primary Key", "Row ကို ရှာပေးတဲ့ အမှတ်အသား"],
  ],
  [
    ["Normalization", "ဆက်နွယ်မှုအလိုက် စာရင်းစီတာ"],
    ["Functional Dependency", "တစ်ခုသိရင် နောက်တစ်ခုကို သေချာသိတာ"],
    ["Foreign Key", "တခြား Table ကို ညွှန်းတဲ့ ID"],
  ],
  [
    ["UNF", "မစီရသေးတဲ့ မူလစာရင်း"],
    ["Repeating group", "တစ်ကွက်ထဲမှာ စာရင်းအများကြီး ပါတာ"],
  ],
  [
    ["1NF", "တစ်ကွက်မှာ တစ်ခု၊ Row ကို Key နဲ့ ရှာနိုင်တာ"],
    ["Atomic value", "ဒီစာရင်းအတွက် အချက်တစ်ခုတည်း"],
    ["Composite Key", "Column တွေ ပေါင်းထားတဲ့ Key"],
  ],
  [
    ["2NF", "1NF ဖြစ်ပြီး Partial Dependency မရှိတာ"],
    ["Partial Dependency", "Key တစ်စိတ်တစ်ပိုင်းနဲ့ပဲ သိနိုင်တာ"],
    ["Candidate Key", "Row ခွဲခြားတဲ့ အနည်းဆုံး Column အစု"],
    ["non-key", "Candidate Key တစ်ခုခုထဲမှာ မပါတဲ့ အချက်"],
  ],
  [
    [
      "3NF",
      "2NF ပြီး၊ non-key အချက်တွေကို Key ကနေ ကြားခံမဲ့ သိနိုင်အောင် စီတာ",
    ],
    ["Transitive Dependency", "Key ကနေ ကြားခံအချက်ကို ဖြတ်ပြီး သိတာ"],
    ["Foreign Key", "တခြား Table ကို ညွှန်းတဲ့ ID"],
    ["superkey", "Row ခွဲခြားနိုင်တဲ့ Column အစု"],
  ],
];

export function ToyStory() {
  const [value, setValue] = useState(25);
  const reduced = useReducedMotion();
  const toys = ["🚗", "🧸", "⚽", "🚙", "🧸", "🏀"];
  return (
    <div className="toy-story">
      <div className="toy-scene">
        <div className="toy-label">
          <span>BEFORE · ရှုပ်နေတယ်</span>
          <span>AFTER · စီထားတယ်</span>
        </div>
        <div className="toy-floor">
          <div
            className="box-outline messy-box"
            style={{ opacity: 1 - value / 100 }}
          />
          <div className="tidy-boxes" style={{ opacity: value / 100 }}>
            <div>
              <small>ကားလေးတွေ</small>
            </div>
            <div>
              <small>အရုပ်လေးတွေ</small>
            </div>
            <div>
              <small>ဘောလုံးတွေ</small>
            </div>
          </div>
          {toys.map((toy, i) => {
            const startX = [31, 46, 59, 36, 51, 63][i],
              endX = [14, 47, 80, 23, 56, 89][i];
            const startY = [42, 33, 49, 66, 66, 70][i],
              endY = [43, 43, 43, 69, 69, 69][i];
            return (
              <motion.span
                className="toy"
                key={i}
                animate={{
                  left: `${startX + ((endX - startX) * value) / 100}%`,
                  top: `${startY + ((endY - startY) * value) / 100}%`,
                  rotate: (1 - value / 100) * [15, -20, 30, -15, 12, -10][i],
                }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                {toy}
              </motion.span>
            );
          })}
        </div>
      </div>
      <div className="slider-row">
        <span>ရှုပ်နေတယ်</span>
        <input
          aria-label="Before After toy organization slider"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <span>စီပြီးပြီ ✓</span>
      </div>
      <p>ဆွဲကြည့်ပါ။ အရုပ်တွေက သူတို့အမျိုးအစားအလိုက် နေရာယူမယ်။</p>
    </div>
  );
}
function DependencyArrows({ third = false }: { third?: boolean }) {
  return (
    <div className="dependency-arrows">
      {(third
        ? [
            ["StudentID", "DepartmentID"],
            ["DepartmentID", "DepartmentName"],
          ]
        : [
            ["StudentID", "StudentName"],
            ["CourseID", "CourseName"],
            ["StudentID + CourseID", "Grade"],
          ]
      ).map(([from, to], i) => (
        <motion.div
          key={from}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <span>{from}</span>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: 2 }}
          >
            <ArrowRight size={17} />
          </motion.span>
          <strong>{to}</strong>
        </motion.div>
      ))}
    </div>
  );
}
export default function LessonPlayer({
  index,
  onNavigate,
  onComplete,
  completed,
  preview = false,
}: {
  index: number;
  onNavigate: (i: number) => void;
  onComplete: (i: number) => void;
  completed: boolean;
  preview?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [help, setHelp] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const lesson = lessons[index];
  const reduced = useReducedMotion();
  useEffect(() => {
    setStep(0);
    setPlaying(false);
    setHelp(false);
  }, [index]);
  useEffect(() => {
    if (!playing) return;
    if (step === 4) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), 3500 / speed);
    return () => clearTimeout(timer);
  }, [playing, step, speed]);
  useEffect(() => {
    if (fullscreen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [fullscreen]);
  function tables(): TableModel[] {
    if (index === 0)
      return [
        {
          name: "Students",
          columns: ["StudentID", "StudentName"],
          rows: students.slice(0, 2),
          pk: ["StudentID"],
        },
      ];
    if (index === 1) return schema(step < 3 ? "1NF" : "2NF");
    if (index === 2) return schema("UNF");
    if (index === 3) return schema(step < 2 ? "UNF" : "1NF", false);
    if (index === 4) return schema(step < 3 ? "1NF" : "2NF");
    return schema(step < 3 ? "2NF" : "3NF");
  }
  const models = tables();
  const seen = new Set<string>();
  const tableScenes = models.map((model) => ({
    model,
    ids: tableTokenIds(model, seen),
  }));
  const highlight =
    index === 0
      ? ["", "", "row", "column", "correct"][step]
      : step === 4
        ? "correct"
        : step === 0
          ? ""
          : step <= 2
            ? index === 5
              ? "transitive"
              : index === 4
                ? "dependency"
                : "problem"
            : step === 3
              ? "dependency"
              : "correct";
  const controls = {
    step,
    count: 5,
    playing,
    speed,
    setStep,
    setPlaying,
    setSpeed,
    fullscreen,
    onFullscreen: () => setFullscreen(!fullscreen),
  };
  const animation = (
    <div
      className={`animation-workspace ${fullscreen ? "is-fullscreen" : ""} ${index === 3 && step === 1 ? "separating" : ""}`}
    >
      <div className="workspace-heading">
        <div>
          <span className="live-dot" />
          <strong>
            {index === 0
              ? "Meet your first Table"
              : index === 2
                ? "Find the repeating group"
                : index === 3
                  ? "One course, one row"
                  : index === 4
                    ? "A home for every fact"
                    : index === 5
                      ? "Keep the connection"
                      : "A little order goes a long way"}
          </strong>
        </div>
        <span className="stage-badge">
          {index < 2
            ? "EXPLORE"
            : index === 2
              ? "UNF"
              : index === 3
                ? "1NF"
                : index === 4
                  ? "2NF"
                  : "3NF"}
        </span>
      </div>
      {(index === 4 || index === 5) && step >= 1 && step < 4 && (
        <DependencyArrows third={index === 5} />
      )}
      <LayoutGroup id={`lesson-${index}`}>
        <div
          className={`animated-tables ${models.length > 1 ? "multi-table" : ""}`}
        >
          <div className="tables-stack">
            {tableScenes.map(({ model: m, ids }) => (
              <AnimatedTable
                key={m.name}
                model={m}
                sceneId={`lesson-${index}`}
                tokenIds={ids}
                speed={speed}
                highlight={
                  index === 5 && m.name !== "Students" && step < 3
                    ? ""
                    : highlight
                }
              />
            ))}
          </div>
        </div>
      </LayoutGroup>
      {models.length > 1 && step >= 3 && (
        <RelationshipDiagram department={index === 5 && step >= 3} />
      )}
      <div className="workspace-hint">
        <MousePointer2 size={13} />
        <span>အကွက်လေးတွေကို နှိပ်ပြီး စမ်းကြည့်ပါ</span>
        <TableLegend />
      </div>
      <div className="step-explanation" aria-live="polite">
        <span className="step-number">0{step + 1}</span>
        <p>{lesson.steps[step]}</p>
      </div>
      <AnimationControls {...controls} />
    </div>
  );
  return (
    <div className={`lesson-player ${preview ? "preview-lesson" : ""}`}>
      {!preview && (
        <div className="page-heading">
          <div className="eyebrow">
            <BookOpen size={14} /> LESSON 0{index + 1} / 06 · {lesson.duration}
          </div>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
      )}
      <div className="lesson-intro">
        <span className="section-number">0{index + 1}</span>
        <div>
          <div className="eyebrow">{lesson.tag}</div>
          <h2>{lesson.subtitle}</h2>
          <p>{lesson.intro}</p>
        </div>
        {!preview && <span className="read-time">{lesson.duration}</span>}
      </div>
      {!preview && (
        <div className="lesson-words">
          {lessonWords[index].map(([term, text]) => (
            <span key={term}>
              <strong>{term}</strong>
              <span> — {text}</span>
            </span>
          ))}
        </div>
      )}
      {index < 2 && <ToyStory />}
      {!fullscreen && animation}
      <dialog
        ref={dialog}
        className="fullscreen-dialog"
        onCancel={() => setFullscreen(false)}
        onClose={() => setFullscreen(false)}
        onKeyDown={(e) => {
          if (
            e.key === " " &&
            e.target instanceof HTMLButtonElement === false &&
            e.target instanceof HTMLSelectElement === false
          ) {
            e.preventDefault();
            setPlaying((v) => !v);
          }
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close fullscreen"
          onClick={() => setFullscreen(false)}
        >
          <X size={20} />
        </button>
        {fullscreen && animation}
      </dialog>
      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={() => {
            setStep(1);
            setPlaying(false);
          }}
        >
          <MousePointer2 size={14} /> ပြဿနာကိုကြည့်မယ်
        </button>
        <button className="text-button" onClick={() => setHelp(!help)}>
          <Lightbulb size={15} /> ဘာကြောင့်ပြင်ရတာလဲ? <ChevronRight size={14} />
        </button>
      </div>
      {help && (
        <div className="tip-card">
          <Lightbulb size={17} />
          <p>{lesson.tip}</p>
        </div>
      )}
      <div className="takeaway">
        <span>✦</span>
        <div>
          <strong>သိထားရမယ့် အချက်လေး</strong>
          <p>{lesson.tip}</p>
        </div>
      </div>
      {!preview && (
        <>
          <QuizCard
            question={lessonQuestions[index]}
            onCorrect={() => onComplete(index)}
          />
          <div className="lesson-bottom">
            <button
              className="secondary-button"
              onClick={() => onNavigate(index - 1)}
            >
              <ArrowLeft size={16} />{" "}
              {index === 0 ? "ပင်မစာမျက်နှာ" : "Previous Step"}
            </button>
            <span className={completed ? "completed-label" : "muted"}>
              {completed ? (
                <>
                  <Check size={14} /> Lesson completed
                </>
              ) : (
                "Quiz ဖြေပြီး Progress သိမ်းမယ်"
              )}
            </span>
            <button
              className="primary-button"
              onClick={() => onNavigate(index + 1)}
            >
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
      {preview && (
        <button className="primary-button" onClick={() => onNavigate(0)}>
          ပထမဆုံး Lesson ကို စမယ် <ArrowRight size={16} />
        </button>
      )}
      {reduced && (
        <p className="muted small">
          Reduced motion: တည်ငြိမ်တဲ့ အဆင့်ပြောင်းမှုနဲ့ ပြထားပါတယ်။
        </p>
      )}
    </div>
  );
}
