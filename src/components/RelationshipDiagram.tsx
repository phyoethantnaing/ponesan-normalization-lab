import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link2, ArrowRight, Check } from "lucide-react";
export default function RelationshipDiagram({
  department = false,
}: {
  department?: boolean;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const links = [
    ...(department
      ? [
          [
            "Students.DepartmentID",
            "Departments.DepartmentID",
            "ကလေးရဲ့ ဌာန ID နဲ့ ဌာနနာမည်ကို ရှာမယ်။",
          ],
        ]
      : []),
    [
      "Enrollments.StudentID",
      "Students.StudentID",
      "S01 ကို Students မှာ ရှာရင် Aung Aung ကို ရမယ်။",
    ],
    [
      "Enrollments.CourseID",
      "Courses.CourseID",
      "C01 ကို Courses မှာ ရှာရင် Math ကို ရမယ်။",
    ],
  ];
  return (
    <div className="relationship-diagram">
      <div className="eyebrow">
        <Link2 size={13} /> FOLLOW THE CONNECTION
      </div>
      <div className="relationship-links">
        {links.map((l, i) => (
          <button
            key={l[0]}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <span>
              {l[0]} <small>FK</small>
            </span>
            <motion.span
              animate={{ x: reduced ? 0 : active === i ? [0, 5, 0] : 0 }}
              transition={{
                duration: 1.2,
                repeat: active === i ? Infinity : 0,
              }}
            >
              <ArrowRight size={18} />
            </motion.span>
            <span>
              {l[1]} <small>PK</small>
            </span>
          </button>
        ))}
      </div>
      <p>
        <Check size={13} />
        {links[active][2]}
      </p>
    </div>
  );
}
