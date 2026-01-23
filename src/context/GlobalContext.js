"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [unit, setUnit] = useState('C');
  const [announcement, setAnnouncement] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Fetch User
    axios.get('/api/auth/me').then(res => {
        if(res.data.user) {
            setUser(res.data.user);
            if(res.data.user.preferences?.unit) setUnit(res.data.user.preferences.unit);
        }
    }).catch(() => {}).finally(() => setLoadingUser(false));

    // Fetch Announcement
    axios.get('/api/settings').then(res => {
        if(res.data.announcement) setAnnouncement(res.data.announcement);
    }).catch(()=>{});

  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser, unit, setUnit, announcement, loadingUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);