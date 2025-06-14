import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      `
      SELECT 'user' as type, id, 'Nouvel utilisateur inscrit' as description, createdAt as timestamp
      FROM users
      WHERE createdAt >= NOW() - INTERVAL 1 DAY
      UNION
      SELECT 'exam', id, CONCAT('Examen soumis pour ', s.name) as description, createdAt as timestamp
      FROM scores q
      JOIN sujet s ON scores.subjectId = s.id
      WHERE scores.createdAt >= NOW() - INTERVAL 1 DAY
      ORDER BY timestamp DESC
      LIMIT 10
    `
    );

    const activities = rows.map((row) => ({
      id: row.id,
      type: row.type,
      message: row.description}`,
      scores: new Date(row.createdAt).toISOString(),
      icon: row.type === "user" ? UserPlusIcon : DocumentArrowUpIcon,
      color: row.type === "user" ? "bg-blue-500" : "bg-green-500",
    }));

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Activities Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des activités." }, { status: 500 });
  }
}