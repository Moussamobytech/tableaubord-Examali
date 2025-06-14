import { NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      `
      SELECT u.id, u.name, AVG(s.score) as averageScore
      FROM users u
      JOIN scores s ON u.id = s.userId
      GROUP BY u.id, u.name
      ORDER BY averageScore DESC
      LIMIT 5
    `
    );

    const leaders = rows.map((row) => ({
      id: row.id,
      name: row.name,
      score: parseFloat(row.averageScore).toFixed(1),
      avatar: null, // Add avatar URL if available
    }));

    return NextResponse.json(leaders, { status: 200 });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération du classement." }, { status: 500 });
  }
}