import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SystemSetting from '@/models/SystemSetting';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    
    const regSetting = await SystemSetting.findOne({ key: 'registration_enabled' });
    if (regSetting && regSetting.value === false) {
        return NextResponse.json({ error: "Registration is currently disabled" }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        savedCities: [] 
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
