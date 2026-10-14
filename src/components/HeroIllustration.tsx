import { motion, useReducedMotion } from "framer-motion";
import { KeyRound, ArrowDown, Check, Table2, Sparkles } from "lucide-react";
export default function HeroIllustration() {
  const reduced = useReducedMotion();
  return (
    <div
      className="hero-illustration"
      aria-label="One messy list becomes related organized tables"
    >
      <div className="illustration-grid" />
      <motion.div
        className="floating-note note-one"
        animate={{ y: reduced ? 0 : [0, -5, 0], rotate: -8 }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles size={14} /> a little more organized
      </motion.div>
      <motion.div
        className="illustration-table original"
        animate={{ y: reduced ? 0 : [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div>
          <Table2 size={13} />
          <strong>One messy list</strong>
          <span className="unf-tag">UNF</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aung Aung</td>
              <td>
                <span>Math</span>
                <span>English</span>
              </td>
            </tr>
            <tr>
              <td>Su Su</td>
              <td>
                <span>Science</span>
                <span>Math</span>
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>
      <div className="illustration-flow">
        <div />
        <span>
          <ArrowDown size={17} />
        </span>
        <div />
      </div>
      <div className="mini-tables">
        <motion.div
          className="illustration-table mini-students"
          animate={{ y: reduced ? 0 : [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div>
            <Table2 size={12} />
            <strong>Students</strong>
            <Check size={12} />
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  <KeyRound size={10} /> ID
                </th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>S01</td>
                <td>Aung Aung</td>
              </tr>
              <tr>
                <td>S02</td>
                <td>Su Su</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
        <motion.div
          className="illustration-table mini-courses"
          animate={{ y: reduced ? 0 : [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div>
            <Table2 size={12} />
            <strong>Courses</strong>
            <Check size={12} />
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  <KeyRound size={10} /> ID
                </th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C01</td>
                <td>Math</td>
              </tr>
              <tr>
                <td>C02</td>
                <td>English</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
      <div className="illustration-caption">
        <i /> Connected through Enrollments <span>↗</span>
      </div>
      <motion.div
        className="floating-note note-two"
        animate={{ y: reduced ? 0 : [0, 4, 0], rotate: 6 }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Check size={12} /> everything has a home
      </motion.div>
    </div>
  );
}
