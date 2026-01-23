"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages');
      setMessages(res.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-500">View inquiries from the contact form</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium">
             Total: {messages.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100">
           <Mail size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500">No messages found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                       <User size={20} />
                   </div>
                   <div>
                       <h3 className="font-bold text-slate-900">{msg.name}</h3>
                       <p className="text-slate-500 text-sm">{msg.email}</p>
                   </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-1 justify-end">
                       <Calendar size={12} />
                       {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                        <Clock size={12} />
                        {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                  {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}