import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
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
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await ContactMessage.find({})
      .populate('repliedBy', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    const { id, status, reply, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    if (reply) {
      updateData.reply = reply;
      updateData.repliedBy = admin._id;
      updateData.repliedAt = new Date();
      updateData.status = 'replied';
    }

    const message = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true })
      .populate('repliedBy', 'name email');

    await logAction(admin._id, 'ADMIN_ACTION', `Updated message status to ${status || 'replied'}`);

    return NextResponse.json({ message: "Message updated", data: message });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    await ContactMessage.findByIdAndDelete(id);
    await logAction(admin._id, 'ADMIN_ACTION', 'Deleted contact message');

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}