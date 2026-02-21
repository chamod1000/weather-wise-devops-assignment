"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Calendar, User, Clock, CheckCircle, Trash2, MessageCircle, Filter, X, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [notesText, setNotesText] = useState('');

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

  const updateStatus = async (id, status) => {
    try {
      await axios.put('/api/admin/messages', { id, status });
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/admin/messages?id=${id}`);
      setMessages(messages.filter(m => m._id !== id));
      toast.success('Message deleted');
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      const res = await axios.put('/api/admin/messages', { id, reply: replyText });
      setMessages(messages.map(m => m._id === id ? res.data.data : m));
      setReplyText('');
      toast.success('Reply sent');
      setSelectedMessage(res.data.data);
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const saveNotes = async (id) => {
    try {
      const res = await axios.put('/api/admin/messages', { id, notes: notesText });
      setMessages(messages.map(m => m._id === id ? res.data.data : m));
      toast.success('Notes saved');
      setSelectedMessage(res.data.data);
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const statusCounts = {
    all: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
  };

  return (
    <div className="p-8 bg-[#F6F6F8] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Contact Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and respond to user inquiries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 mb-6 flex gap-2">
        {['all', 'new', 'read', 'replied', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100">
           <Mail size={48} className="mx-auto text-slate-300 mb-4" />
           <p className="text-slate-500">No messages found.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div 
                key={msg._id} 
                onClick={() => {
                  setSelectedMessage(msg);
                  setNotesText(msg.notes || '');
                  if (msg.status === 'new') updateStatus(msg._id, 'read');
                }}
                className={`bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition ${
                  selectedMessage?._id === msg._id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <div className={`p-3 rounded-full ${
                       msg.status === 'new' ? 'bg-blue-100 text-blue-600' :
                       msg.status === 'replied' ? 'bg-green-100 text-green-600' :
                       msg.status === 'resolved' ? 'bg-gray-100 text-gray-600' :
                       'bg-yellow-100 text-yellow-600'
                     }`}>
                         <User size={18} />
                     </div>
                     <div>
                         <h3 className="font-bold text-slate-900">{msg.name}</h3>
                         <p className="text-slate-500 text-xs">{msg.email}</p>
                     </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    msg.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    msg.status === 'replied' ? 'bg-green-100 text-green-700' :
                    msg.status === 'resolved' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                
                <div className="text-slate-700 text-sm line-clamp-2 mb-3">
                    {msg.message}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                     <Clock size={12} />
                     {new Date(msg.createdAt).toLocaleString()}
                  </div>
                  {msg.reply && (
                    <div className="flex items-center gap-1 text-green-600">
                      <MessageCircle size={12} />
                      Replied
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail Panel */}
          <div className="sticky top-8 h-fit">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedMessage.name}</h2>
                      <p className="text-slate-600 text-sm">{selectedMessage.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Original Message */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 text-sm">Message</h3>
                    <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Reply Section */}
                  {selectedMessage.reply ? (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        Your Reply
                      </h3>
                      <div className="bg-green-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-green-200">
                        {selectedMessage.reply}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Replied by {selectedMessage.repliedBy?.name} on {new Date(selectedMessage.repliedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2 text-sm">Send Reply</h3>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                        rows="4"
                      />
                      <button
                        onClick={() => sendReply(selectedMessage._id)}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        <Send size={16} />
                        Send Reply
                      </button>
                    </div>
                  )}

                  {/* Internal Notes */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 text-sm">Internal Notes</h3>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add private notes (not visible to user)..."
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                      rows="3"
                    />
                    <button
                      onClick={() => saveNotes(selectedMessage._id)}
                      className="mt-2 w-full px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition text-sm"
                    >
                      Save Notes
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {selectedMessage.status !== 'resolved' && (
                      <button
                        onClick={() => updateStatus(selectedMessage._id, 'resolved')}
                        className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition text-sm font-medium"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition text-sm font-medium"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
                <Mail size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}