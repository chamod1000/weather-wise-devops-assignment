"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* Contact Info */}
           <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <motion.h1 
                className="text-4xl font-bold text-slate-900 mb-6"
                variants={itemVariants}
              >
                Get in touch
              </motion.h1>
              <motion.p 
                className="text-lg text-slate-600 mb-8"
                variants={itemVariants}
              >
                Have questions about the app? Suggestions for features? Or just want to say hi? We&apos;d love to hear from you.
              </motion.p>
              
              <div className="space-y-6">
                 <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                 >
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Mail size={24} /></div>
                    <div>
                       <h3 className="font-bold text-slate-800">Email Us</h3>
                       <p className="text-slate-500">support@weatherwise.com</p>
                    </div>
                 </motion.div>
                 
                 <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                 >
                    <div className="bg-green-50 p-3 rounded-xl text-green-600"><Phone size={24} /></div>
                    <div>
                       <h3 className="font-bold text-slate-800">Call Us</h3>
                       <p className="text-slate-500">+94 77 690 1234</p>
                    </div>
                 </motion.div>

                 <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                 >
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><MapPin size={24} /></div>
                    <div>
                       <h3 className="font-bold text-slate-800">Visit Us</h3>
                       <p className="text-slate-500">123 Weather St, Colombo City</p>
                    </div>
                 </motion.div>
              </div>
           </motion.div>

           {/* Contact Form */}
           <motion.div 
             variants={itemVariants}
             className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-slate-100 p-8"
           >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                      placeholder="Your name"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                      placeholder="john@example.com"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 resize-none"
                      placeholder="How can we help?"
                    ></textarea>
                 </div>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {loading ? (
                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>Send Message <Send size={20} /></>
                   )}
                 </motion.button>
              </form>
           </motion.div>
        </div>
      </motion.main>
    </div>
  );
}