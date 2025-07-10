import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
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
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { darkMode } = useTheme();

  // Colors
  const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const inputBg = darkMode ? '#374151' : '#f2f2f2';

  // Responsive font sizes
  const headerFontSize = width * 0.045;  // ~18 on standard screens
  const searchFontSize = width * 0.04;   // ~16
  const taskTitleFontSize = width * 0.04;
  const taskDateFontSize = width * 0.03;
  const iconSize = width * 0.06 + 10;    // Responsive icon size

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
      
      {/* Header */}
     <View style={[styles.header, { paddingTop: width * 0.12, paddingHorizontal: width * 0.05 }]}>
  
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    
    <TouchableOpacity
      style={{ padding: width * 0.01 }}  // touch area without absolute position
      onPress={() => {
        setQuery('');
        navigation.goBack();
      }}
    >
      <Ionicons name="chevron-back-sharp" size={iconSize} color={textColor} />
    </TouchableOpacity>

    <View style={{ flex: 1, marginLeft: width * 0.03 }}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            fontSize: searchFontSize,
            width: '100%',
            paddingVertical: width * 0.045,
          },
        ]}
        placeholder="Search tasks..."
        placeholderTextColor="#888888"
        value={query}
        onChangeText={setQuery}
        autoFocus
      />
    </View>

  </View>

</View>


      {/* Results */}
      {query.trim().length > 0 && (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: width * 0.045,
            paddingBottom: width * 0.1,
          }}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, { backgroundColor: cardColor, padding: width * 0.03 }]}>
              <View style={styles.taskInfo}>
                <View
                  style={[
                    styles.taskIcon,
                    {
                      backgroundColor: item.categoryColor || '#fca5a5',
                      width: width * 0.13,
                      height: width * 0.13,
                      borderRadius: width * 0.065,
                      marginRight: width * 0.03,
                    },
                  ]}
                >
                  <Feather name={item.categoryIcon || 'list'} size={iconSize} color="#fff" />
                </View>
                <View>
                  <Text style={[styles.taskTitle, { color: textColor, fontSize: taskTitleFontSize }]}>
                    {item.description || 'No Description'}
                  </Text>
                  <Text style={[styles.taskDate, { color: textColor, fontSize: taskDateFontSize }]}>
                    {item.date} {item.time}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{
              color: textColor,
              textAlign: 'center',
              marginTop: width * 0.15,
              fontSize: taskDateFontSize + 1,
              fontStyle: 'italic'
            }}>
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
    flexDirection: 'column',
  },
  searchWrapper: {
    alignItems: 'center',
  },
  searchInput: {
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  arrowBack: {
    position: 'absolute',
    left: 15,
  },
  taskItem: {
    borderRadius: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    fontWeight: '600',
  },
  taskDate: {},
});
