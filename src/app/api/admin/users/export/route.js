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
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Convert to CSV
    const headers = ['Name', 'Email', 'Role', 'Gender', 'Status', 'Saved Cities', 'Last Login', 'Created At'];
    const csvRows = [headers.join(',')];

    users.forEach(user => {
      const row = [
        user.name,
        user.email,
        user.role,
        user.gender || '',
        user.isBanned ? 'Banned' : 'Active',
        user.savedCities?.length || 0,
        user.lastLogin ? new Date(user.lastLogin).toISOString() : '',
        new Date(user.createdAt).toISOString()
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${Date.now()}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
