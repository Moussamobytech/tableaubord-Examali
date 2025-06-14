import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const [[{ connectedUsers }]] = await db.query("SELECT COUNT(*) as connectedUsers FROM users WHERE lastActive > NOW() - INTERVAL 1 HOUR");
    const [[{ examsCompleted }]] = await db.query("SELECT COUNT(*) as examsCompleted FROM scores");
    const [[{ averageScore }]] = await db.query("SELECT AVG(score) as averageScore FROM scores");
    const [[{ activeCourses }]] = await db.query("SELECT COUNT(*) as activeCourses FROM sujet WHERE date >= NOW() - INTERVAL 1 YEAR");

    return NextResponse.json(
      {
        connectedUsers: connectedUsers || 0,
        examsCompleted: examsCompleted || 0,
        averageScore: averageScore || 0,
        activeCourses: activeCourses || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques." }, { status: 500 });
  }
}