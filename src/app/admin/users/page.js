"use client";
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Trash2, Search, User, Ban, CheckCircle } from 'lucide-react'; 

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
    const t = setTimeout(() => fetchUsers(), 0);
    return () => clearTimeout(t);
  }, [fetchUsers]);

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

  const handleDelete = async (id) => {
      if(!confirm("Are you sure you want to delete this user?")) return;
      try {
          await axios.delete(`/api/admin/users?id=${id}`);
          setUsers(users.filter(u => u._id !== id));
      } catch (e) {
          alert("Failed to delete user");
      }
  };

  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">User Management</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    Total: <span className="font-bold text-slate-800">{users.length}</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-slate-50/80 transition">
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
                                <td className="p-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {user.role !== 'admin' && (
                                        <>
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
