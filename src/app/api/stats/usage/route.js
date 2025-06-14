import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily";

    let query, params;
    if (period === "weekly") {
      query = `
        SELECT DATE_FORMAT(lastActive, '%Y-%m-%d') as label, COUNT(*) as count
        FROM users
        WHERE lastActive >= NOW() - INTERVAL 7 DAY
        GROUP BY DATE_FORMAT(lastActive, '%Y-%m-%d')
        ORDER BY label
      `;
      params = [];
    } else {
      query = `
        SELECT HOUR(lastActive) as label, COUNT(*) as count
        FROM users
        WHERE lastActive >= NOW() - INTERVAL 24 HOUR
        GROUP BY HOUR(lastActive)
        ORDER BY label
      `;
      params = [];
    }

    const [rows] = await db.query(query, params);
    const labels = period === "daily" ? Array.from({ length: 24 }, (_, i) => `${i}h`) : rows.map((r) => r.label);
    const data = period === "daily" ? Array(24).fill(0) : [];

    rows.forEach((row) => {
      if (period === "daily") {
        data[parseInt(row.label)] = row.count;
      } else {
        data.push(row.count);
      }
    });

    return NextResponse.json({ labels, data: data }, { status: 200 });
  } catch (error) {
    console.error("Usage Stats Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des données d'utilisation." }, { status: 500 });
  }
}