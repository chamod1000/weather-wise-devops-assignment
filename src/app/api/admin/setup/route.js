import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * Auto-Setup Admin Account
 * 
 * This endpoint creates a default admin account if it doesn't exist.
 * 
 * Default credentials:
 * Email: admin@gmail.com
 * Password: admin1234
 * 
 * Usage: Visit /api/admin/setup to create the admin account
 * 
 * IMPORTANT: Change these credentials after first login!
 */

export async function GET() {
  try {
    await dbConnect();
    
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin1234';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingAdmin.role = 'admin';
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        
        return NextResponse.json({ 
          success: true,
          message: "Admin account updated successfully!",
          credentials: {
            email: adminEmail,
            password: adminPassword,
            url: `/admin`
          }
        });
      }
      
      return NextResponse.json({ 
        success: true,
        message: "Admin account already exists!",
        credentials: {
          email: adminEmail,
          password: adminPassword,
          url: `/admin`
        }
      });
    }
    
    // Create new admin account
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      gender: 'other',
      isBanned: false,
      preferences: {
        unit: 'C'
      },
      savedCities: []
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Admin account created successfully!",
      credentials: {
        email: adminEmail,
        password: adminPassword,
        url: `/admin`
      },
      warning: "⚠️ IMPORTANT: Change these credentials after first login!"
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to setup admin account",
      details: error.message 
    }, { status: 500 });
  }
}
