// import { NextResponse } from 'next/server';
// import { db } from '../../../lib/db';

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');

//     if (!userId) {
//       return NextResponse.json({ error: 'L’utilisateur est requis.' }, { status: 400 });
//     }

//     const [rows] = await db.query(
//       `
//         SELECT 
//           scores.id AS scoreId,
//           sujet.name AS name,
//           scores.userId,
//           scores.subjectId,
//           scores.score,
//           DATE_FORMAT(scores.date, '%Y-%m-%d') AS date
//         FROM scores
//         JOIN sujet ON scores.subjectId = sujet.id
//         WHERE scores.userId = ?
//         ORDER BY scores.date DESC
//       `,
//       [userId]
//     );

//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching scores:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de la récupération des scores.' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'L’utilisateur est requis.' }, { status: 400 });
    }

    const [rows] = await db.query(
      `
        SELECT 
          scores.id AS scoreId,
          sujet.name AS name,
          scores.userId,
          scores.subjectId,
          scores.score,
          DATE_FORMAT(scores.date, '%Y-%m-%d') AS date
        FROM scores
        JOIN sujet ON scores.subjectId = sujet.id
        WHERE scores.userId = ?
        ORDER BY scores.date DESC
      `,
      [userId]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scores.' },
      { status: 500 }
    );
  }
}