import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET as string; 

export const register = async (email: string, password: string, username: string) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = User.create({ email, password: hashedPassword, username: username });
  await user.save();

  return generateJWT(user.id, user.email);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return generateJWT(user.id, user.email);
};

const generateJWT = (userId: number, email: string) => {
  const payload = { userId, email };
  const token = jwt.sign(payload, JWT_SECRET); 
  return token;
};
