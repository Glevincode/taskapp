import React, { useState, useCallback,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, ScrollView, RefreshControl, Pressable, Alert,Dimensions,
  KeyboardAvoidingView, Platform,
 } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import categoriesIcons from '../category/categoriesIcon';

import { useNotification } from './NotificationContext';
import { useTheme } from './ThemeContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


function renderCategoryIcon(iconName: string, iconLib: string, size: number, color: string) {
  switch (iconLib) {
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={size} color={color} />;
    case 'Octicons':
      return <Octicons name={iconName} size={size} color={color} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={size} color={color} />;
       case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} />;
    default:
      return <Ionicons name={iconName} size={size} color={color} />;
  }
}

const lightColors = [
  '#ec4899',  // Pink Vibrant
  '#0ea5e9',  // Sky Blue
  '#14b8a6',  // Teal
  '#8b5cf6',  // Violet
  '#ef4444',  // Bright Red
  '#f97316',  // Orange Bold
  '#3b82f6',  // Blue Modern
  '#84cc16',  // Lime Green
  '#e11d48',  // Rose Red
  '#d946ef',  // Fuchsia Purple
];

const darkColors = [
  '#be185d',  // Darker Pink
  '#0369a1',  // Darker Sky Blue
  '#0f766e',  // Dark Teal
  '#7c3aed',  // Dark Violet
  '#b91c1c',  // Dark Bright Red
  '#c2410c',  // Dark Orange
  '#1e40af',  // Dark Blue
  '#4d7c0f',  // Dark Lime
  '#be123c',  // Dark Rose
  '#a21caf',  // Dark Fuchsia
];


const iconData = [
  {
    id: '1',
    name: 'Business',
    color: '#f87171',
    iconName: 'briefcase',  
    iconLib: 'Feather'     
  },
  {
    id: '2',
    name: 'Personal',
    color: '#6C63FF',
    iconName: 'user',         
    iconLib: 'FontAwesome5',  
  },
  {
    id: '3',
    name: 'Review',
    color: '#a80e54',
    iconName: 'book',         // Ionicons icon
   iconLib: 'Ionicons',
  },
];


