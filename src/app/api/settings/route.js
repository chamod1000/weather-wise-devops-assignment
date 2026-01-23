import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SystemSetting from '@/models/SystemSetting';

export async function GET(request) {
  try {
    await dbConnect();
    const settings = await SystemSetting.find({ 
        key: { $in: ['announcement', 'maintenance_mode', 'registration_enabled'] } 
    });
    
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);

    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
