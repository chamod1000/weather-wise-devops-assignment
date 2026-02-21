"use client";
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Trash2, Search, User, Ban, CheckCircle, Shield, ShieldOff, Download, Filter, X } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { checkAdminAccess } from '@/lib/adminAuth';

export default function ManageUsers() {
  const { user, loadingUser } = useGlobalContext();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!loadingUser) {
      if (!checkAdminAccess(user)) {
        return;
      }
    }
  }, [user, loadingUser]);

  const fetchUsers = useCallback(async () => {
     try {
         const res = await axios.get('/api/admin/users');
         setUsers(res.data);
         setLoading(false);
     } catch (e) {
         console.error(e);
     }
  }, []);

  useEffect(() => {
    if (!loadingUser && user?.role === 'admin') {
      const t = setTimeout(() => fetchUsers(), 0);
      return () => clearTimeout(t);
    }
  }, [fetchUsers, user, loadingUser]);

  const handleToggleBan = async (user) => {
      const action = user.isBanned ? 'activate' : 'ban';
      if(!confirm(`Are you sure you want to ${action} this user?`)) return;
      try {
          const res = await axios.put('/api/admin/users', { id: user._id, isBanned: !user.isBanned });
          setUsers(users.map(u => u._id === user._id ? res.data.user : u));
      } catch (e) {
          alert(`Failed to ${action} user`);
      }
  };

  const handleToggleRole = async (targetUser) => {
      const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
      const action = newRole === 'admin' ? 'promote to admin' : 'demote to user';
      if(!confirm(`Are you sure you want to ${action}?`)) return;
      try {
          const res = await axios.patch('/api/admin/users', { id: targetUser._id, role: newRole });
          setUsers(users.map(u => u._id === targetUser._id ? res.data.user : u));
      } catch (e) {
          alert(`Failed to ${action}`);
      }
  };

  const handleDelete = async (id) => {
      if(!confirm("Are you sure you want to delete this user?")) return;
      try {
          await axios.delete(`/api/admin/users?id=${id}`);
          setUsers(users.filter(u => u._id !== id));
      } catch (e) {
          alert("Failed to delete user");
      }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }
    
    const actionText = action === 'delete' ? 'delete' : action === 'ban' ? 'ban' : 'unban';
    if (!confirm(`Are you sure you want to ${actionText} ${selectedUsers.length} user(s)?`)) return;
    
    try {
      await axios.post('/api/admin/users/bulk', { userIds: selectedUsers, action });
      setSelectedUsers([]);
      fetchUsers();
    } catch (e) {
      alert(`Failed to ${actionText} users`);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('/api/admin/users/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export users');
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !u.isBanned) ||
                         (filterStatus === 'banned' && u.isBanned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-8 bg-[#F6F6F8] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
            <p className="text-slate-500 text-sm mt-1">Manage users, roles, and permissions</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Filters Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                        <input 
                          type="text" 
                          placeholder="Search users..." 
                          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                          value={filterRole}
                          onChange={e => setFilterRole(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                        
                        <select 
                          value={filterStatus}
                          onChange={e => setFilterStatus(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="banned">Banned</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedUsers.length} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction('ban')}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition"
                    >
                      Ban Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('unban')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                    >
                      Unban Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="ml-auto p-1 hover:bg-blue-100 rounded transition"
                      title="Clear selection"
                    >
                      <X size={16} className="text-blue-600" />
                    </button>
                  </div>
                )}

                <div className="text-sm text-slate-500 flex justify-between">
                    <span>Showing {filteredUsers.length} of {users.length} users</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                        <tr>
                            <th className="p-4 w-12">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-slate-300"
                              />
                            </th>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Saved Cities</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-slate-50/80 transition">
                                <td className="p-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => toggleSelectUser(user._id)}
                                    className="w-4 h-4 rounded border-slate-300"
                                  />
                                </td>
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs overflow-hidden relative">
                                        {user.profilePicture ? <Image src={user.profilePicture} alt="pic" fill className="object-cover" unoptimized /> : <User size={14}/>}
                                    </div>
                                    <span className="font-medium text-slate-800">{user.name}</span>
                                </td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                        {user.role}
                                    </span>
                                    {user.isBanned && <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">BANNED</span>}
                                </td>
                                <td className="p-4 text-slate-500">{user.savedCities?.length || 0}</td>
                                <td className="p-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {user.role !== 'admin' ? (
                                        <>
                                            <button 
                                                onClick={() => handleToggleRole(user)}
                                                className="p-2 rounded-lg transition text-purple-500 hover:bg-purple-50"
                                                title="Promote to Admin"
                                            >
                                                <Shield size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleBan(user)}
                                                className={`p-2 rounded-lg transition ${user.isBanned ? 'text-green-500 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                                                title={user.isBanned ? "Activate User" : "Ban User"}
                                            >
                                                {user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition"
                                            title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleToggleRole(user)}
                                            className="p-2 rounded-lg transition text-slate-400 hover:bg-slate-50"
                                            title="Demote to User"
                                        >
                                            <ShieldOff size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-400">No users found</div>
                )}
            </div>
        </div>
    </div>
  );
}
