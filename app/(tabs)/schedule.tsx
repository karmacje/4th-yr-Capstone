import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Plus, Clock, MapPin, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

interface ScheduleTask {
  schedule_id: string;
  title: string;
  description?: string;
  due_date: string;
  is_recurring: boolean;
  completed: boolean;
  pigpen_name?: string;
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [showAddModal, setShowAddModal] = useState(false);
  const [schedules, setSchedules] = useState<{ [key: string]: ScheduleTask[] }>({});
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '',
    pigpen_id: '',
    is_recurring: false,
  });
  const [pigpens, setPigpens] = useState<any[]>([]);

  useEffect(() => {
    fetchSchedules();
    fetchPigpens();
  }, []);

  const fetchPigpens = async () => {
    try {
      const { data, error } = await supabase
        .from('pigpens')
        .select('pigpen_id, name')
        .order('name');

      if (error) throw error;
      setPigpens(data || []);
    } catch (error) {
      console.error('Error fetching pigpens:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      // Get schedules for the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);

      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          schedule_id,
          title,
          description,
          due_date,
          is_recurring,
          completed,
          pigpens (
            name
          )
        `)
        .gte('due_date', startOfMonth.toISOString())
        .lte('due_date', endOfMonth.toISOString())
        .order('due_date');

      if (error) throw error;

      // Group schedules by date
      const groupedSchedules: { [key: string]: ScheduleTask[] } = {};
      
      data?.forEach(schedule => {
        const dateKey = schedule.due_date.split('T')[0];
        if (!groupedSchedules[dateKey]) {
          groupedSchedules[dateKey] = [];
        }
        
        groupedSchedules[dateKey].push({
          schedule_id: schedule.schedule_id,
          title: schedule.title,
          description: schedule.description,
          due_date: schedule.due_date,
          is_recurring: schedule.is_recurring,
          completed: schedule.completed,
          pigpen_name: schedule.pigpens?.name
        });
      });

      setSchedules(groupedSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules({});
    } finally {
      setLoading(false);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(schedules).forEach(date => {
      const tasks = schedules[date];
      const completedCount = tasks.filter(task => task.completed).length;
      const totalCount = tasks.length;
      
      marked[date] = {
        marked: true,
        dotColor: completedCount === totalCount ? Colors.safe : Colors.primary,
        selectedColor: date === selectedDate ? Colors.primary : undefined,
        selected: date === selectedDate,
      };
    });
    return marked;
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.time || !newTask.pigpen_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Combine selected date with time
      const dueDateTime = new Date(`${selectedDate}T${newTask.time}:00`);
      
      const { error } = await supabase
        .from('maintenance_schedules')
        .insert([
          {
            pigpen_id: newTask.pigpen_id,
            title: newTask.title,
            description: newTask.description || null,
            due_date: dueDateTime.toISOString(),
            is_recurring: newTask.is_recurring
          }
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Task added successfully!');
      setShowAddModal(false);
      setNewTask({ title: '', description: '', time: '', pigpen_id: '', is_recurring: false });
      fetchSchedules(); // Refresh the schedules
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = Object.values(schedules).flat().find(t => t.schedule_id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('maintenance_schedules')
        .update({ completed: !task.completed })
        .eq('schedule_id', taskId);

      if (error) throw error;

      Alert.alert('Success', 'Task status updated!');
      fetchSchedules(); // Refresh the schedules
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const selectedTasks = schedules[selectedDate] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: Colors.white,
              calendarBackground: Colors.white,
              textSectionTitleColor: Colors.textSecondary,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.white,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.textLight,
              dotColor: Colors.primary,
              selectedDotColor: Colors.white,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
              indicatorColor: Colors.primary,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
            }}
          />
        </View>

        {/* Tasks for Selected Date */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.sectionTitle}>
              Tasks for {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.taskCount}>{selectedTasks.length} tasks</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : selectedTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks scheduled</Text>
              <Text style={styles.emptyStateSubtext}>Tap + to add a new task</Text>
            </View>
          ) : (
            selectedTasks.map((task) => (
              <View key={task.schedule_id} style={styles.taskCard}>
                <TouchableOpacity
                  style={styles.taskCheckbox}
                  onPress={() => toggleTaskCompletion(task.schedule_id)}
                >
                  {task.completed ? (
                    <CheckCircle size={24} color={Colors.safe} />
                  ) : (
                    <Circle size={24} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>

                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                    {task.title}
                  </Text>
                  
                  <View style={styles.taskDetails}>
                    <View style={styles.taskDetail}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.taskDetailText}>
                        {new Date(task.due_date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                    
                    {task.pigpen_name && (
                      <View style={styles.taskDetail}>
                        <MapPin size={14} color={Colors.textSecondary} />
                        <Text style={styles.taskDetailText}>{task.pigpen_name}</Text>
                      </View>
                    )}
                  </View>

                  {task.is_recurring && (
                    <View style={styles.recurringBadge}>
                      <Text style={styles.recurringText}>Recurring</Text>
                    </View>
                  )}
                </View>

                <View style={styles.taskActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Edit size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Trash2 size={16} color={Colors.critical} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
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
            <Text style={styles.modalTitle}>Add Task</Text>
            <TouchableOpacity onPress={handleAddTask}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.selectedDateCard}>
              <Text style={styles.selectedDateLabel}>Date</Text>
              <Text style={styles.selectedDateText}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Task Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Clean Pigpen A"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Optional description"
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 09:00"
                value={newTask.time}
                onChangeText={(text) => setNewTask({ ...newTask, time: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pigpen *</Text>
              <View style={styles.pickerContainer}>
                {pigpens.map((pigpen) => (
                  <TouchableOpacity
                    key={pigpen.pigpen_id}
                    style={[
                      styles.pickerOption,
                      newTask.pigpen_id === pigpen.pigpen_id && styles.pickerOptionSelected
                    ]}
                    onPress={() => setNewTask({ ...newTask, pigpen_id: pigpen.pigpen_id })}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      newTask.pigpen_id === pigpen.pigpen_id && styles.pickerOptionTextSelected
                    ]}>
                      {pigpen.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.recurringToggle}
              onPress={() => setNewTask({ ...newTask, is_recurring: !newTask.is_recurring })}
            >
              <View style={styles.recurringToggleContent}>
                <Text style={styles.recurringToggleText}>Recurring Task</Text>
                <View style={[styles.toggle, newTask.is_recurring && styles.toggleActive]}>
                  <View style={[styles.toggleKnob, newTask.is_recurring && styles.toggleKnobActive]} />
                </View>
              </View>
              <Text style={styles.recurringHelp}>
                Recurring tasks will be automatically created for future dates
              </Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tasksSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  taskCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  taskDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  taskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recurringBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recurringText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
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
  selectedDateCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedDateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recurringToggle: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recurringToggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recurringToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  recurringHelp: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pickerOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    color: Colors.white,
  },
});