import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const getUserId = (req) => {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    } catch (e) { return null; }
};

export async function GET(request) {
  try {
    await dbConnect();
    const userId = getUserId(request);
    
    if (userId) {
        const user = await User.findById(userId);
        return NextResponse.json(user.savedCities || []);
    } else {
        return NextResponse.json([]); 
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return NextResponse.json(
      { error: 'Failed to fetch cities. Check MongoDB IP Whitelist.' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const userId = getUserId(request);
    
    if (!userId) return NextResponse.json({ error: "Please login to save favorites" }, { status: 401 });

    const body = await request.json();

    // Add to user array if not exists
    await User.findByIdAndUpdate(userId, {
        $addToSet: { savedCities: { name: body.name } } 
    });
    
    return NextResponse.json({ message: "Saved" }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: 'Failed to add city. Check DB Connection.' }, { status: 500 });
  }
}

// delete a city (DELETE)
export async function DELETE(request) {
  try {
    await dbConnect();
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('name'); // Changed to delete by name for array

    await User.findByIdAndUpdate(userId, {
        $pull: { savedCities: { name: cityName } }
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}