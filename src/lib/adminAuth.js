"use client";
// Client-side utility functions for admin authentication and authorization

// Check if a user object has admin role
export function isAdmin(user) {
  return user && user.role === 'admin';
}

// Check if user is admin on client side
export function checkAdminAccess(user) {
  if (!user || user.role !== 'admin') {
    window.location.href = '/';
    return false;
  }
  return true;
}