function AddTask({ navigation, route }: { navigation: any, route: any }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
 const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
 const [isAddCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
const [newCategoryName, setNewCategoryName] = useState('');
const [newCategoryColor, setNewCategoryColor] = useState('#6C63FF'); // Default
const [newCategoryIcon, setNewCategoryIcon] = useState('star'); // Example default
 const [bottomSheetAddVisible, setBottomAddSheetVisible] = useState(false);

 const [allCategories, setAllCategories] = useState([...iconData]);


const [iconSearch, setIconSearch] = useState('');
  const { addNotification } = useNotification();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirmTime = (time: Date) => {
    let formattedTime = time
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    formattedTime = formattedTime.replace('am', 'AM').replace('pm', 'PM');
    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleAddTask = async () => {
    // Validation
    if (!selectedDate || !selectedTime || !description.trim() || selectedCategories.length === 0) {
      Alert.alert('Please fill all fields.');
      return;
    }

    const mainCategory = selectedCategories[0];
    const newTask = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedTime,
      categories: selectedCategories,
      description: description,
      categoryIcon: mainCategory?.categoryIcon,
      categoryIconLib: mainCategory?.categoryIconLib,
      categoryColor: mainCategory?.color,
      categoryName: mainCategory?.name,
        checked: false, 
    };

    // Save to AsyncStorage
    const data = await AsyncStorage.getItem('tasks');
    let tasks = [];
    if (data) tasks = JSON.parse(data);
    tasks.push(newTask);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

    // Track task count
    let taskCount = parseInt(await AsyncStorage.getItem('taskCount') || '0');
    taskCount += 1;
    await AsyncStorage.setItem('taskCount', taskCount.toString());

    // Prompt login if count reaches 5
    if (taskCount === 5) {
      navigation.navigate('LoginPrompt' as never);
      
    }



addNotification({
  id: Date.now().toString(),
  message: `Added a task "${description}" for today at ${selectedTime}`,
  date: new Date().toLocaleString(),
  icon: selectedCategories[0]?.categoryIcon || 'notifications-outline',
});


    // Reset fields and navigate
    setSelectedDate(null);
    setSelectedTime(null);
   selectedCategories[0]?.categoryIcon
    setDescription('');
    navigation.navigate('TaskItems');
  };


   // Darkmode 
const { darkMode } = useTheme();
const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
const cardColor = darkMode ? '#1f2937' : '#FFFFFF';
const textColor = darkMode ? '#fff' : '#333';
const inputBg = darkMode ? '#334155' : '#f3f4f6';
const borderColor = darkMode ? '#475569' : '#e5e7eb';
const availableColors = darkMode ? darkColors : lightColors;

  const loadData = useCallback(async () => {
    const data = await AsyncStorage.getItem('tasks');
    let tasks = [];
    if (data) tasks = JSON.parse(data);
    return tasks;
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


  useEffect(() => {
    if (route.params?.task) {
      setDescription(route.params.task.description || '');
      setSelectedDate(route.params.task.date || '');
      setSelectedTime(route.params.task.time || '');
      setSelectedCategories(route.params.task.categories || []);
    }

  }, [route.params]);

  const handleSave = async () => {
  const tasksRaw = await AsyncStorage.getItem('tasks');
  const tasks = tasksRaw ? JSON.parse(tasksRaw) : [];

  if (route.params?.task) {


    // Edit mode: update only the fields that changed
    const updatedTasks = tasks.map((t: any) =>
      t.id === route.params.task.id
        ? { ...t, description, date: selectedDate, time: selectedTime }
        : t
    );
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  } else {


    // Add mode: add new task
    const newTask = {
      id: Date.now().toString(),
      description,
      date: selectedDate,
      time: selectedTime,
      
    };
    await AsyncStorage.setItem('tasks', JSON.stringify([newTask, ...tasks]));
  }
  navigation.goBack();
};

const handleAddNewCategory = () => {
  if (!newCategoryName.trim()) {
    Alert.alert('Please enter a category name.');
    return;
  }

  const newId = Date.now().toString();  // Use timestamp for guaranteed uniqueness

  const category = {
    id: newId,
    name: newCategoryName,
    color: newCategoryColor,
    iconName: newCategoryIcon,
    iconLib: 'Ionicons',
  };

  setAllCategories(prev => [category, ...prev]);  

  setNewCategoryName('');
  setNewCategoryColor('#6C63FF');
  setNewCategoryIcon('star');
  setAddCategoryModalVisible(false);
};



const filteredIcons = categoriesIcons.filter(icon =>
  icon.title?.toLowerCase().includes(iconSearch.toLowerCase()) ||
  icon.name?.toLowerCase().includes(iconSearch.toLowerCase())

  
);

  return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor:cardColor }}>
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: bgColor,flexGrow: 1, justifyContent: 'space-between' }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerTitleWrapper}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons style={styles.navIcons} name="keyboard-arrow-left" size={30} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.text, { color: textColor }]}>AddTask</Text>
       <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
            <Feather name="more-vertical" size={30} color={textColor} />
          </TouchableOpacity>
      </View>

      <View style={[styles.modalContainer, { backgroundColor: cardColor }]}>
        {/* Task Date Section */}
        <View style={styles.datePickerWrapper}>
          <Text style={[styles.textTittleTask, { color: textColor }]}>TaskDate</Text>
          <TouchableOpacity style={[styles.dateButton, { backgroundColor: inputBg, borderColor: borderColor }]} onPress={showDatePicker}>
            <Text style={[styles.dateButtonText, { color: textColor }]}>
              {selectedDate ? selectedDate : 'Select Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            display='spinner'
            onCancel={hideDatePicker}
          />
        </View>
        <View style={styles.datePickerWrapper}>
          <Text style={[styles.textTittleTask, { color: textColor }]}>TaskTime</Text>
          <TouchableOpacity style={[styles.dateButton, { backgroundColor: inputBg, borderColor: borderColor }]} onPress={showTimePicker}>
            <Text style={[styles.dateButtonText, { color: textColor }]}>
              {selectedTime ? selectedTime : 'Select Time'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
            minuteInterval={1}
            is24Hour={false}
            display="spinner"
            themeVariant={darkMode ? 'dark' : 'light'}  
          />
        </View>

  
                <View style={styles.categoriesWrapper}>
            <Text style={[styles.categoriesTitle, { color: textColor }]}> Categories</Text>
          <FlatList
            contentContainerStyle={styles.categoriesList}
            data={[
              { id: 'add', isAdd: true },     // ➕ Add button always first
              ...allCategories,               // ✅ New categories + existing ones
            ]}
            renderItem={({ item }) =>
                'isAdd' in item && item.isAdd ? (
              <TouchableOpacity
           onPress={() => setBottomAddSheetVisible(true)}
            style={[styles.addIconButton, { backgroundColor: inputBg, borderColor: borderColor }]}
          >
            <Ionicons name="add" size={35} color="#6C63FF" />
          </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if ('iconLib' in item) {
                      setSelectedCategories([{
                        id: item.id,
                        color: item.color,
                        categoryIcon: item.iconName,
                        categoryIconLib: item.iconLib,
                        name: item.name,
                      }]);
                    }
                  }}
                  style={[
                    styles.categoryItem,
                    { backgroundColor: 'color' in item ? item.color : inputBg },
                  ]}
                >
                  
                  {'iconName' in item && 'iconLib' in item && renderCategoryIcon(item.iconName, item.iconLib, 30, "white")}
                  
                  {selectedCategories[0]?.id === item.id && (
                    <View style={{
                      position: 'absolute',
                      top: 15,
                      left: 15,
                      width: 30,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 15,
                      backgroundColor: 'rgba(146, 44, 44, 0.35)',
                    }}>
                      <Ionicons name="checkmark" size={35} color="#10b981" style={{ bottom: 5 }} />
                    </View>
                  )}
                </TouchableOpacity>
              )
            }
           keyExtractor={item => item.id} 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
          </View>

              

             <Modal
                visible={bottomSheetAddVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setBottomAddSheetVisible(false)}
              >
                  <Pressable
                  style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                  onPress={() => setBottomAddSheetVisible(false)}
                >
              
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: cardColor,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      padding: 20,
                      
                    }}
                  >
                    {/* Drag handle */}
                    <View
                      style={{
                        width: 40,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: '#9ca3af',
                        alignSelf: 'center',
                        marginBottom: 16,
                      }}
                    />

             
              

                {/* Icon Picker */}
                <Text style={{ color: textColor, marginBottom: 6, alignSelf: 'flex-start' }}>Search Task Icons</Text>
                            <TextInput
              placeholder="Search icons..."
              value={iconSearch}
              onChangeText={setIconSearch}
              style={{
                borderWidth: 1,
                borderColor: borderColor,
                borderRadius: 30,
                padding: 10,
                width: '100%',
                marginBottom: 12,
                color: textColor,
                backgroundColor: inputBg,
              }}
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
            />
              <Text style={{ color: textColor, marginBottom: 6, alignSelf: 'flex-start' }}>Pick Icons</Text>

             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {filteredIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={`${icon.name}-${index}`}  
                      style={{
                        marginRight: 12,
                        padding: 8,
                        borderRadius: 30,
                        backgroundColor: newCategoryIcon === icon.name ? '#e0e7ff' : 'transparent',
                        borderWidth: newCategoryIcon === icon.name ? 2 : 0,
                        borderColor: '#6C63FF',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 60,
                        height: 60,
                      }}
                      onPress={() => {
                        setNewCategoryIcon(icon.name);
                        setNewCategoryName(
                          icon.title.charAt(0).toUpperCase() +
                          icon.title.slice(1).replace(/-/g, ' ')
                        );
                      }}
                    >
                      {renderCategoryIcon(icon.name, icon.lib, 28, "#6C63FF")}
                    </TouchableOpacity>
                  ))}
                </ScrollView>


            <TextInput
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  style={{
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 8,
                    padding: 10,
                    width: '100%',
                    marginBottom: 12,
                    color: textColor,
                    backgroundColor: inputBg,
                    textAlign: 'center'
                  }}
                  placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
                />
                {/* Color Picker */}
                <Text style={{ color: textColor, marginBottom: 6, alignSelf: 'flex-start' }}>Pick Color</Text>
                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                  {availableColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: color,
                        marginRight: 10,
                        borderWidth: newCategoryColor === color ? 3 : 1,
                        borderColor: newCategoryColor === color ? '#6C63FF' : '#e5e7eb',
                      }}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#6C63FF',
                    borderRadius: 8,
                    paddingVertical: 17,
                    paddingHorizontal: 25,
                    marginTop: 10,
                    width: 360,
                  }}
                 onPress={() => {
                  handleAddNewCategory();
                  setBottomAddSheetVisible(false); 
                }}
                              
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold',textAlign: 'center' }}>Add Category</Text>
                </TouchableOpacity>
              
              </View>
              </Pressable>
          </Modal>

        {/* Description Section */}
        <View style={styles.descriptionWrapper}>
          <Text style={[styles.descriptionTitle, { color: textColor }]}>Description</Text>
          <TextInput
            style={[styles.descriptionInput, { backgroundColor: inputBg, borderColor: borderColor, color: textColor }]}
            placeholder={"WriteTask"}
            placeholderTextColor= {darkMode ? '#9ca3af' : '#6b7280'}
            textAlignVertical="top"
            multiline={true}
            numberOfLines={4}
            onChangeText={setDescription}
            value={description}

          />
        </View>
        <Modal
                visible={bottomSheetVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setBottomSheetVisible(false)}
              >
                <Pressable
                  style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                  onPress={() => setBottomSheetVisible(false)}
                >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: cardColor,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      padding: 20,
                      paddingBottom: 100,
                    }}
                  >
                    {/* Drag handle */}
                    <View
                      style={{
                        width: 40,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: '#9ca3af',
                        alignSelf: 'center',
                        marginBottom: 16,
                      }}
                    />
                   

                  <View style={{ marginBottom: 24, alignItems: 'center',top: 20 }}>
                    <FlatList
                      data={iconData}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 18, paddingHorizontal: 8 }}
                          renderItem={({ item }) => (
                            <View
                              style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: cardColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: item.color,
                                shadowColor: item.color,
                                shadowOpacity: 0.25,
                                shadowRadius: 8,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 6,
                              position: 'relative',
                              }}
                            >
                              <View
                                style={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 26,
                                  backgroundColor: item.color,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                {renderCategoryIcon(item.iconName, item.iconLib, 28, "#fff")}
                              </View>
                            </View>
                          )}
                          keyExtractor={item => item.id}
                          style={{ maxHeight: 70, width: '100%' }} // Show all icons, scrollable
                        />
                      </View>

                    {/* Group: General Actions */}
                    <TouchableOpacity
                      style={[styles.sheetBtn, { backgroundColor: '#38bdf8' }]}
                      onPress={() => {
                        setBottomSheetVisible(false);
                        navigation.navigate('TaskItems');
                      }}
                    >
                      <Text style={styles.sheetBtnText}>Go to Task List</Text>
                    </TouchableOpacity>

                  
</View>


                </Pressable>
              </Modal>

        {/* Create Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleAddTask}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
</KeyboardAvoidingView>
  );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  innerTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },
  navIcons: {
    marginRight: 10,
  },
  modalContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingTop: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  datePickerWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  textTittleTask: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  categoriesWrapper: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  addIconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    borderWidth: 1,
  },
  descriptionWrapper: {
    marginTop: 35,
    width: '90%',
    alignSelf: 'center',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
 descriptionInput: {
  borderRadius: 15,
  padding: 10,
  fontSize: 16,
  width: '100%',
  minHeight: 100,      
  maxHeight: 150,      
  borderWidth: 1,
  textAlignVertical: 'top',
},

  buttonWrapper: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  createButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  sheetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default AddTask;