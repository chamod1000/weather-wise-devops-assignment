import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

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

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users, total: users.length });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isBanned } = await request.json();

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (id === admin._id.toString()) {
        return NextResponse.json({ error: "Cannot ban yourself" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { isBanned }, { new: true });
    
    await logAction(admin._id, 'ADMIN_ACTION', `${isBanned ? 'Banned' : 'Unbanned'} user ${updatedUser.email}`);

    return NextResponse.json({ message: "User status updated", user: updatedUser });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userIdToDelete = searchParams.get('id');

    if(!userIdToDelete) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (userIdToDelete === admin._id.toString()) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await User.findByIdAndDelete(userIdToDelete);
    return NextResponse.json({ message: "User deleted" });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, role } = await request.json();

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (id === admin._id.toString()) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    
    await logAction(admin._id, 'ADMIN_ACTION', `Changed role of user ${updatedUser.email} to ${role}`);

    return NextResponse.json({ message: "User role updated", user: updatedUser });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
