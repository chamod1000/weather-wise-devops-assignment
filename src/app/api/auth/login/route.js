import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (user.isBanned) {
        return NextResponse.json({ error: "Account suspended. Contact support." }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    await logAction(user._id, 'LOGIN', 'User logged in');
    
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ 
        message: "Logged in successfully",
        user: { name: user.name, email: user.email, preferences: user.preferences }
    });
    
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
