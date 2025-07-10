import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification type
export interface Notification {
  id: string;
  message: string;
  date: string;
  icon: string;
  
}

// NotificationContextType interface
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;   // ✅ Now expects the full object
  deleteNotification: (id: string) => void;
  notificationCount: number;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  deleteNotification: () => {},
  notificationCount: 0,
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('notifications').then(data => {
      if (data) setNotifications(JSON.parse(data));
    });
  }, []);

  // Save notifications to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ✅ Now addNotification accepts the whole notification object
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      deleteNotification,
      notificationCount: notifications.length,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
