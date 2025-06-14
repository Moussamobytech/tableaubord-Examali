import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT id, message, createdAt as timestamp FROM notifications WHERE createdAt >= NOW() - INTERVAL 7 DAY ORDER BY createdAt DESC LIMIT 5"
    );
    return NextResponse.json(
      rows.map((row) => ({
        id: row.id,
        message: row.message,
        timestamp: new Date(row.createdAt).toISOString(),
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Notifications Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des notifications." }, { status: 500 });
  }
}