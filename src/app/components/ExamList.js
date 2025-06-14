// components/ExamList.js
"use client"; // App Router Next.js 13 si vous utilisez des hooks

import { useEffect, useState } from "react";

export default function ExamList() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des Examens</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>
            {exam.name} - {exam.date} ({exam.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
