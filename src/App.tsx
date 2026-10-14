import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  Menu,
  ArrowRight,
  ArrowUpRight,
  Play,
  Check,
  Clock,
  BookOpen,
  FlaskConical,
  Trophy,
  Sparkles,
  GraduationCap,
  ChevronRight,
  Download,
  Printer,
  X,
  KeyRound,
  Layers,
  GitBranch,
  Heart,
  BookText,
} from "lucide-react";
import Navbar, { type Page } from "./components/Navbar";
import HeroIllustration from "./components/HeroIllustration";
import LessonPlayer from "./lessons/LessonPlayer";
import NormalizationPlayground from "./playground/NormalizationPlayground";
import { FinalQuiz } from "./components/QuizCard";
import { AnimatedTable, TableLegend } from "./components/AnimatedTable";
import RelationshipDiagram from "./components/RelationshipDiagram";
import { lessons, levelRules } from "./data/lessons";
import { glossary, schema, type Level } from "./data/sampleData";

interface Progress {
  completed: number[];
  score: number | null;
}
function readProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem("ponesan-progress") || "{}");
    return {
      completed: Array.isArray(value.completed)
        ? [
            ...new Set<number>(
              value.completed.filter(
                (v: unknown) =>
                  typeof v === "number" &&
                  Number.isInteger(v) &&
                  v >= 0 &&
                  v < 8,
              ),
            ),
          ]
        : [],
      score:
        typeof value.score === "number" && value.score >= 0 && value.score <= 10
          ? value.score
          : null,
    };
  } catch {
    return { completed: [], score: null };
  }
}
function readRoute(): { page: Page; index: number } {
  const parts = window.location.hash.slice(1).split("/");
  const valid = [
    "home",
    "lesson",
    "playground",
    "quiz",
    "comparison",
    "glossary",
  ];
  return {
    page: valid.includes(parts[0]) ? (parts[0] as Page) : "home",
    index: Math.min(5, Math.max(0, Number(parts[1]) || 0)),
  };
}
function downloadSummary() {
  const content = `# Database Normalization ကို အလွယ်ဆုံးလေ့လာမယ်\n\n${levelRules.map(([l, g, r, e]) => `## ${l}\n${g}\n${r}\n${e}`).join("\n\n")}\n\n## Final schema\nStudents(StudentID PK, StudentName, DepartmentID FK → Departments)\nDepartments(DepartmentID PK, DepartmentName)\nCourses(CourseID PK, CourseName)\nEnrollments(StudentID PK/FK → Students, CourseID PK/FK → Courses, Grade)\n\nEnrollments composite Primary Key: (StudentID, CourseID). ဒီဥပမာမှာ တစ်ဘာသာရပ်ကို တစ်ကြိမ်ပဲ စာရင်းသွင်းတယ်။\n\n## Functional Dependencies\nStudentID → StudentName, DepartmentID\nDepartmentID → DepartmentName\nCourseID → CourseName\n(StudentID, CourseID) → Grade\n\nKey နဲ့ ဆက်ပြီး မူလစာရင်းကို ပြန်ရမယ်။ Normalization က Duplicate row ဖျက်တာပဲ မဟုတ်ပါ။\n\n3NF: non-trivial X → A တိုင်းမှာ X က superkey သို့မဟုတ် A က Candidate Key တစ်ခုထဲ ပါရမယ်။\n\n## Little glossary\n${glossary.map(([term, text]) => `${term}: ${text}`).join("\n\n")}`;
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "normalization-summary-my.md";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Comparison() {
  const [level, setLevel] = useState<Level>("UNF");
  return (
    <div>
      <div className="page-heading">
        <div className="eyebrow">
          <Layers size={14} /> SEE THE BIG PICTURE
        </div>
        <h1>အဆင့်လေးတွေ နှိုင်းယှဉ်ကြည့်မယ်</h1>
        <p>အဆင့်တစ်ဆင့်စီမှာ ဘာကြောင့် ပြောင်းရလဲ?</p>
      </div>
      <div className="comparison-rule-table card table-scroll">
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Main goal</th>
              <th>Important rule</th>
            </tr>
          </thead>
          <tbody>
            {levelRules.map(([l, g, r, e]) => (
              <tr key={l}>
                <td>
                  <span className={`level-pill level-${l}`}>{l}</span>
                </td>
                <td>
                  <strong>{g}</strong>
                  <small>{e}</small>
                </td>
                <td>{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="comparison-tabs"
        role="tablist"
        aria-label="Normalization level"
      >
        {(["UNF", "1NF", "2NF", "3NF"] as Level[]).map((l) => (
          <button
            role="tab"
            aria-selected={level === l}
            aria-controls="comparison-panel"
            id={`tab-${l}`}
            key={l}
            className={level === l ? "active" : ""}
            onClick={() => setLevel(l)}
          >
            {l}
            <span>{levelRules.find((x) => x[0] === l)?.[1]}</span>
          </button>
        ))}
      </div>
      <div
        id="comparison-panel"
        role="tabpanel"
        aria-labelledby={`tab-${level}`}
        className="comparison-panel"
      >
        <div className="table-grid">
          {schema(level).map((m) => (
            <AnimatedTable
              key={`${level}-${m.name}`}
              model={m}
              highlight={level === "UNF" ? "problem" : "correct"}
              sceneId={`compare-${level}-${m.name}`}
            />
          ))}
        </div>
        <TableLegend />
        {(level === "2NF" || level === "3NF") && (
          <RelationshipDiagram department={level === "3NF"} />
        )}
        <div className="tip-card">
          <Sparkles size={17} />
          <p>
            {levelRules.find((x) => x[0] === level)?.[3]}{" "}
            {level === "2NF"
              ? "DepartmentName ကို ထပ်သိမ်းထားတာကို 3NF မှာ ပြင်မယ်။"
              : ""}
          </p>
        </div>
      </div>
      <div className="summary-actions">
        <button className="primary-button" onClick={downloadSummary}>
          <Download size={16} /> Lesson summary
        </button>
        <button className="secondary-button" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
      </div>
    </div>
  );
}
function Glossary({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (s: string) => void;
}) {
  const filtered = glossary.filter(([term, text]) =>
    `${term} ${text}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <div className="page-heading">
        <div className="eyebrow">
          <BookText size={14} /> BIG WORDS, LITTLE EXPLANATIONS
        </div>
        <h1>စကားလုံးလေးတွေ သိကြမယ်</h1>
        <p>ခက်တဲ့ စကားလုံးတွေအတွက် ရိုးရှင်းတဲ့ အဓိပ္ပာယ်လေးတွေ။</p>
      </div>
      <label className="glossary-search">
        <Search size={18} />
        <input
          autoFocus
          aria-label="Search glossary"
          placeholder="Search a word… ဥပမာ: Primary Key"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
      </label>
      <div className="glossary-grid">
        {filtered.map(([term, text], i) => (
          <div className="card glossary-card" key={term}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{term}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state card">
          <Search size={24} />
          <h3>ဒီစကားလုံး ရှာမတွေ့သေးပါ။</h3>
          <p>English term အတိုလေးနဲ့ ပြန်ရှာကြည့်ပါ။</p>
          <button className="secondary-button" onClick={() => setQuery("")}>
            စကားလုံး အားလုံးကြည့်မယ်
          </button>
        </div>
      )}
    </div>
  );
}
export default function App() {
  const [route, setRoute] = useState(readRoute);
  const { page, index } = route;
  const [progress, setProgress] = useState(readProgress);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("ponesan-theme") === "dark";
    } catch {
      return false;
    }
  });
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const searchDialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = () => setRoute(readRoute());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("ponesan-theme", dark ? "dark" : "light");
    } catch {
      setStorageError(true);
    }
  }, [dark]);
  useEffect(() => {
    try {
      localStorage.setItem("ponesan-progress", JSON.stringify(progress));
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  useEffect(() => {
    if (searchOpen) {
      searchDialog.current?.showModal();
      searchInput.current?.focus();
    } else searchDialog.current?.close();
  }, [searchOpen]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setMobile(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  function navigate(p: Page, i = 0) {
    setRoute({ page: p, index: i });
    window.location.hash = p === "lesson" ? `lesson/${i}` : p;
    setMobile(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function complete(i: number) {
    setProgress((p) => ({
      ...p,
      completed: [...new Set([...p.completed, i])],
    }));
  }
  function lessonNavigate(i: number) {
    if (i < 0) navigate("home");
    else if (i > 5) navigate("playground");
    else navigate("lesson", i);
  }
  const searchMatches = glossary.filter(([t, s]) =>
    `${t} ${s}`.toLowerCase().includes(query.toLowerCase()),
  );
  const current =
    page === "home"
      ? "Learning overview"
      : page === "lesson"
        ? lessons[index].title
        : page === "playground"
          ? "Practice playground"
          : page === "quiz"
            ? "Final quiz"
            : page === "comparison"
              ? "Compare the levels"
              : "Little glossary";
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          အကြောင်းအရာဆီ သွားမယ်
        </a>
        <Navbar
          page={page}
          index={index}
          completed={progress.completed}
          onNavigate={navigate}
          mobile={mobile}
          onClose={() => setMobile(false)}
        />
        <div className="main-shell">
          <header className="topbar">
            <div className="breadcrumb">
              <button
                className="mobile-menu icon-button"
                aria-label="Open navigation"
                onClick={() => setMobile(true)}
              >
                <Menu size={20} />
              </button>
              <span>Learning space</span>
              <ChevronRight size={13} />
              <strong>{current}</strong>
            </div>
            <div className="topbar-actions">
              <button
                className="search-trigger"
                aria-label="Search glossary"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(true);
                }}
              >
                <Search size={16} />
                <span>Find a little word</span>
                <kbd>/</kbd>
              </button>
              <span className="language-badge">မြန်မာ</span>
              <button
                className="icon-button theme-button"
                aria-label={
                  dark ? "Switch to light mode" : "Switch to dark mode"
                }
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span
                className="learner-avatar"
                title="ဒီစက်ထဲမှာ Progress သိမ်းထားတယ်"
              >
                Y
              </span>
            </div>
          </header>
          <main id="main-content" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${page}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {page === "home" && (
                  <>
                    <div className="overview-heading">
                      <div>
                        <div className="eyebrow">
                          A SMALL STEP INTO A CLEARER WORLD
                        </div>
                        <h1>
                          Learning, made simple<span>.</span>
                        </h1>
                        <p>ခက်တာလေးကို လွယ်လွယ်လေး သင်ယူကြမယ်။</p>
                      </div>
                      <div className="beginner-badge">
                        <i />
                        <span>Beginner friendly</span>
                        <Sparkles size={13} />
                      </div>
                    </div>
                    <section className="hero-card">
                      <div className="hero-copy">
                        <div className="hero-eyebrow">
                          <span className="tiny-symbol">✦</span> LET’S MAKE
                          SENSE OF DATA
                        </div>
                        <h2>Database Normalization ကို အလွယ်ဆုံးလေ့လာမယ်</h2>
                        <p>
                          Animation တွေကြည့်ရင်း Table တွေကို
                          ကိုယ်တိုင်ပြင်ကြမယ်
                        </p>
                        <div className="hero-actions">
                          <button
                            className="primary-button"
                            onClick={() =>
                              navigate(
                                "lesson",
                                Array.from({ length: 6 }, (_, i) => i).find(
                                  (i) => !progress.completed.includes(i),
                                ) ?? 0,
                              )
                            }
                          >
                            စတင်လေ့လာမယ် <ArrowRight size={17} />
                          </button>
                          <button
                            className="hero-play-button"
                            onClick={() => navigate("lesson", 3)}
                          >
                            <span>
                              <Play size={12} fill="currentColor" />
                            </span>{" "}
                            Animation ကြည့်မယ်
                          </button>
                        </div>
                        <div className="hero-meta">
                          <span>
                            <BookOpen size={13} /> 8 chapters
                          </span>
                          <i />
                          <span>
                            <Clock size={13} /> ~45 minutes
                          </span>
                          <i />
                          <span>အခမဲ့ · Account မလိုပါ</span>
                        </div>
                      </div>
                      <HeroIllustration />
                    </section>
                    <div className="journey-heading">
                      <div>
                        <span className="eyebrow">
                          ONE LITTLE STEP AT A TIME
                        </span>
                        <h2>Your learning journey</h2>
                      </div>
                      <span>{progress.completed.length} / 8 completed</span>
                    </div>
                    <div className="roadmap-grid">
                      {lessons.map((l, i) => {
                        const icons = [
                          BookOpen,
                          Layers,
                          Layers,
                          KeyRound,
                          GitBranch,
                          GitBranch,
                        ];
                        const Icon = icons[i];
                        return (
                          <motion.button
                            key={l.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                            className={`roadmap-card roadmap-${i} ${progress.completed.includes(i) ? "is-completed" : ""}`}
                            onClick={() => navigate("lesson", i)}
                          >
                            <div className="roadmap-top">
                              <span className={`roadmap-icon tone-${i}`}>
                                <Icon size={19} />
                              </span>
                              <span className="roadmap-index">
                                {progress.completed.includes(i) ? (
                                  <Check size={14} />
                                ) : (
                                  String(i + 1).padStart(2, "0")
                                )}
                              </span>
                            </div>
                            <h3>
                              {i === 0
                                ? "What is a Database?"
                                : i === 1
                                  ? "What is Normalization?"
                                  : `${["", "", "UNF", "1NF", "2NF", "3NF"][i]} · ${l.title}`}
                            </h3>
                            <p>{l.subtitle}</p>
                            <div className="roadmap-footer">
                              <span>
                                <Clock size={11} />
                                {l.duration}
                              </span>
                              <ArrowUpRight size={15} />
                            </div>
                          </motion.button>
                        );
                      })}
                      <motion.button
                        className="roadmap-card roadmap-practice"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.25, delay: 0.3 }}
                        onClick={() => navigate("playground")}
                      >
                        <div className="roadmap-top">
                          <span className="roadmap-icon tone-6">
                            <FlaskConical size={19} />
                          </span>
                          <span className="roadmap-index">
                            {progress.completed.includes(6) ? (
                              <Check size={14} />
                            ) : (
                              "07"
                            )}
                          </span>
                        </div>
                        <h3>Practice Playground</h3>
                        <p>ကိုယ်တိုင် Table စီကြည့်မယ်</p>
                        <div className="roadmap-footer">
                          <span>Hands-on learning</span>
                          <ArrowUpRight size={15} />
                        </div>
                      </motion.button>
                      <motion.button
                        className="roadmap-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.25, delay: 0.35 }}
                        onClick={() => navigate("quiz")}
                      >
                        <div className="roadmap-top">
                          <span className="roadmap-icon tone-7">
                            <Trophy size={19} />
                          </span>
                          <span className="roadmap-index">
                            {progress.completed.includes(7) ? (
                              <Check size={14} />
                            ) : (
                              "08"
                            )}
                          </span>
                        </div>
                        <h3>Final Quiz</h3>
                        <p>သိထားတာလေးတွေ စမ်းမယ်</p>
                        <div className="roadmap-footer">
                          <span>10 little questions</span>
                          <ArrowUpRight size={15} />
                        </div>
                      </motion.button>
                    </div>
                    <div className="home-intro-heading">
                      <div>
                        <h2>အရုပ်သေတ္တာလေးနဲ့ စကြမယ်</h2>
                        <p>Computer အကြောင်း မသိသေးလည်း ရပါတယ်။</p>
                      </div>
                      <span className="preview-pill">
                        A LITTLE SNEAK PEEK <ArrowDownIcon />
                      </span>
                    </div>
                    <LessonPlayer
                      preview
                      index={0}
                      onNavigate={lessonNavigate}
                      onComplete={complete}
                      completed={progress.completed.includes(0)}
                    />
                    <div className="home-bottom-card">
                      <div className="home-bottom-icon">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h3>အဆင့်တိုင်းမှာ “ဘာကြောင့်လဲ?” ကို သိမယ်</h3>
                        <p>
                          အကွက်လေးတွေ ခွဲတာကို ကြည့်ရုံနဲ့ မပြီးဘူး။
                          ဆက်နွယ်မှုကိုလည်း နားလည်မယ်။
                        </p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => navigate("comparison")}
                      >
                        အဆင့်တွေ နှိုင်းယှဉ်မယ် <ArrowRight size={15} />
                      </button>
                    </div>
                  </>
                )}
                {page === "lesson" && (
                  <LessonPlayer
                    key={index}
                    index={index}
                    onNavigate={lessonNavigate}
                    onComplete={complete}
                    completed={progress.completed.includes(index)}
                  />
                )}
                {page === "playground" && (
                  <NormalizationPlayground onComplete={() => complete(6)} />
                )}
                {page === "quiz" && (
                  <FinalQuiz
                    savedScore={progress.score}
                    onComplete={(score) =>
                      setProgress((p) => ({
                        ...p,
                        score,
                        completed: [...new Set([...p.completed, 7])],
                      }))
                    }
                  />
                )}
                {page === "comparison" && <Comparison />}
                {page === "glossary" && (
                  <Glossary query={query} setQuery={setQuery} />
                )}
              </motion.div>
            </AnimatePresence>
            {storageError && (
              <div className="notice" role="status">
                ဒီ Browser မှာ localStorage ပိတ်ထားလို့ Progress ကို သိမ်းမရပါ။
                ဒီစာမျက်နှာဖွင့်ထားချိန်မှာ ဆက်သုံးနိုင်ပါတယ်။
              </div>
            )}
            <footer className="main-footer">
              <span>
                <Heart size={12} /> Made for little moments of understanding.
              </span>
              <button onClick={downloadSummary}>
                <Download size={13} /> Download lesson summary
              </button>
              <span>ပုံစံ · NORMALIZATION LAB</span>
            </footer>
          </main>
        </div>
        <dialog
          ref={searchDialog}
          className="search-dialog"
          onCancel={() => setSearchOpen(false)}
          onClose={() => setSearchOpen(false)}
        >
          <div className="search-dialog-input">
            <Search size={19} />
            <input
              ref={searchInput}
              aria-label="Search technical terms"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ရှာချင်တဲ့ စကားလုံးလေး ရေးပါ…"
            />
            <button
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X size={19} />
            </button>
          </div>
          <div className="search-results">
            {searchMatches.map(([term, text]) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  navigate("glossary");
                }}
              >
                <strong>{term}</strong>
                <p>{text}</p>
                <ArrowUpRight size={14} />
              </button>
            ))}
            {!searchMatches.length && (
              <p className="empty-state">
                ရှာမတွေ့သေးပါ။ English term အတိုလေးနဲ့ ပြန်ရှာပါ။
              </p>
            )}
          </div>
          <div className="search-dialog-footer">
            <span>ESC to close</span>
            <span>BIG WORDS, SMALL EXPLANATIONS</span>
          </div>
        </dialog>
      </div>
    </MotionConfig>
  );
}
function ArrowDownIcon() {
  return <span aria-hidden="true">↓</span>;
}
