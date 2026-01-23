"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, UserPlus, Megaphone } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    registration_enabled: true,
    maintenance_mode: false,
    announcement: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/admin/settings');
            setSettings(res.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
      setSaving(true);
      try {
          await axios.post('/api/admin/settings', settings);
          alert('Settings saved successfully!');
      } catch (e) {
          alert('Failed to save settings');
      }
      setSaving(false);
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">System Settings</h2>

        <div className="grid gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <UserPlus size={24}/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">User Functionality</h3>
                        <p className="text-slate-500 text-sm mb-4">Control how users interact with the system.</p>
                        
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.registration_enabled}
                                  onChange={(e) => setSettings({...settings, registration_enabled: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">Allow New Registrations</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                        <AlertTriangle size={24}/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Maintenance</h3>
                        <p className="text-slate-500 text-sm mb-4">Put the site into maintenance mode. Only admins will be able to access.</p>
                        
                        <div className="flex items-center gap-3">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.maintenance_mode}
                                  onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">Enable Maintenance Mode</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                        <Megaphone size={24}/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Global Announcement</h3>
                        <p className="text-slate-500 text-sm mb-4">Display a banner message at the top of the homepage.</p>
                        
                        <textarea 
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-purple-500 outline-none"
                            rows={3}
                            placeholder="Enter announcement message..."
                            value={settings.announcement}
                            onChange={(e) => setSettings({...settings, announcement: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 font-bold disabled:opacity-50"
                >
                    <Save size={20} /> {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>

        </div>
    </div>
  );
}
