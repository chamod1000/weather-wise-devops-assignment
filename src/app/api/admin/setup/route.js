import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Please log in first" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    await User.findByIdAndUpdate(decoded.id, { role: 'admin' });

    return NextResponse.json({ message: "Success! You are now an Admin. Refresh the page." });
  } catch (error) {
    return NextResponse.json({ error: "One-time setup failed" }, { status: 500 });
  }
}
