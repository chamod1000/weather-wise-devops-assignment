import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

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

    const { userIds, action } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Invalid user IDs" }, { status: 400 });
    }

    let result;
    
    switch(action) {
      case 'ban':
        result = await User.updateMany(
          { _id: { $in: userIds }, _id: { $ne: admin._id } },
          { $set: { isBanned: true } }
        );
        await logAction(admin._id, 'ADMIN_ACTION', `Bulk banned ${result.modifiedCount} users`);
        break;
        
      case 'unban':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isBanned: false } }
        );
        await logAction(admin._id, 'ADMIN_ACTION', `Bulk unbanned ${result.modifiedCount} users`);
        break;
        
      case 'delete':
        result = await User.deleteMany({
          _id: { $in: userIds }, 
          _id: { $ne: admin._id },
          role: { $ne: 'admin' }
        });
        await logAction(admin._id, 'ADMIN_ACTION', `Bulk deleted ${result.deletedCount} users`);
        break;
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: `Action completed on ${result.modifiedCount || result.deletedCount} users` 
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
