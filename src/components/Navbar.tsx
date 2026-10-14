import {
  BookOpen,
  LayoutDashboard,
  FlaskConical,
  Trophy,
  BookText,
  GitCompareArrows,
  ChevronRight,
  Check,
  Database,
  ArrowUpRight,
  X,
} from "lucide-react";
import { lessons } from "../data/lessons";
export type Page =
  "home" | "lesson" | "playground" | "quiz" | "comparison" | "glossary";
export default function Navbar({
  page,
  index,
  completed,
  onNavigate,
  mobile,
  onClose,
}: {
  page: Page;
  index: number;
  completed: number[];
  onNavigate: (p: Page, i?: number) => void;
  mobile: boolean;
  onClose: () => void;
}) {
  const progress = Math.round((completed.length / 8) * 100);
  return (
    <>
      <div
        className={`sidebar-backdrop ${mobile ? "show" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`sidebar ${mobile ? "mobile-open" : ""}`}
        aria-label="Learning navigation"
      >
        <button className="brand" onClick={() => onNavigate("home")}>
          <span className="brand-mark">
            <Database size={22} />
          </span>
          <span>
            ပုံစံ<small>NORMALIZATION LAB</small>
          </span>
        </button>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="sidebar-content">
          <button
            className={`nav-item overview-link ${page === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            <LayoutDashboard size={18} />
            <span>Learning overview</span>
            {page === "home" && <span className="active-dot" />}
          </button>
          <div className="nav-group-label">YOUR LEARNING PATH</div>
          <nav>
            {lessons.map((l, i) => (
              <button
                key={l.title}
                className={`nav-item lesson-nav ${page === "lesson" && index === i ? "active" : ""}`}
                onClick={() => onNavigate("lesson", i)}
              >
                <span
                  className={`nav-number ${completed.includes(i) ? "done" : ""}`}
                >
                  {completed.includes(i) ? (
                    <Check size={13} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  {i === 0
                    ? "Database basics"
                    : i === 1
                      ? "Normalization basics"
                      : i === 2
                        ? "Unnormalized Form"
                        : i === 3
                          ? "First Normal Form"
                          : i === 4
                            ? "Second Normal Form"
                            : "Third Normal Form"}
                  <small>
                    {i > 1
                      ? ["UNF", "1NF", "2NF", "3NF"][i - 2]
                      : ["အချက်အလက်တွေရဲ့ အိမ်", "စနစ်တကျ စီမယ်"][i]}
                  </small>
                </span>
                {page === "lesson" && index === i && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>
          <div className="nav-group-label practice-label">TRY IT YOURSELF</div>
          <button
            className={`nav-item ${page === "playground" ? "active" : ""}`}
            onClick={() => onNavigate("playground")}
          >
            <FlaskConical size={18} />
            <span>Practice playground</span>
            {completed.includes(6) && <Check size={14} />}
          </button>
          <button
            className={`nav-item ${page === "quiz" ? "active" : ""}`}
            onClick={() => onNavigate("quiz")}
          >
            <Trophy size={18} />
            <span>Final quiz</span>
            {completed.includes(7) && <Check size={14} />}
          </button>
          <div className="nav-divider" />
          <button
            className={`nav-item utility-nav ${page === "comparison" ? "active" : ""}`}
            onClick={() => onNavigate("comparison")}
          >
            <GitCompareArrows size={17} />
            <span>Compare the levels</span>
          </button>
          <button
            className={`nav-item utility-nav ${page === "glossary" ? "active" : ""}`}
            onClick={() => onNavigate("glossary")}
          >
            <BookText size={17} />
            <span>Little glossary</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <div>
              <span>Your little progress</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <i style={{ width: `${progress}%` }} />
            </div>
            <small>{completed.length} of 8 chapters completed</small>
          </div>
          <div className="sidebar-note">
            <span>✦</span>
            <strong>
              Small steps.
              <br />
              Big understanding.
            </strong>
            <p>တစ်ဆင့်ချင်း သင်ယူကြမယ်။</p>
            <BookOpen size={17} />
          </div>
          <div className="sidebar-footer">
            <span>MADE FOR CURIOUS MINDS</span>
            <ArrowUpRight size={12} />
          </div>
        </div>
      </aside>
    </>
  );
}
