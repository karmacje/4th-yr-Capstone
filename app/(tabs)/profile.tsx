import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, Bell, Smartphone, Settings, LogOut, Camera, Save } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Farmer',
    email: 'john@example.com',
    phone: '+1234567890',
  });
  const [notifications, setNotifications] = useState({
    push: true,
    sms: true,
  });
  const [thresholds, setThresholds] = useState({
    low: '10',
    medium: '25',
    high: '50',
    critical: '75',
  });

  const handleSaveProfile = () => {
    // Here you would update the user profile in Supabase
    Alert.alert('Success', 'Profile updated successfully!');
    setEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            // Navigation will be handled by auth state change listener
          },
        },
      ]
    );
  };

  const handleTestSMS = () => {
    Alert.alert('SMS Test', 'Test SMS sent successfully!');
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export has been initiated. You will receive an email with the download link.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.editButtonText}>{editing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color={Colors.white} />
            </View>
            {editing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.avatarText}>Tap to change photo</Text>
        </View>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textSecondary} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={userInfo.name}
                onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
                editable={editing}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.textSecondary} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={userInfo.phone}
                onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
                editable={editing}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {editing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Save size={20} color={Colors.white} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive alerts on your device</Text>
              </View>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={(value) => setNotifications({ ...notifications, push: value })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Smartphone size={20} color={Colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>SMS Alerts</Text>
                <Text style={styles.settingSubtitle}>Critical alerts via SMS</Text>
              </View>
            </View>
            <Switch
              value={notifications.sms}
              onValueChange={(value) => setNotifications({ ...notifications, sms: value })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>

          <TouchableOpacity style={styles.testButton} onPress={handleTestSMS}>
            <Text style={styles.testButtonText}>Test SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Ammonia Thresholds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ammonia Thresholds (PPM)</Text>
          
          <View style={styles.thresholdGrid}>
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Low</Text>
              <TextInput
                style={[styles.thresholdInput, { borderColor: Colors.safe }]}
                value={thresholds.low}
                onChangeText={(text) => setThresholds({ ...thresholds, low: text })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Medium</Text>
              <TextInput
                style={[styles.thresholdInput, { borderColor: Colors.warning }]}
                value={thresholds.medium}
                onChangeText={(text) => setThresholds({ ...thresholds, medium: text })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>High</Text>
              <TextInput
                style={[styles.thresholdInput, { borderColor: Colors.high }]}
                value={thresholds.high}
                onChangeText={(text) => setThresholds({ ...thresholds, high: text })}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Critical</Text>
              <TextInput
                style={[styles.thresholdInput, { borderColor: Colors.critical }]}
                value={thresholds.critical}
                onChangeText={(text) => setThresholds({ ...thresholds, critical: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={handleExportData}>
            <Settings size={20} color={Colors.textSecondary} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionSubtitle}>Download your farm data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <LogOut size={20} color={Colors.critical} />
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, { color: Colors.critical }]}>Logout</Text>
              <Text style={styles.actionSubtitle}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputDisabled: {
    color: Colors.textSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  testButton: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  thresholdGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thresholdItem: {
    width: '48%',
    marginBottom: 16,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  thresholdInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});