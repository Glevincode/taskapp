import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable, RefreshControl, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNotification } from './NotificationContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Alert } from 'react-native'; 
import { useTheme } from './ThemeContext';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

function renderCategoryIcon(iconName: string, iconLib?: string) {
  if (!iconName) return null;
  switch (iconLib) {
    case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={22} color="#fff" />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={20} color="#fff" />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={22} color="#fff" />;
    case 'Feather':
      return <Feather name={iconName} size={22} color="#fff" />;
    default:
      return <Feather name="help-circle" size={22} color="#fff" />;
  }
}

function TaskItems() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { addNotification } = useNotification();
  

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  const [selectedDate, setSelectedDate] = useState<number>(day);
 const dates = Array.from({ length: 7 }, (_, i) => {
  const dateObj = new Date(today.getFullYear(), today.getMonth(), day - 3 + i);
  return {
    day: weekDays[dateObj.getDay()],
    date: dateObj.getDate(),
  };
});


const reorderedDates = dates.sort((a, b) => {
  if (a.date === day) return -1; // move today to front
  if (b.date === day) return 1;
  return 0;
});

  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const taskDate = new Date(dateStr);
    return (
      taskDate.getDate() === day &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const toggleCheckbox = (id: string) => {
  const updated = tasks.map(task =>
    task.id === id ? { ...task, checked: !task.checked } : task
  );
  setTasks(updated);
  AsyncStorage.setItem('tasks', JSON.stringify(updated));
    const toggledTask = updated.find(task => task.id === id);
  if (toggledTask) {
  addNotification({
    id: Date.now().toString(),
    message: `Finished the task "${toggledTask.description}" for today at ${toggledTask.time}`,
    date: new Date().toLocaleString(),
    icon: toggledTask.icon || 'checkmark-done-outline',  
  });
}


};


  const sortedTasks = [
    ...tasks.filter(task => isToday(task.date)),
    ...tasks.filter(task => !isToday(task.date)),
  ];

  const loadData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('tasks');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) setTasks(parsed);
        else setTasks([]);
      } else setTasks([]);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);

  const handleDelete = (taskId: string) => {
    const deletedTask = tasks.find(task => task.id === taskId);
    const updated = tasks.filter(task => task.id !== taskId);
    setTasks(updated);
    AsyncStorage.setItem('tasks', JSON.stringify(updated));

    
   if (deletedTask) {
  addNotification({
    id: Date.now().toString(),
    message: `Deleted task "${deletedTask.description}" at ${deletedTask.time} on ${deletedTask.date}`,
    date: new Date().toLocaleString(),
    icon: deletedTask.icon || 'notifications-outline',  // ✅ Small icon from task or default
  });
}
  };
  

    const { darkMode } = useTheme();
  
    const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
    const cardColor = darkMode ? '#1f2937' : '#fff';
    const textColor = darkMode ? '#fff' : '#333';
    const legendColor = darkMode ? '#fff' : '#333';

    const selectedColor = darkMode ? '#8b5cf0' : '#8b5cf0';

  const renderHiddenItem = (data: any) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 }}>
      <TouchableOpacity onPress={() => handleDelete(data.item.id)}>
        <Feather name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.taskRow}>
      <View style={styles.timeColumn}>
        <Text style={[styles.timeText, { color: textColor }]}>{item.time || '--:--'}</Text>
        <View style={styles.timeBar} />
      </View>
      <View style={[styles.taskItem , { backgroundColor: cardColor }]}>
        <View style={styles.taskInfo}>

         <TouchableOpacity onPress={() => toggleCheckbox(item.id)} style={styles.checkIcons}>
                <Feather
                  name={item.checked ? 'check-circle' : 'circle'}
                  size={25}
                  color={item.checked ? '#22c55e' : '#cccc'}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

          <View style={[styles.taskIconPink, { backgroundColor: item.categoryColor || '#fca5a5' }]}>
            {renderCategoryIcon(item.categoryIcon, item.categoryIconLib)}
          </View>
          <View>
           <Text
                style={[
                  styles.taskTitle, { color: textColor },
                  item.checked && { textDecorationLine: 'line-through', color: textColor },
                ]}
              >
                {item.description}
              </Text>
            <Text style={[styles.taskDate,{ color: textColor }]}>{item.date}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              {item.categories && item.categories.map((cat: any) => (
                <View
                  key={cat.id}
                  style={[styles.categoryDot, { backgroundColor: cat.color || '#6C63FF' }]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
      </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor:bgColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: cardColor }]}>
        <TouchableOpacity onPress={() => navigation.navigate('LandingPage' as never)}>
          <MaterialIcons name="keyboard-arrow-left" size={36} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Tasks</Text>
     <TouchableOpacity
  onPress={() => {
    Alert.alert(
      'Reset All Tasks',
      'Are you sure you want to delete all tasks?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: async () => {
            await AsyncStorage.removeItem('tasks');
            setTasks([]);
           addNotification({
            id: Date.now().toString(),
            message: 'All tasks have been reset.',
            date: new Date().toLocaleString(),
            icon: 'refresh-outline',  // ✅ Pick an Ionicons icon that fits the action
          });
          },
          style: 'destructive',
        },
      ]
    );
  }}
>
  <EvilIcons name="refresh" size={35} color={textColor} />
</TouchableOpacity>

      </View>

      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: textColor }]}>{day} {month} {year}</Text>
      </View>

 <View style={ styles.dateSelectorContainer}>
  {dates.slice(0, 4).map(({ day, date }) => {
    const selected = date === selectedDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date === tomorrow.getDate();

    return (
      <TouchableOpacity
        key={date}
        style={[
          styles.dateItem,
          selected && styles.dateItemSelected,
          darkMode && { backgroundColor: cardColor, borderColor: '#444' }
            
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[
          styles.dayText,
          selected && styles.dayTextSelected,
          isTomorrow && { fontWeight: 'bold' },
          darkMode && { color: textColor }
        ]}>
          {day}
        </Text>
        <Text style={[
          styles.dateText1,
          selected && styles.dateTextSelected,
          isTomorrow && { fontWeight: 'bold' },
          darkMode && { color: selected ? '#fff' : '#ddd' }
        ]}>
          {date}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>


      <SwipeListView
        data={sortedTasks}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.taskListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 150,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    height: 250,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  dateRow: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    position: 'absolute',
    top: 80,
    left: 30
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    gap: 16,

    position: 'absolute',
    top: 130,
  },

  taskTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#111827',
  flexShrink: 1,
  flexWrap: 'wrap',
  maxWidth: 200,
},

  dateItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
    shadowColor: 'blue',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    width: 65,
    height: 80,
    justifyContent: 'center',
  },
  dateItemSelected: {
    backgroundColor: '#8b5cf0',
    borderColor: '#007AFF',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dayText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',
  },
  dayTextSelected: {
    color: '#fff',
  },
  dateText1: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dateTextSelected: {
    color: '#fff',
  },
  taskListContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    top: 20,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    marginRight: 10,
  },
  timeText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeBar: {
    width: 2,
    flex: 1,
    backgroundColor: '#6C63FF',
    marginTop: 2,
    marginBottom: 2,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconPink: {
    backgroundColor: '#fca5a5',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcons:{
    flex: 1,
    position: 'absolute',
    marginLeft: 225,
  },

  taskDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
  verticalIcons: {
    marginLeft: 18,
  },
  categoryDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  noTaskText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 220,
    alignItems: 'center',
    elevation: 8,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
});

export default TaskItems;