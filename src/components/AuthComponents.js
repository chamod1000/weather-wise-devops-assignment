import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, User, Lock, Mail, Save, LogOut, Trash2, Settings, MapPin, Gauge, Camera, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export function ProfileModal({ user, onClose, onLogin, onUpdate, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
    unit: user?.preferences?.unit || 'C',
    profilePicture: user?.profilePicture || '',
    gender: user?.gender || 'male'
  });
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if(formData.password && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }
    setLoading(true);
    try {
        const res = await axios.put('/api/user', {
            name: formData.name,
            password: formData.password || undefined,
            preferences: { unit: formData.unit },
            profilePicture: formData.profilePicture,
            gender: formData.gender,
        });
        onUpdate(res.data.user);
        toast.success("Profile Updated!");
    } catch (err) {
        toast.error("Update Failed (Image might be too large)");
    }
    setLoading(false);
  };

  const handleDeleteFavorite = async (cityName) => {
     try {
         await axios.delete(`/api/favorites?name=${cityName}`);
         onUpdate({...user, savedCities: user.savedCities.filter(c => c.name !== cityName)});
         toast.success("Removed from favorites");
     } catch (e) {
         console.error("Failed to delete", e);
         toast.error("Failed to remove favorite");
     }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
       <div className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] animate-in fade-in zoom-in-95 duration-200">
           
           <div className="bg-slate-50 p-6 md:w-1/3 flex flex-col gap-2 border-r border-slate-100">
               <div className="flex flex-col items-center text-center mb-8 mt-4">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg shadow-blue-200 overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
                       {user?.profilePicture ? (
                          <Image src={user.profilePicture} alt="Profile" fill className="object-cover" unoptimized />
                       ) : (
                          <div className={`w-full h-full flex items-center justify-center text-5xl ${user?.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                            {user?.gender === 'female' ? '👩' : '👨'}
                          </div>
                       )}
                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Settings size={20} className="text-white"/>
                       </div>
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">{user?.name}</h3>
                   <p className="text-xs text-slate-500 truncate w-40 bg-slate-200/50 px-2 py-1 rounded-full">{user?.email}</p>
                   {user?.createdAt && (
                       <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">
                           Member since {new Date(user.createdAt).getFullYear()}
                       </p>
                   )}
               </div>

               <div className="space-y-1">
                   <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full p-3 rounded-xl text-left font-medium flex gap-3 items-center transition-all duration-200 ${
                        activeTab === 'profile' 
                        ? 'bg-blue-50 text-blue-600 shadow-sm translate-x-1' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-700'
                    }`}
                   >
                     <User size={18} /> Profile Details
                   </button>
                   <button 
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full p-3 rounded-xl text-left font-medium flex gap-3 items-center transition-all duration-200 ${
                        activeTab === 'favorites' 
                        ? 'bg-blue-50 text-blue-600 shadow-sm translate-x-1' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-700'
                    }`}
                   >
                     <MapPin size={18} /> My Locations
                     <span className="ml-auto bg-blue-100 text-blue-600 text-[10px] py-0.5 px-2 rounded-full font-bold">
                        {user?.savedCities?.length || 0}
                     </span>
                   </button>
                    <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full p-3 rounded-xl text-left font-medium flex gap-3 items-center transition-all duration-200 ${
                        activeTab === 'settings' 
                        ? 'bg-blue-50 text-blue-600 shadow-sm translate-x-1' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-700'
                    }`}
                   >
                     <Settings size={18} /> Preferences
                   </button>
                   
                   {user?.role === 'admin' && (
                       <Link href="/admin" className="w-full p-3 rounded-xl text-left font-medium flex gap-3 items-center text-purple-600 bg-purple-50 hover:bg-purple-100 transition mt-2">
                           <ShieldCheck size={18} /> Admin Panel
                       </Link>
                   )}
               </div>
               
               <div className="mt-auto pt-6 border-t border-slate-200">
                   <button onClick={onLogout} className="w-full p-3 text-red-500 font-medium flex gap-2 items-center hover:bg-red-50 rounded-xl transition duration-200 group">
                       <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                   </button>
               </div>
           </div>

           <div className="p-8 md:w-2/3 relative bg-white">
               <button onClick={onClose} className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"><X size={18}/></button>
               
               {activeTab === 'profile' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                       <h2 className="text-2xl font-bold text-slate-800 mb-1">Edit Profile</h2>
                       <p className="text-slate-500 text-sm mb-6">Update your personal information</p>
                       
                       <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                           
                           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden relative border-2 border-white shadow-sm">
                                  {formData.profilePicture ? (
                                    <Image src={formData.profilePicture} alt="Preview" fill className="object-cover" unoptimized />
                                  ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-3xl ${formData.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                                        {formData.gender === 'female' ? '👩' : '👨'}
                                    </div>
                                  )}
                               </div>
                               <div>
                                   <label className="text-sm font-bold text-slate-700 block mb-1">Profile Photo</label>
                                   <div className="flex gap-2">
                                       <button 
                                         type="button" 
                                         onClick={() => fileInputRef.current?.click()}
                                         className="text-xs bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
                                       >
                                         <Camera size={14}/> Change
                                       </button>
                                       {formData.profilePicture && (
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({...formData, profilePicture: ''})}
                                                className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition"
                                            >
                                                Remove
                                            </button>
                                       )}
                                   </div>
                                   <input 
                                     type="file" 
                                     ref={fileInputRef} 
                                     onChange={handleFileChange} 
                                     accept="image/*" 
                                     className="hidden" 
                                   />
                               </div>
                           </div>

                           <div>
                               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Account Information</label>
                               <div className="grid gap-4">
                                   <div className="relative group">
                                       <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
                                       <input 
                                         type="text" 
                                         value={formData.name}
                                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                       />
                                   </div>
                                   <div className="relative opacity-60 pointer-events-none">
                                       <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                       <input 
                                         type="text" 
                                         value={user?.email} 
                                         readOnly
                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none"
                                       />
                                   </div>
                                   
                                   <div className="flex gap-4 p-1">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                          type="radio" 
                                          name="gender" 
                                          value="male" 
                                          checked={formData.gender === 'male'} 
                                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                          className="w-4 h-4 text-blue-600 cursor-pointer"
                                        />
                                        <span className="text-slate-600 text-sm font-medium">Male</span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                          type="radio" 
                                          name="gender" 
                                          value="female" 
                                          checked={formData.gender === 'female'} 
                                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                          className="w-4 h-4 text-pink-600 cursor-pointer"
                                        />
                                        <span className="text-slate-600 text-sm font-medium">Female</span>
                                      </label>
                                   </div>
                               </div>
                           </div>

                           <div className="pt-2">
                               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Security</label>
                               <div className="grid gap-4">
                                   <div className="relative group">
                                       <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
                                       <input 
                                         type="password" 
                                         placeholder="New Password (Optional)"
                                         value={formData.password}
                                         onChange={(e) => setFormData({...formData, password: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                       />
                                   </div>
                                   <p className="text-[10px] text-slate-400 ml-1 -mt-2">Leave blank to keep your current password</p>
                                    {formData.password && (
                                       <div className="relative group animate-in fade-in slide-in-from-top-2">
                                           <div className={`absolute left-3 top-3.5 transition ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
                                             <Lock size={18} />
                                           </div>
                                           <input 
                                             type="password" 
                                             placeholder="Confirm Password"
                                             value={formData.confirmPassword}
                                             onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                             className={`w-full bg-slate-50 border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 transition ${
                                                formData.confirmPassword && formData.password !== formData.confirmPassword 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                                             }`}
                                           />
                                       </div>
                                   )}
                               </div>
                           </div>
                           
                           <div className="flex items-center justify-between mt-2">
                               <span></span>

                               <button type="submit" disabled={loading} className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transform active:scale-95">
                                   {loading ? 'Saving...' : 'Save Changes'}
                               </button>
                           </div>
                       </form>
                   </div>
               )}

               {activeTab === 'favorites' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">My Locations</h2>
                                <p className="text-slate-500 text-sm">Manage your saved weather locations.</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
                            {user?.savedCities?.length === 0 && (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    <MapPin size={32} className="mb-2 opacity-50"/>
                                    <p>No saved cities yet.</p>
                                    <p className="text-xs mt-1">Search a city and click the heart icon.</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-3">
                                {user?.savedCities?.map((city, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-lg">{city.name}</div>
                                                <div className="text-xs text-slate-400 uppercase tracking-wilder font-medium">Saved Location</div>
                                            </div>
                                        </div>
                                        <button 
                                          title="Remove from favorites"
                                          onClick={() => handleDeleteFavorite(city.name)}
                                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
               )}

                {activeTab === 'settings' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                       <h2 className="text-2xl font-bold text-slate-800 mb-1">Preferences</h2>
                       <p className="text-slate-500 text-sm mb-8">Customize your weather experience</p>
                       
                       <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                           <div>
                               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block ml-1">Temperature Unit</label>
                               <div className="grid grid-cols-2 gap-4">
                                   <label className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.unit === 'C' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                                       <input 
                                         type="radio" 
                                         name="unit" 
                                         value="C" 
                                         checked={formData.unit === 'C'} 
                                         onChange={() => setFormData({...formData, unit: 'C'})}
                                         className="hidden"
                                       />
                                       <span className="text-3xl font-light">°C</span>
                                       <span className={`text-sm font-bold ${formData.unit === 'C' ? 'text-blue-600' : 'text-slate-500'}`}>Celsius</span>
                                   </label>
                                   
                                   <label className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.unit === 'F' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                                       <input 
                                         type="radio" 
                                         name="unit" 
                                         value="F" 
                                         checked={formData.unit === 'F'} 
                                         onChange={() => setFormData({...formData, unit: 'F'})}
                                         className="hidden"
                                       />
                                       <span className="text-3xl font-light">°F</span>
                                       <span className={`text-sm font-bold ${formData.unit === 'F' ? 'text-blue-600' : 'text-slate-500'}`}>Fahrenheit</span>
                                   </label>
                               </div>
                           </div>

                           <div className="mt-8">
                               <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200">
                                   {loading ? 'Saving...' : 'Save Preferences'}
                               </button>
                           </div>
                       </form>
                   </div>
               )}

           </div>
       </div>
    </div>
  );
}

export function AuthModal({ onClose, onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const url = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const res = await axios.post(url, formData);
            if (isLogin) {
                onLogin(res.data.user);
                onClose();
            } else {
                setIsLogin(true);
                setFormData({...formData, password: ''});
                setError("Registration successful! Please login.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[30px] w-full max-w-md p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-slate-500">
                        {isLogin ? 'Enter your details to access your account' : 'Start your weather journey today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>

                    {error && <p className={`text-sm text-center ${error.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{error}</p>}

                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 instance rounded-xl transition mt-2">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
