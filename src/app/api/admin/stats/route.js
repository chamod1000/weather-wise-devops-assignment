import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalUsers = await User.countDocuments();
    
    const users = await User.find({}, 'savedCities');
    const totalFavorites = users.reduce((acc, u) => acc + (u.savedCities?.length || 0), 0);

    return NextResponse.json({
        totalUsers,
        totalFavorites,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
