import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FeaturedCity from '@/models/FeaturedCity';
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

    const cities = await FeaturedCity.find().sort({ order: 1, createdAt: -1 });
    
    // Get popular cities from user savedCities
    const users = await User.find({}, 'savedCities');
    const cityStats = {};
    users.forEach(u => {
      u.savedCities?.forEach(city => {
        const cityName = city.name || city;
        cityStats[cityName] = (cityStats[cityName] || 0) + 1;
      });
    });
    
    const popularCities = Object.entries(cityStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({ featured: cities, popular: popularCities });
  } catch (error) {
    console.error('Locations error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
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

    const { name, country, description, imageUrl } = await request.json();

    const city = await FeaturedCity.create({
      name,
      country,
      description,
      imageUrl,
    });

    await logAction(admin._id, 'ADMIN_ACTION', `Added featured city: ${name}`);

    return NextResponse.json({ message: "City added", city });
  } catch (error) {
    console.error('Add city error:', error);
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

    const city = await FeaturedCity.findByIdAndUpdate(id, updateData, { new: true });

    await logAction(admin._id, 'ADMIN_ACTION', `Updated featured city: ${city.name}`);

    return NextResponse.json({ message: "City updated", city });
  } catch (error) {
    console.error('Update city error:', error);
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

    const city = await FeaturedCity.findByIdAndDelete(id);

    await logAction(admin._id, 'ADMIN_ACTION', `Deleted featured city: ${city.name}`);

    return NextResponse.json({ message: "City deleted" });
  } catch (error) {
    console.error('Delete city error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
