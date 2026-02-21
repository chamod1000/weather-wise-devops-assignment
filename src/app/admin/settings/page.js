"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, AlertTriangle, UserPlus, Megaphone, Download, Database } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    registration_enabled: true,
    maintenance_mode: false,
    announcement: '',
    allowRegistration: true,
    maintenanceMode: false,
    apiRateLimit: 100,
    announcementActive: false,
    requireEmailVerification: false,
    maxSavedCities: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/admin/settings');
            setSettings({
              ...res.data,
              registration_enabled: res.data.allowRegistration ?? res.data.registration_enabled ?? true,
              maintenance_mode: res.data.maintenanceMode ?? res.data.maintenance_mode ?? false,
              allowRegistration: res.data.allowRegistration ?? true,
              maintenanceMode: res.data.maintenanceMode ?? false,
              apiRateLimit: res.data.apiRateLimit ?? 100,
              announcementActive: res.data.announcementActive ?? false,
              requireEmailVerification: res.data.requireEmailVerification ?? false,
              maxSavedCities: res.data.maxSavedCities ?? 10,
              announcement: res.data.announcement ?? '',
            });
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
      setSaving(true);
      try {
          await axios.post('/api/admin/settings', settings);
          toast.success('Settings saved successfully!');
      } catch (e) {
          toast.error('Failed to save settings');
      }
      setSaving(false);
  };

  const handleBackup = async () => {
    try {
      const res = await axios.post('/api/admin/backup');
      toast.success('Backup created successfully');
      
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weatherwise-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    }
  };

  const handleExportUsers = () => {
    try {
      window.open('/api/admin/users/export', '_blank');
      toast.success('Exporting users...');
    } catch (error) {
      toast.error('Failed to export users');
    }
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
                        
                        <div className="space-y-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.registration_enabled}
                                  onChange={(e) => setSettings({...settings, registration_enabled: e.target.checked, allowRegistration: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">Allow New Registrations</span>
                            </label>

                            <div className="pt-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">API Rate Limit (per hour)</label>
                              <input 
                                type="number" 
                                min="10" 
                                max="1000"
                                value={settings.apiRateLimit}
                                onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                                className="w-40 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              />
                            </div>

                            <div className="pt-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Max Saved Cities per User</label>
                              <input 
                                type="number" 
                                min="5" 
                                max="50"
                                value={settings.maxSavedCities}
                                onChange={(e) => setSettings({...settings, maxSavedCities: parseInt(e.target.value)})}
                                className="w-40 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              />
                            </div>
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
                                  onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked, maintenanceMode: e.target.checked})}
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
                        
                        <div className="mb-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.announcementActive}
                                  onChange={(e) => setSettings({...settings, announcementActive: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">Show Announcement Banner</span>
                            </label>
                        </div>
                        
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <Database size={24}/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Data Management</h3>
                        <p className="text-slate-500 text-sm mb-4">Export and backup your data.</p>
                        
                        <div className="flex gap-3">
                            <button 
                              onClick={handleBackup}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                            >
                                <Download size={18} /> Database Backup
                            </button>
                            <button 
                              onClick={handleExportUsers}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                            >
                                <Download size={18} /> Export Users CSV
                            </button>
                        </div>
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
