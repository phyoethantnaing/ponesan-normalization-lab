import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { type Question, finalQuestions } from "../data/quizQuestions";
export function QuizCard({
  question,
  onCorrect,
  number,
}: {
  question: Question;
  onCorrect?: () => void;
  number?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [order, setOrder] = useState([2, 0, 3, 1]);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setSelected(null);
    setOrder([2, 0, 3, 1]);
    setChecked(false);
  }, [question.id]);
  const correct =
    question.type === "order"
      ? order.every((v, i) => v === i)
      : selected === question.answer;
  function answer(i: number) {
    if (checked && correct) return;
    setSelected(i);
    setChecked(true);
    if (i === question.answer) onCorrect?.();
  }
  function move(i: number, d: number) {
    const next = [...order];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setOrder(next);
    setChecked(false);
  }
  return (
    <section className="quiz-card">
      <div className="quiz-label">
        <Lightbulb size={16} /> LITTLE KNOWLEDGE CHECK{" "}
        {number && <span>{number}</span>}
      </div>
      <h3>{question.prompt}</h3>
      {question.type === "order" ? (
        <div className="order-options">
          {order.map((v, i) => (
            <div key={v}>
              <GripVertical size={14} />
              <span>{i + 1}</span>
              <strong>{question.options[v]}</strong>
              <button
                aria-label={`Move ${question.options[v]} up`}
                disabled={i === 0 || (checked && correct)}
                onClick={() => move(i, -1)}
              >
                <ArrowUp size={15} />
              </button>
              <button
                aria-label={`Move ${question.options[v]} down`}
                disabled={i === 3 || (checked && correct)}
                onClick={() => move(i, 1)}
              >
                <ArrowDown size={15} />
              </button>
            </div>
          ))}
          <button
            className="primary-button"
            disabled={checked && correct}
            onClick={() => {
              setChecked(true);
              if (correct) onCorrect?.();
            }}
          >
            အဖြေစစ်မယ် <CheckCircle2 size={15} />
          </button>
        </div>
      ) : (
        <div
          className={`quiz-options ${question.type === "cell" ? "cell-options" : ""}`}
        >
          {question.options.map((o, i) => (
            <button
              key={o}
              className={
                checked && selected === i ? (correct ? "right" : "wrong") : ""
              }
              onClick={() => answer(i)}
            >
              <span className="option-letter">
                {question.type === "match" ? "↗" : String.fromCharCode(65 + i)}
              </span>
              {o}
              {checked && selected === i && correct && (
                <CheckCircle2 size={17} />
              )}
            </button>
          ))}
        </div>
      )}
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`quiz-feedback ${correct ? "success" : "retry"}`}
          role="status"
        >
          <strong>
            {correct
              ? "✓ အရမ်းကောင်းတယ်။ မှန်ပါတယ်။"
              : "နီးလာပြီ။ နောက်တစ်ကြိမ် စဉ်းစားကြည့်ပါ။"}
          </strong>
          <p>{question.explanation}</p>
        </motion.div>
      )}
    </section>
  );
}
export function FinalQuiz({
  onComplete,
  savedScore,
}: {
  onComplete: (score: number) => void;
  savedScore: number | null;
}) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  function finish() {
    setDone(true);
    onComplete(correct.size);
  }
  return (
    <div className="final-quiz">
      <div className="page-heading">
        <div className="eyebrow">
          <Sparkles size={14} /> THE FINAL LITTLE ADVENTURE
        </div>
        <h1>သင်ယူထားတာတွေ စမ်းကြည့်မယ်</h1>
        <p>မေးခွန်း ၁၀ ခု။ အချိန်ကန့်သတ်ချက်မရှိပါ။ ဖြည်းဖြည်း စဉ်းစားပါ။</p>
      </div>
      {done ? (
        <div className="celebration card">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.i
              key={i}
              initial={{ y: 0, opacity: 1 }}
              animate={{
                y: [0, -80 - (i % 5) * 20, 100],
                x: (i - 10) * 22,
                rotate: i * 40,
                opacity: 0,
              }}
              transition={{ duration: 2, delay: i * 0.025 }}
              className={`confetti confetti-${i % 3}`}
            />
          ))}
          <div className="celebration-icon">✦</div>
          <h2>အရမ်းကောင်းတယ်။ သင်ယူပြီးပြီ။</h2>
          <div className="score">
            {correct.size}
            <span>/ 10</span>
          </div>
          <p>
            တစ်ကွက်၊ အချက်တစ်ခု။ ဆက်နွယ်မှုအလိုက် စီမယ်။ Key တွေနဲ့ ပြန်ဆက်မယ်။
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setDone(false);
              setIndex(0);
              setCorrect(new Set());
            }}
          >
            <RotateCcw size={16} /> ပြန်စမ်းမယ်
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-progress">
            <span>မေးခွန်း {index + 1} / 10</span>
            <span>{correct.size} correct</span>
            <div className="progress-track">
              <i style={{ width: `${(index / 10) * 100}%` }} />
            </div>
          </div>
          <QuizCard
            key={index}
            question={finalQuestions[index]}
            number={`${index + 1} / 10`}
            onCorrect={() => setCorrect((prev) => new Set(prev).add(index))}
          />
          <div className="lesson-bottom">
            <button
              className="secondary-button"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              ← နောက်ပြန်
            </button>
            {index < 9 ? (
              <button
                className="primary-button"
                onClick={() => setIndex(index + 1)}
              >
                နောက်မေးခွန်း <ArrowRight size={16} />
              </button>
            ) : (
              <button className="primary-button" onClick={finish}>
                ရလဒ်ကြည့်မယ် <Sparkles size={16} />
              </button>
            )}
          </div>
          {savedScore !== null && (
            <p className="muted">
              နောက်ဆုံးရမှတ်: {savedScore} / 10 · ဒီစက်ထဲမှာ သိမ်းထားပါတယ်။
            </p>
          )}
        </>
      )}
    </div>
  );
}
