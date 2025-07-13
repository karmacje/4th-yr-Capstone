import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

// Mock data for charts
const mockLineData = {
  labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
  datasets: [
    {
      data: [8, 12, 15, 22, 18, 14],
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const mockBarData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [18, 25, 22, 30, 28, 24, 20],
    },
  ],
};

const chartConfig = {
  backgroundColor: Colors.white,
  backgroundGradientFrom: Colors.white,
  backgroundGradientTo: Colors.white,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: Colors.primary,
  },
};

const timeRanges = [
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '1m', label: '1 Month' },
];

const pigpenOptions = [
  { id: 'all', label: 'All Pigpens' },
  { id: '1', label: 'Pigpen A' },
  { id: '2', label: 'Pigpen B' },
  { id: '3', label: 'Pigpen C' },
  { id: '4', label: 'Pigpen D' },
];

export default function AnalyticsScreen() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedPigpen, setSelectedPigpen] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const stats = [
    { label: 'Average', value: '18.5 ppm', color: Colors.primary },
    { label: 'Minimum', value: '8 ppm', color: Colors.safe },
    { label: 'Maximum', value: '35 ppm', color: Colors.high },
    { label: 'Critical Events', value: '3', color: Colors.critical },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <View style={styles.chartTypeToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, chartType === 'line' && styles.toggleButtonActive]}
              onPress={() => setChartType('line')}
            >
              <TrendingUp size={16} color={chartType === 'line' ? Colors.white : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, chartType === 'bar' && styles.toggleButtonActive]}
              onPress={() => setChartType('bar')}
            >
              <BarChart3 size={16} color={chartType === 'bar' ? Colors.white : Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          {/* Time Range Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Time Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.filterChip,
                    selectedTimeRange === range.id && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedTimeRange(range.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedTimeRange === range.id && styles.filterChipTextActive,
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Pigpen Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Pigpen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {pigpenOptions.map((pigpen) => (
                <TouchableOpacity
                  key={pigpen.id}
                  style={[
                    styles.filterChip,
                    selectedPigpen === pigpen.id && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedPigpen(pigpen.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPigpen === pigpen.id && styles.filterChipTextActive,
                  ]}>
                    {pigpen.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Ammonia Levels</Text>
            <View style={styles.chartLegend}>
              <Activity size={16} color={Colors.primary} />
              <Text style={styles.legendText}>PPM</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {chartType === 'line' ? (
              <LineChart
                data={mockLineData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : (
              <BarChart
                data={mockBarData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            )}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIndicator, { backgroundColor: Colors.safe }]} />
              <Text style={styles.insightTitle}>Good Performance</Text>
            </View>
            <Text style={styles.insightText}>
              Ammonia levels have been consistently low in the past 24 hours, indicating good ventilation.
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIndicator, { backgroundColor: Colors.warning }]} />
              <Text style={styles.insightTitle}>Peak Hours</Text>
            </View>
            <Text style={styles.insightText}>
              Highest ammonia levels typically occur between 2-4 PM. Consider adjusting ventilation schedule.
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIndicator, { backgroundColor: Colors.info }]} />
              <Text style={styles.insightTitle}>Weekly Trend</Text>
            </View>
            <Text style={styles.insightText}>
              Levels have decreased by 12% compared to last week, showing improvement in farm management.
            </Text>
          </View>
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
  chartTypeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 16,
  },
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  insightText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});