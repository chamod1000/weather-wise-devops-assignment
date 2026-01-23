"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, Shield, User } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/admin/logs');
        setLogs(res.data);
      } catch (e) {
        console.error("Failed to load logs");
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8">Loading logs...</div>;

  return (
    <div className="p-8">
       <h2 className="text-3xl font-bold text-slate-800 mb-6">Activity Logs</h2>
       
       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-600">
                   <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                       <tr>
                           <th className="p-4">Action</th>
                           <th className="p-4">User</th>
                           <th className="p-4">Details</th>
                           <th className="p-4">Date</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {logs.map((log) => (
                           <tr key={log._id} className="hover:bg-slate-50/80 transition">
                               <td className="p-4">
                                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                                       log.action === 'ADMIN_ACTION' ? 'bg-purple-100 text-purple-600' : 
                                       log.action === 'LOGIN' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                                   }`}>
                                       {log.action}
                                   </span>
                               </td>
                               <td className="p-4 flex items-center gap-2">
                                  {log.user ? (
                                      <>
                                          <User size={14} className="text-slate-400"/>
                                          <span className="font-medium text-slate-800">{log.user.name}</span>
                                      </>
                                  ) : <span className="text-slate-400 italic">System / Unknown</span>}
                               </td>
                               <td className="p-4">{log.details}</td>
                               <td className="p-4 text-slate-400 font-mono text-xs">
                                   {new Date(log.createdAt).toLocaleString()}
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  );
}
