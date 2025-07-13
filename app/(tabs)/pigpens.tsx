import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, MapPin, Activity, Battery, Settings } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getAmmoniaLevelColor, getBatteryLevelColor } from '@/utils/helpers';
import { router } from 'expo-router';

// Mock data
const mockPigpens = [
  {
    id: '1',
    name: 'Pigpen A',
    location: 'North Section',
    sensorId: 'sensor-001',
    ammonia: 8,
    category: 'Low',
    battery: 85,
    status: 'online',
    lastReading: '2 min ago'
  },
  {
    id: '2',
    name: 'Pigpen B',
    location: 'East Section',
    sensorId: 'sensor-002',
    ammonia: 22,
    category: 'Medium',
    battery: 45,
    status: 'online',
    lastReading: '1 min ago'
  },
  {
    id: '3',
    name: 'Pigpen C',
    location: 'South Section',
    sensorId: 'sensor-003',
    ammonia: 35,
    category: 'High',
    battery: 20,
    status: 'online',
    lastReading: '3 min ago'
  },
  {
    id: '4',
    name: 'Pigpen D',
    location: 'West Section',
    sensorId: 'sensor-004',
    ammonia: 55,
    category: 'Critical',
    battery: 75,
    status: 'error',
    lastReading: '5 min ago'
  },
];

export default function PigpensScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPigpen, setNewPigpen] = useState({
    name: '',
    location: '',
    sensorId: '',
  });

  const filteredPigpens = mockPigpens.filter(pigpen =>
    pigpen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pigpen.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPigpen = () => {
    if (!newPigpen.name || !newPigpen.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would add the pigpen to your database
    Alert.alert('Success', 'Pigpen added successfully!');
    setShowAddModal(false);
    setNewPigpen({ name: '', location: '', sensorId: '' });
  };

  const handlePigpenPress = (pigpen: any) => {
    router.push(`/pigpen-details/${pigpen.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pigpens</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pigpens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Pigpen List */}
      <ScrollView style={styles.scrollView}>
        {filteredPigpens.map((pigpen) => (
          <TouchableOpacity
            key={pigpen.id}
            style={styles.pigpenCard}
            onPress={() => handlePigpenPress(pigpen)}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.pigpenName}>{pigpen.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={Colors.textSecondary} />
                  <Text style={styles.location}>{pigpen.location}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.settingsButton}>
                <Settings size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sensorInfo}>
              <Text style={styles.sensorId}>Sensor: {pigpen.sensorId}</Text>
              <View style={[styles.statusBadge, {
                backgroundColor: pigpen.status === 'online' ? Colors.online :
                               pigpen.status === 'offline' ? Colors.offline : Colors.error
              }]}>
                <Text style={styles.statusText}>{pigpen.status}</Text>
              </View>
            </View>

            <View style={styles.metricsContainer}>
              {/* Ammonia Level */}
              <View style={styles.metric}>
                <View style={styles.metricHeader}>
                  <Activity size={16} color={getAmmoniaLevelColor(pigpen.category)} />
                  <Text style={styles.metricLabel}>Ammonia</Text>
                </View>
                <View style={styles.metricValue}>
                  <Text style={[styles.metricNumber, { color: getAmmoniaLevelColor(pigpen.category) }]}>
                    {pigpen.ammonia} ppm
                  </Text>
                  <View style={[styles.categoryBadge, { backgroundColor: getAmmoniaLevelColor(pigpen.category) }]}>
                    <Text style={styles.categoryText}>{pigpen.category}</Text>
                  </View>
                </View>
              </View>

              {/* Battery Level */}
              <View style={styles.metric}>
                <View style={styles.metricHeader}>
                  <Battery size={16} color={getBatteryLevelColor(pigpen.battery)} />
                  <Text style={styles.metricLabel}>Battery</Text>
                </View>
                <View style={styles.batteryContainer}>
                  <View style={styles.batteryBar}>
                    <View style={[styles.batteryFill, {
                      width: `${pigpen.battery}%`,
                      backgroundColor: getBatteryLevelColor(pigpen.battery)
                    }]} />
                  </View>
                  <Text style={[styles.batteryText, { color: getBatteryLevelColor(pigpen.battery) }]}>
                    {pigpen.battery}%
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.lastReading}>Last reading: {pigpen.lastReading}</Text>
          </TouchableOpacity>
        ))}

        {filteredPigpens.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pigpens found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first pigpen to get started'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Pigpen Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Pigpen</Text>
            <TouchableOpacity onPress={handleAddPigpen}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pigpen Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Pigpen A"
                value={newPigpen.name}
                onChangeText={(text) => setNewPigpen({ ...newPigpen, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., North Section"
                value={newPigpen.location}
                onChangeText={(text) => setNewPigpen({ ...newPigpen, location: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sensor ID (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., sensor-001"
                value={newPigpen.sensorId}
                onChangeText={(text) => setNewPigpen({ ...newPigpen, sensorId: text })}
              />
              <Text style={styles.inputHelp}>
                Leave empty to assign sensor later
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  addButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pigpenCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pigpenName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  settingsButton: {
    padding: 4,
  },
  sensorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sensorId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  metricsContainer: {
    gap: 16,
    marginBottom: 12,
  },
  metric: {
    gap: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    gap: 12,
  },
  batteryBar: {
    flex: 1,
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
    fontWeight: '600',
    minWidth: 40,
  },
  lastReading: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputHelp: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});