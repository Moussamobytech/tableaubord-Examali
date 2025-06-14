import { db } from './db';
import bcrypt from 'bcrypt';

// 🔐 Inscription d’un nouvel utilisateur
export async function registerUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('Email déjà utilisé');
  }

  await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
}

// 🔑 Connexion utilisateur
export async function loginUser(email, password) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) throw new Error('Utilisateur non trouvé');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Mot de passe incorrect');

  return { id: user.id, name: user.name, email: user.email };
}
