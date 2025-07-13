import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Activity, Battery, Calendar, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getAmmoniaLevelColor, getBatteryLevelColor, formatTime } from '@/utils/helpers';

// Mock data - replace with real Supabase data
const mockSensorData = [
  { id: '1', name: 'Pigpen A', ammonia: 8, category: 'Low', battery: 85, status: 'online' },
  { id: '2', name: 'Pigpen B', ammonia: 22, category: 'Medium', battery: 45, status: 'online' },
  { id: '3', name: 'Pigpen C', ammonia: 35, category: 'High', battery: 20, status: 'online' },
  { id: '4', name: 'Pigpen D', ammonia: 55, category: 'Critical', battery: 75, status: 'error' },
];

const mockAlerts = [
  { id: '1', message: 'Critical ammonia level in Pigpen D', time: '2 min ago', severity: 'critical' },
  { id: '2', message: 'Low battery in Pigpen C sensor', time: '15 min ago', severity: 'warning' },
];

const mockSchedules = [
  { id: '1', title: 'Clean Pigpen A', time: '09:00 AM', status: 'due' },
  { id: '2', title: 'Feed Supplement', time: '02:00 PM', status: 'completed' },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const criticalCount = mockSensorData.filter(sensor => sensor.category === 'Critical').length;
  const lowBatteryCount = mockSensorData.filter(sensor => sensor.battery < 30).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.farmName}>Bantay Farm</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.text} />
            {mockAlerts.length > 0 && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        <View style={styles.statusGrid}>
          <View style={[styles.statusCard, { backgroundColor: criticalCount > 0 ? Colors.critical : Colors.safe }]}>
            <AlertTriangle size={24} color={Colors.white} />
            <Text style={styles.statusNumber}>{criticalCount}</Text>
            <Text style={styles.statusLabel}>Critical Alerts</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: Colors.primary }]}>
            <Activity size={24} color={Colors.white} />
            <Text style={styles.statusNumber}>{mockSensorData.filter(s => s.status === 'online').length}</Text>
            <Text style={styles.statusLabel}>Active Sensors</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: lowBatteryCount > 0 ? Colors.warning : Colors.safe }]}>
            <Battery size={24} color={Colors.white} />
            <Text style={styles.statusNumber}>{lowBatteryCount}</Text>
            <Text style={styles.statusLabel}>Low Battery</Text>
          </View>
        </View>

        {/* Recent Alerts */}
        {mockAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {mockAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={[styles.alertIndicator, { 
                  backgroundColor: alert.severity === 'critical' ? Colors.critical : Colors.warning 
                }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Sensor Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensor Overview</Text>
          {mockSensorData.map((sensor) => (
            <View key={sensor.id} style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <Text style={styles.sensorName}>{sensor.name}</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: sensor.status === 'online' ? Colors.online : 
                                  sensor.status === 'offline' ? Colors.offline : Colors.error 
                }]}>
                  <Text style={styles.statusBadgeText}>{sensor.status}</Text>
                </View>
              </View>
              
              <View style={styles.sensorData}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Ammonia Level</Text>
                  <View style={styles.dataValue}>
                    <Text style={[styles.dataNumber, { color: getAmmoniaLevelColor(sensor.category) }]}>
                      {sensor.ammonia} ppm
                    </Text>
                    <View style={[styles.categoryBadge, { backgroundColor: getAmmoniaLevelColor(sensor.category) }]}>
                      <Text style={styles.categoryText}>{sensor.category}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Battery Level</Text>
                  <View style={styles.batteryContainer}>
                    <View style={styles.batteryBar}>
                      <View style={[styles.batteryFill, { 
                        width: `${sensor.battery}%`,
                        backgroundColor: getBatteryLevelColor(sensor.battery)
                      }]} />
                    </View>
                    <Text style={[styles.batteryText, { color: getBatteryLevelColor(sensor.battery) }]}>
                      {sensor.battery}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Calendar size={20} color={Colors.primary} />
          </View>
          {mockSchedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{schedule.time}</Text>
              </View>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                <View style={[styles.scheduleStatus, { 
                  backgroundColor: schedule.status === 'completed' ? Colors.safe : Colors.warning 
                }]}>
                  <Text style={styles.scheduleStatusText}>
                    {schedule.status === 'completed' ? 'Completed' : 'Due'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  farmName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.critical,
  },
  statusGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  alertIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sensorCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  sensorData: {
    gap: 12,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dataValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dataNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batteryBar: {
    width: 60,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 4,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scheduleTime: {
    marginRight: 16,
  },
  scheduleTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scheduleContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 14,
    color: Colors.text,
  },
  scheduleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scheduleStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
});