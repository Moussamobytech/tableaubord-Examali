

// import { NextResponse } from 'next/server';
// import { db } from '../../../lib/db';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs/promises';

// // Configure multer for file uploads
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: async (req, file, cb) => {
//       const dir = path.join(process.cwd(), 'public/Uploads');
//       await fs.mkdir(dir, { recursive: true });
//       cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
//       cb(null, uniqueName);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Seuls les fichiers PDF sont autorisés.'), false);
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // Middleware to handle multipart/form-data
// const runMiddleware = (req, res, fn) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// };

// export async function GET(request) {
//   try {
//     const [rows] = await db.query('SELECT id, name, description, date, year, filePath FROM sujet ORDER BY date DESC');
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la récupération des sujets.' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const name = formData.get('name');
//     const description = formData.get('description') || null;
//     const date = formData.get('date');
//     const year = parseInt(formData.get('year'));
//     const file = formData.get('file');

//     if (!name || !date || !year) {
//       return NextResponse.json({ error: 'Les champs nom, date et année sont requis.' }, { status: 400 });
//     }

//     let filePath = null;
//     if (file) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
//       const fileDir = path.join(process.cwd(), 'public/Uploads');
//       await fs.mkdir(fileDir, { recursive: true });
//       const fullPath = path.join(fileDir, uniqueName);
//       await fs.writeFile(fullPath, buffer);
//       filePath = `/Uploads/${uniqueName}`;
//     }

//     const [result] = await db.query(
//       'INSERT INTO sujet (name, description, date, year, filePath) VALUES (?, ?, ?, ?, ?)',
//       [name, description, date, year, filePath]
//     );

//     const newSubject = { id: result.insertId, name, description, date, year, filePath };
//     return NextResponse.json(newSubject, { status: 201 });
//   } catch (error) {
//     console.error('POST Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la création du sujet.' }, { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     const formData = await request.formData();
//     const id = formData.get('id');
//     const name = formData.get('name');
//     const description = formData.get('description') || '';
//     const date = formData.get('date');
//     const year = parseInt(formData.get('year'));
//     const file = formData.get('file');

//     if (!id || !name || !date || !year) {
//       return NextResponse.json({ error: 'Les champs id, nom, date et année sont requis.' }, { status: 400 });
//     }

//     let filePath = null;
//     const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
//     if (file && file instanceof File) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
//       const fileDir = path.join(process.cwd(), 'public/Uploads');
//       await fs.mkdir(fileDir, { recursive: true });
//       const fullPath = path.join(fileDir, uniqueName);
//       await fs.writeFile(fullPath, buffer);
//       filePath = `/Uploads/${uniqueName}`;

//       // Delete old file if exists
//       if (existing[0]?.filePath) {
//         const oldPath = path.join(process.cwd(), 'public', existing[0].filePath);
//         await fs.unlink(oldPath).catch(() => null);
//       }
//     } else {
//       filePath = existing[0]?.filePath || null;
//     }

//     await db.query(
//       'UPDATE sujet SET name = ?, description = ?, year = ?, date = ?, filePath = ? WHERE id = ?',
//       [name, description, date, year, filePath, id]
//     );

//     const updatedSubject = { id, name, description, date, year, filePath };
//     return NextResponse.json(updatedSubject, { status: 200 });
//   } catch (error) {
//     console.error('PUT Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la modification du sujet.' }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'id est requis.' }, { status: 400 });
//     }

//     const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
//     await db.query('DELETE FROM scores WHERE subjectId = ?', [id]);
//     const [result] = await db.query('DELETE FROM sujet WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
//     }

//     // Delete file if exists
//     if (existing[0]?.filePath) {
//       const filePath = path.join(process.cwd(), 'public', existing[0].filePath);
//       await fs.unlink(filePath).catch(() => null);
//     }

//     return NextResponse.json({ message: 'Sujet supprimé.' }, { status: 200 });
//   } catch (error) {
//     console.error('DELETE Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la suppression du sujet.' }, { status: 500 });
//   }
// }





// import { NextResponse } from 'next/server';
// import { db } from '../../../lib/db';
// import path from 'path';
// import fs from 'fs/promises';

// const uploadDir = path.join(process.cwd(), 'public/Uploads');

// export async function GET(request) {
//   try {
//     const [rows] = await db.query(
//       'SELECT id, name, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, year, filePath FROM sujet ORDER BY date DESC'
//     );
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     console.error('GET Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la récupération des sujets.' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const name = formData.get('name');
//     const description = formData.get('description') || null;
//     const date = formData.get('date');
//     const year = parseInt(formData.get('year'));
//     const file = formData.get('file');
//     const userId = formData.get('userId');

//     if (!name || !date || !year || !userId) {
//       return NextResponse.json({ error: 'Les champs nom, date, année, et userId sont requis.' }, { status: 400 });
//     }

//     let filePath = null;
//     if (file && file instanceof File) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
//       await fs.mkdir(uploadDir, { recursive: true });
//       const fullPath = path.join(uploadDir, uniqueName);
//       await fs.writeFile(fullPath, buffer);
//       filePath = `/Uploads/${uniqueName}`;
//     }

//     const [result] = await db.query(
//       'INSERT INTO sujet (name, description, date, year, filePath) VALUES (?, ?, ?, ?, ?)',
//       [name, description, date, year, filePath]
//     );

//     const subjectId = result.insertId;

//     // Initialize a default score
//     await db.query(
//       'INSERT INTO scores (id, userId, subjectId, score, date) VALUES (UUID(), ?, ?, ?, ?)',
//       [userId, subjectId, 0, date]
//     );

//     const newSubject = { id: subjectId, name, description, date, year, filePath };
//     return NextResponse.json(newSubject, { status: 201 });
//   } catch (error) {
//     console.error('POST Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la création du sujet.' }, { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     const formData = await request.formData();
//     const id = formData.get('id');
//     const name = formData.get('name');
//     const description = formData.get('description') || null;
//     const date = formData.get('date');
//     const year = parseInt(formData.get('year'));
//     const file = formData.get('file');

//     if (!id || !name || !date || !year) {
//       return NextResponse.json({ error: 'Les champs id, nom, date et année sont requis.' }, { status: 400 });
//     }

//     let filePath = null;
//     const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
//     if (file && file instanceof File) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
//       await fs.mkdir(uploadDir, { recursive: true });
//       const fullPath = path.join(uploadDir, uniqueName);
//       await fs.writeFile(fullPath, buffer);
//       filePath = `/Uploads/${uniqueName}`;

//       if (existing[0]?.filePath) {
//         const oldPath = path.join(process.cwd(), 'public', existing[0].filePath);
//         await fs.unlink(oldPath).catch(() => null);
//       }
//     } else {
//       filePath = existing[0]?.filePath || null;
//     }

//     const [result] = await db.query(
//       'UPDATE sujet SET name = ?, description = ?, date = ?, year = ?, filePath = ? WHERE id = ?',
//       [name, description, date, year, filePath, id]
//     );

//     if (result.affectedRows === 0) {
//       return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
//     }

//     const updatedSubject = { id, name, description, date, year, filePath };
//     return NextResponse.json(updatedSubject, { status: 200 });
//   } catch (error) {
//     console.error('PUT Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la modification du sujet.' }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'id est requis.' }, { status: 400 });
//     }

//     const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
//     await db.query('DELETE FROM scores WHERE subjectId = ?', [id]);
//     const [result] = await db.query('DELETE FROM sujet WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
//     }

//     if (existing[0]?.filePath) {
//       const filePath = path.join(process.cwd(), 'public', existing[0].filePath);
//       await fs.unlink(filePath).catch(() => null);
//     }

//     return NextResponse.json({ message: 'Sujet supprimé.' }, { status: 200 });
//   } catch (error) {
//     console.error('DELETE Error:', error);
//     return NextResponse.json({ error: 'Erreur lors de la suppression du sujet.' }, { status: 500 });
//   }
// }




// pages/api/sujet.js (Next.js API route)
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import path from 'path';
import fs from 'fs/promises';

const uploadDir = path.join(process.cwd(), 'public/Uploads');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single subject by ID
      const [rows] = await db.query(
        'SELECT id, name, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, year, filePath FROM sujet WHERE id = ?',
        [id]
      );
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
      }
      return NextResponse.json(rows[0], { status: 200 });
    }

    // Fetch all subjects
    const [rows] = await db.query(
      'SELECT id, name, description, DATE_FORMAT(date, "%Y-%m-%d") AS date, year, filePath FROM sujet ORDER BY date DESC'
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des sujets.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description') || null;
    const date = formData.get('date');
    const year = parseInt(formData.get('year'));
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!name || !date || !year || !userId) {
      return NextResponse.json({ error: 'Les champs nom, date, année, et userId sont requis.' }, { status: 400 });
    }

    let filePath = null;
    if (file && file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      await fs.mkdir(uploadDir, { recursive: true });
      const fullPath = path.join(uploadDir, uniqueName);
      await fs.writeFile(fullPath, buffer);
      filePath = `/Uploads/${uniqueName}`;
    }

    const [result] = await db.query(
      'INSERT INTO sujet (name, description, date, year, filePath) VALUES (?, ?, ?, ?, ?)',
      [name, description, date, year, filePath]
    );

    const subjectId = result.insertId;

    // Initialize a default score
    await db.query(
      'INSERT INTO scores (id, userId, subjectId, score, date) VALUES (UUID(), ?, ?, ?, ?)',
      [userId, subjectId, 0, date]
    );

    const newSubject = { id: subjectId, name, description, date, year, filePath };
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du sujet.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const description = formData.get('description') || null;
    const date = formData.get('date');
    const year = parseInt(formData.get('year'));
    const file = formData.get('file');

    if (!id || !name || !date || !year) {
      return NextResponse.json({ error: 'Les champs id, nom, date et année sont requis.' }, { status: 400 });
    }

    let filePath = null;
    const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
    if (file && file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      await fs.mkdir(uploadDir, { recursive: true });
      const fullPath = path.join(uploadDir, uniqueName);
      await fs.writeFile(fullPath, buffer);
      filePath = `/Uploads/${uniqueName}`;

      if (existing[0]?.filePath) {
        const oldPath = path.join(process.cwd(), 'public', existing[0].filePath);
        await fs.unlink(oldPath).catch(err => console.error('Failed to delete old file:', err));
      }
    } else {
      filePath = existing[0]?.filePath || null;
    }

    const [result] = await db.query(
      'UPDATE sujet SET name = ?, description = ?, date = ?, year = ?, filePath = ? WHERE id = ?',
      [name, description, date, year, filePath, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
    }

    const updatedSubject = { id, name, description, date, year, filePath };
    return NextResponse.json(updatedSubject, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification du sujet.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id est requis.' }, { status: 400 });
    }

    const [existing] = await db.query('SELECT filePath FROM sujet WHERE id = ?', [id]);
    await db.query('DELETE FROM scores WHERE subjectId = ?', [id]);
    const [result] = await db.query('DELETE FROM sujet WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Sujet non trouvé.' }, { status: 404 });
    }

    if (existing[0]?.filePath) {
      const filePath = path.join(process.cwd(), 'public', existing[0].filePath);
      await fs.unlink(filePath).catch(err => console.error('Failed to delete file:', err));
    }

    return NextResponse.json({ message: 'Sujet supprimé.' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du sujet.' }, { status: 500 });
  }
}