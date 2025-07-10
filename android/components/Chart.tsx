import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, RefreshControl,TouchableOpacity  } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from './ThemeContext';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TaskItemScreen from './TaskItemScreen'; // Assuming this is the correct import path for TaskItemScreen



const screenWidth = Dimensions.get('window').width;

const defaultCategoryColors: { [key: string]: string } = {
  Work: '#FF6384',
  Study: '#36A2EB',
  Personal: '#FFCE56',
  Other: '#6C63FF',
};

const Chart = () => {
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState<{
    labels: string[];
    datasets: { data: number[]; colors?: ((opacity: number) => string)[] }[];
  }>({
    labels: [],
    datasets: [{ data: [], colors: [] }],
  });
  const [legend, setLegend] = useState<{ label: string; color: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [overallPerformance, setOverallPerformance] = useState<any[]>([]);


  const [categoryPieData, setCategoryPieData] = useState<any[]>([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

const loadData = useCallback(async () => {
  const data = await AsyncStorage.getItem('tasks');
  let tasks = [];

  if (data) tasks = JSON.parse(data);

  // Category data for bar chart
  const counts: { [key: string]: { count: number; color: string } } = {};
  tasks.forEach((task: any) => {
    const cat = task.categoryName || 'Other';
    const color = task.categoryColor || defaultCategoryColors[cat] || '#6C63FF';
    if (!counts[cat]) {
      counts[cat] = { count: 0, color };
    }
    counts[cat].count += 1;
  });

  const labels = Object.keys(counts);
  const dataArr = labels.map(l => counts[l].count);
  const colorFuncs = labels.map(l => (opacity = 1) => counts[l].color);

  setCategoryData({
    labels,
    datasets: [{ data: dataArr, colors: colorFuncs }],
  });
  setLegend(labels.map(l => ({ label: l, color: counts[l].color })));
  setTotal(tasks.length);


  
  // Pie data for categories
  const pieData = labels.map(l => ({
    name: l,
    count: counts[l].count,
    color: counts[l].color,
    legendFontColor: '#333',
    legendFontSize: 10,
  })).filter(item => item.count > 0);
  setCategoryPieData(pieData);


    // Overall performance data for PieChart
   const completed = tasks.filter((t: any) => t.completed).length;
  const incomplete = tasks.length - completed;
  const overallPerformanceData = [
    {
      name: 'Completed',
      count: completed,
      color: '#4ade80',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Incomplete',
      count: incomplete,
      color: '#f87171',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
  ].filter(item => item.count > 0);
  setOverallPerformance(overallPerformanceData);
}, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);
  
   const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0f172a' : '#fff';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={[styles.innerContainer, { backgroundColor: cardColor }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <MaterialIcons
              style={styles.navIcons}
              name="keyboard-arrow-left"
              size={30}
              color={textColor}
            />
          </TouchableOpacity>
           </View>
          <Text style={[styles.taskTitle, { color: textColor }]}>
            Task Statistics
          </Text>
          <View style={styles.menuWrapper}>
          <TaskItemScreen  onRefresh={onRefresh} />
          </View>
      
      </View>

   <View style={[styles.chartShadow, { backgroundColor: cardColor }]}>
  <LineChart
    data={
      categoryData.labels.length > 0
        ? categoryData
        : {
            labels: ['No Data'],
            datasets: [{ data: [0] }],
          }
    }
    width={screenWidth - 32}
    height={240}
    chartConfig={{
      backgroundColor: cardColor,
      backgroundGradientFrom: cardColor,
      backgroundGradientTo: cardColor,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
      labelColor: (opacity = 1) =>
        `rgba(${darkMode ? '255,255,255' : '51,51,51'}, ${opacity})`,
      style: { borderRadius: 16 },
      propsForLabels: {
        fontSize: 12,
        textAnchor: 'middle',
      },
    }}
    yAxisLabel=""
    yAxisSuffix=""
    fromZero
    style={styles.chart}
  />
  {categoryData.labels.length === 0 && (
    <View style={styles.placeholderOverlay}>
      <Text style={[styles.placeholderText, { color: legendColor }]}>
        No task data available. Pull to refresh.
      </Text>
    </View>
  )}
</View>

<Text style={[styles.total, { color: legendColor }]}>
  Total Tasks: {total}
</Text>


      {legend.length > 0 && (
        <View style={styles.legendContainer}>
          {legend.map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={[styles.legendLabel, { color: legendColor }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Pie Chart */}
      <View style={styles.pieContainer}>
        <View style={[styles.chartShadow, { backgroundColor: cardColor }]}>
          <PieChart
            data={
              categoryPieData.length > 0
                ? categoryPieData.map(item => ({
                    ...item,
                    legendFontColor: legendColor,
                    legendFontSize: 15,
                  }))
                : [
                    {
                      name: 'No Data',
                      count: 1,
                      color: '#e0e0e0',
                      legendFontColor: legendColor,
                      legendFontSize: 15,
                    },
                  ]
            }
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) =>
                `rgba(${darkMode ? '255,255,255' : '0,0,0'}, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          {categoryPieData.length === 0 && (
            <View style={styles.placeholderOverlay}>
              <Text style={[styles.placeholderText, { color: legendColor }]}>
                No category data yet.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    bottom: 45,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 20,
    marginHorizontal: 16,
    position: 'relative',
    zIndex: 1,
    bottom: 10,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: 10,
    marginBottom: 8,

    
  },
  chart: {
    borderRadius: 16,
    marginTop: 10,
    
  },
  chartShadow: {
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  total: {
    fontSize: 14,
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  legendColor: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 20,
  },
  legendLabel: {
    fontSize: 13,
  },
  pieContainer: {
    marginTop: 36,
    alignItems: 'center',
    width: '100%',
  },
  navIcons: {
    marginLeft: 10,
    marginTop: 10,
    position: 'absolute',
    bottom: -40,
  },
  staticVertical: {
    marginRight: 10,
    marginTop: 20,
    position: 'absolute',
    right: 0,
    bottom: -40,
    
  },
  menuWrapper: {
    position: 'absolute',
    top: 18,
    right: 10,
    zIndex: 10,
  },
});

export default Chart;