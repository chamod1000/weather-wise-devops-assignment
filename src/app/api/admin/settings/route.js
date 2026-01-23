import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SystemSetting from '@/models/SystemSetting';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper to check auth
async function checkAuth(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
        throw new Error("Forbidden");
    }
    return user;
}

export async function GET(request) {
  try {
    await checkAuth(request);
    await dbConnect();
    
    // Get all settings
    const settings = await SystemSetting.find({});
    
    // Transform to object for easier consumption
    const settingsMap = {};
    settings.forEach(s => {
        settingsMap[s.key] = s.value;
    });

    // Defaults if not set
    if (settingsMap['registration_enabled'] === undefined) settingsMap['registration_enabled'] = true;
    if (settingsMap['maintenance_mode'] === undefined) settingsMap['maintenance_mode'] = false;
    if (settingsMap['announcement'] === undefined) settingsMap['announcement'] = "";

    return NextResponse.json(settingsMap);
  } catch (error) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const admin = await checkAuth(request);
        const body = await request.json();
        
        await dbConnect();

        // Update each setting provided
        for (const [key, value] of Object.entries(body)) {
            await SystemSetting.findOneAndUpdate(
                { key },
                { key, value },
                { upsert: true, new: true }
            );
        }

        await logAction(admin._id, 'ADMIN_ACTION', 'Updated system settings');

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (error.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
