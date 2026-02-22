import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const logs = await ActivityLog.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(logs);

  } catch (error) {
    console.error("Activity Logs Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
