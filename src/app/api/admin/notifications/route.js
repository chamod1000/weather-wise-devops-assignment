import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get('audience');
    
    const query = {
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };
    
    if (audience) {
      query.targetAudience = { $in: [audience, 'all'] };
    }

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, message, type, targetAudience, expiresAt } = await request.json();

    const notification = await Notification.create({
      title,
      message,
      type,
      targetAudience,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: admin._id,
    });

    await logAction(admin._id, 'ADMIN_ACTION', `Created notification: ${title}`);

    return NextResponse.json({ message: "Notification created", notification });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, ...updateData } = await request.json();

    const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true });

    await logAction(admin._id, 'ADMIN_ACTION', `Updated notification: ${notification.title}`);

    return NextResponse.json({ message: "Notification updated", notification });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await Notification.findByIdAndDelete(id);

    await logAction(admin._id, 'ADMIN_ACTION', 'Deleted notification');

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
