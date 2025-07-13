export interface User {
  id: string;
  email: string;
  phone_number?: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Pigpen {
  pigpen_id: string;
  user_id: string;
  name: string;
  location_description: string;
  created_at: string;
}

export interface SensorNode {
  sensor_id: string;
  pigpen_id: string;
  node_label: string;
  status: 'online' | 'offline' | 'error';
  battery_level: number;
  created_at: string;
}

export interface SensorReading {
  reading_id: string;
  sensor_id: string;
  timestamp: string;
  value_ppm: number;
  category: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Alert {
  alert_id: string;
  reading_id: string;
  sent_via_sms: boolean;
  notes?: string;
  created_at: string;
}

export interface MaintenanceSchedule {
  schedule_id: string;
  pigpen_id: string;
  title: string;
  description: string;
  due_date: string;
  is_recurring: boolean;
  completed: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  preference_id: string;
  user_id: string;
  notify_sms: boolean;
  notify_push: boolean;
  alert_threshold_custom: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}