import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from './ThemeContext'; 
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigation = useNavigation()

  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const inputBg = darkMode ? '#374151' : '#f2f2f2';

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      const tasks = saved ? JSON.parse(saved) : [];
      setAllTasks(tasks);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const results = allTasks.filter(task =>
      task.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(results);
  }, [query, allTasks]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
       <TouchableOpacity
  style={styles.arrowBack}
  onPress={() => {
    setQuery('');
    navigation.goBack();
  }}
>
  <Ionicons name="chevron-back-sharp" size={30} color={textColor} />
</TouchableOpacity>


      <View style={styles.searchWrapper}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: inputBg, color: textColor },
          ]}
          placeholder="Search tasks..."
          placeholderTextColor="#888888"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
         </View>

    {query.trim().length > 0 && (
  <FlatList
    data={filteredTasks}
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
    renderItem={({ item }) => (
      <View style={[styles.taskItem, { backgroundColor: cardColor }]}>
        <View style={styles.taskInfo}>
          <View style={[styles.taskIcon, { backgroundColor: item.categoryColor || '#fca5a5' }]}>
            <Feather name={item.categoryIcon || 'list'} size={24} color="#fff" />
          </View>
          <View>
            <Text style={[styles.taskTitle, { color: textColor }]}>
              {item.description || 'No Description'}
            </Text>
            <Text style={[styles.taskDate, { color: textColor }]}>
              {item.date} {item.time}
            </Text>
          </View>
        </View>
      </View>
    )}
    ListEmptyComponent={
      <Text style={{ color: textColor, textAlign: 'center', marginTop: 50, fontStyle: 'italic' }}>
        No tasks found.
      </Text>
    }
  />
)}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 10,
    left: 15,

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  searchWrapper: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  searchInput: {
    borderRadius: 30,
    padding: 12,
    fontSize: 16,
    width: 340,
    paddingVertical: 20,

  },
  arrowBack:{
  bottom: 35,
  position: 'absolute',
  
  },
  taskItem: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fca5a5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

