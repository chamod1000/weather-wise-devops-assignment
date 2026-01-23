import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    await dbConnect();
    const body = await request.json();

    const updateData = {};
    if (body.name) updateData.name = body.name;
    if (body.gender) updateData.gender = body.gender;
    if (body.preferences) updateData.preferences = body.preferences;
    if (body.profilePicture !== undefined) updateData.profilePicture = body.profilePicture;
    if (body.password) {
        updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select('-password');
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
