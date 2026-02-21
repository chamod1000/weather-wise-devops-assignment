'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { isAdmin } from '@/lib/adminAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    expiresAt: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isAdmin(user)) {
      router.push('/');
    } else {
      fetchNotifications();
    }
  }, [user, router]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/admin/notifications');
      setNotifications(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotif) {
        await axios.put('/api/admin/notifications', { id: editingNotif._id, ...formData });
        toast.success('Notification updated successfully');
      } else {
        await axios.post('/api/admin/notifications', formData);
        toast.success('Notification created successfully');
      }
      setShowModal(false);
      setEditingNotif(null);
      setFormData({ title: '', message: '', type: 'info', targetAudience: 'all', expiresAt: '' });
      fetchNotifications();
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error('Failed to save notification');
    }
  };

  const handleEdit = (notif) => {
    setEditingNotif(notif);
    setFormData({
      title: notif.title,
      message: notif.message,
      type: notif.type,
      targetAudience: notif.targetAudience,
      expiresAt: notif.expiresAt ? new Date(notif.expiresAt).toISOString().slice(0, 16) : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await axios.delete(`/api/admin/notifications?id=${id}`);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const toggleActive = async (notif) => {
    try {
      await axios.put('/api/admin/notifications', {
        id: notif._id,
        isActive: !notif.isActive,
      });
      toast.success(`Notification ${!notif.isActive ? 'activated' : 'deactivated'}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error toggling notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[type] || colors.info;
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <button
          onClick={() => {
            setEditingNotif(null);
            setFormData({ title: '', message: '', type: 'info', targetAudience: 'all', expiresAt: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Total Notifications</h3>
          <p className="text-3xl font-bold mt-2">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Active</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {notifications.filter(n => n.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Inactive</h3>
          <p className="text-3xl font-bold mt-2 text-gray-600">
            {notifications.filter(n => !n.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm">Expired</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {notifications.filter(n => n.expiresAt && new Date(n.expiresAt) < new Date()).length}
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{notif.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notif.type)}`}>
                      {notif.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${notif.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {notif.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notif.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Audience: <strong>{notif.targetAudience}</strong></span>
                    <span>Created: {new Date(notif.createdAt).toLocaleDateString()}</span>
                    {notif.expiresAt && (
                      <span className={new Date(notif.expiresAt) < new Date() ? 'text-red-600' : ''}>
                        Expires: {new Date(notif.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(notif)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {notif.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(notif)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No notifications yet
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingNotif ? 'Edit Notification' : 'Create Notification'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Users</option>
                    <option value="users">Users Only</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNotif(null);
                    setFormData({ title: '', message: '', type: 'info', targetAudience: 'all', expiresAt: '' });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingNotif ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
