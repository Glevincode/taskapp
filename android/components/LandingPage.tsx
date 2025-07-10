import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView, 
  SafeAreaView, 
  RefreshControl ,
  Image,
  useWindowDimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNotification } from './NotificationContext';
import { Searchbar } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from './ThemeContext';
import TaskOptionsMenu from './TaskOptionsMenu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function LandingPage({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profileUri, setProfileUri] = useState<string | null>(null);
const { notifications } = useNotification();

const notificationCount = notifications.length;

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };


  useEffect(() => {
  const fetchProfileUri = async () => {
    const uri = await AsyncStorage.getItem('profileUri');
      const saved = await AsyncStorage.getItem('username');
        setUsername(saved || 'User');
    setProfileUri(uri);
  };
  fetchProfileUri();

  const unsubscribe = navigation.addListener('focus', fetchProfileUri);
  return unsubscribe;
}, [navigation]);
  

  React.useEffect(() => {
    const fetchCredentials = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
    };
    fetchCredentials();
  }, []);

  const { addNotification } = useNotification();

  // Add handleEdit function
  const handleEdit = (item: any) => {
    navigation.navigate('AddTask', { ...item, isEdit: true });
  };

const handleDelete = () => {
  if (selectedTaskId) {
    const taskToDelete = tasks.find(task => task.id === selectedTaskId); 
    const updated = tasks.filter(task => task.id !== selectedTaskId);
    setTasks(updated);
    AsyncStorage.setItem('tasks', JSON.stringify(updated));
    setModalVisible(false);
    setSelectedTaskId(null);

    // ✅ Notify
   if (taskToDelete) {
  addNotification({
    id: Date.now().toString(),
    message: `Task "${taskToDelete.description}" was deleted`,
    date: new Date().toLocaleString(),
    icon: taskToDelete.icon || 'trash-outline',  
  });
}

  }
};
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('tasks');
      if (data) setTasks(JSON.parse(data));
      else setTasks([]);
    } catch {
      setTasks([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  
const searchedTasks = searchQuery.trim()
  ? tasks.filter(task =>
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : tasks;

  const getCategoryIconAndColor = (tasks: any[], categoryName: string) => {
    const task = [...tasks].reverse().find(t =>
      t.categoryName === categoryName ||
      (t.categories && t.categories[0]?.name === categoryName)
    );
    return {
      iconName: task?.categoryIcon || 'help-circle',
      iconLib: task?.categoryIconLib || 'Ionicons',
      color: task?.categoryColor || '#6C63FF',
    };
  };

  const tasksData = [
    {
      categoryName: 'Personal',
      categoryIcon: 'person',
      categoryIconLib: 'Ionicons',
      categoryColor: 'rgba(196, 181, 253, 0.4)',
    },
    {
      categoryName: 'Work',
      categoryIcon: 'briefcase',
      categoryIconLib: 'Ionicons',
      categoryColor: 'rgba(196, 181, 253, 0.4)',
    },
    {
      categoryName: 'Study',
      categoryIcon: 'school',
      categoryIconLib: 'Ionicons',
      categoryColor: 'rgba(196, 181, 253, 0.4)',
    },
  ];

 function getTaskProgress(tasks: any[], categoryName?: string) {
  const filtered = categoryName
    ? tasks.filter(t => t.categoryName === categoryName)
    : tasks;

  if (filtered.length === 0) return 0;

  const completed = filtered.filter(t => t.completed).length;
  return Math.round((completed / filtered.length) * 100);
}


  const personal = getCategoryIconAndColor(tasksData, 'Personal');
  const work = getCategoryIconAndColor(tasksData, 'Work');
  const study = getCategoryIconAndColor(tasksData, 'Study');

  function renderCategoryIcon(
    iconName: string,
    iconLib: string,
    size: number,
    color: string
  ) {
    switch (iconLib) {
      case 'Ionicons':
        return <Ionicons name={iconName} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      case 'Octicons':
        return <Octicons name={iconName} size={size} color={color} />;
      case 'Feather':
        return <Feather name={iconName} size={size} color={color} />;
      default:
        return <Ionicons name="help-circle" size={size} color={color} />;
    }
  }

  function getDaysLeftForCategory(tasks: any[], categoryName: string) {
  const today = new Date();
  // Find the next task for the category with a future date
  const nextTask = tasks
    .filter(t => t.categoryName === categoryName && t.date)
    .map(t => ({ ...t, dateObj: new Date(t.date) }))
    .filter(t => t.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

  if (!nextTask) return null;
  const diffTime = nextTask.dateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

  const getCount = (categoryName: string) => {
    return tasks.filter(task => task.categoryName === categoryName).length;
  };

    const { width } = useWindowDimensions();

  const titleFontSize = width * 0.045;     
  const subtitleFontSize = width * 0.035;

   const { darkMode } = useTheme();
  
    const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
    const cardColor = darkMode ? '#1f2937' : '#fff';
    const textColor = darkMode ? '#fff' : '#333';
    
    const projectCardPurpleColor = darkMode ? '#9333ea' : '#8b5cf6';  
    const projectCardPinkColor = darkMode ? '#dc2626' : '#f87171';     
    const projectCardGreenColor = darkMode ? '#a80e54' : '#a80e54';
    const iconColorOrganize = { backgroundColor: darkMode ? '#65a30d' : '#84cc16' };     
    const iconColorBoost = { backgroundColor: darkMode ? '#2563eb' : '#3b82f6' };         
    const iconColorCreate = { backgroundColor: darkMode ? '#c026d3' : '#d946ef' };       
    const iconColorDiscover = { backgroundColor: darkMode ? '#7c3aed' : '#8b5cf6' };    


    const taskColor = darkMode ? '#fff' : '#fff';

    const renderListHeader = () => (
       <>
            <View style={styles.headerRow}>
          <View style={styles.userInfo}>

            <TouchableOpacity onPress={handleProfilePress}>
           <View style={styles.userIcon}>
              {profileUri ? (
                <Image source={{ uri: profileUri }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              ) : (
                <FontAwesome5 name="user" size={20} color="white" />
              )}
            </View>
              </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: textColor }]}>Hi, <Text style={styles.greetingBold}>{username || "User"}!</Text></Text>
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>
          </View>
      <TouchableOpacity onPress={() => navigation.navigate('Bellnotification')} >
          <View style={{ position: 'relative', padding: 4 }}>
            <Feather name="bell" size={28} color="#6C63FF" />
            {notificationCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#fff',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
                </View>


                  <View style={styles.searchWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Searchbar
            style={[styles.searchbar, { backgroundColor: darkMode ? '#374151' : '#f2f2f2' }]}
            placeholder="Search tasks..."
            editable={false}  // disables typing directly
            pointerEvents="none"  
          />
        </TouchableOpacity>
        </View>

      {!searchQuery.trim() && (
        <View style={styles.categoriesWrapper}>
          <View style={styles.categoriesHeader}>
            <Text style={[styles.categoriesTitle, { color: textColor }]}>Categories</Text>

  
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsContainer}>
            
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddTask', {
              categoryIcon: personal.iconName,
              categoryIconLib: personal.iconLib,
              categoryColor: personal.color,
              categoryName: 'Personal',
            })
          }
        >
          <View style={[styles.projectCard, styles.projectCardPurple, {backgroundColor:projectCardPurpleColor} ]}>
            <View style={styles.daysLeftContainer}>
              <Text style={[styles.daysLeftTextPurple , { color: taskColor }]}>
              {getCount('Personal') > 0 ? `${getCount('Personal')} tasks` : 'No tasks'}
              </Text>
              <View style={styles.userCategoryWrapper}>
                <View style={{
                  backgroundColor: personal.color,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: -13,
                  right: 78,
                }}>
                  {renderCategoryIcon(personal.iconName, personal.iconLib, 22, "#fff")}
                </View>
              </View>
            </View>
            <Text style={styles.projectTitle}>Personal</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressCircles}>
                <FontAwesome5 name="circle" size={10} color="#d8b4fe" />
                <FontAwesome5 name="circle" size={10} color="#d8b4fe" />
                <FontAwesome5 name="circle" size={10} color="#d8b4fe" />
              </View>
              <Text style={styles.progressText}>
                Progress {getTaskProgress(searchedTasks, 'Personal')}%
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${getTaskProgress(searchedTasks, 'Personal')}%`,
                      backgroundColor: '#fca5a5',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddTask', {
              categoryIcon: work.iconName,
              categoryIconLib: work.iconLib,
              categoryColor: work.color,
              categoryName: 'Work',
            })
          }
        >
          <View style={[styles.projectCard, styles.projectCardPink, {backgroundColor: projectCardPinkColor}]}>
            <View style={styles.daysLeftContainer}>
              <Text style={[styles.daysLeftTextPink, { color: taskColor }]}>
                {getCount('Work') > 0 ? `${getCount('Work')} tasks` : 'No tasks'}
              </Text>
              <View style={styles.userCategoryWrapper}>
                <View style={{
                  backgroundColor: work.color,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: -13,
                  right: 78,
                }}>
                  {renderCategoryIcon(work.iconName, work.iconLib, 22, "#fff")}
                </View>
              </View>
            </View>
            <Text style={styles.projectTitle}>Work</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressCircles}>
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
              </View>
              <Text style={styles.progressText}>
                Progress {getTaskProgress(searchedTasks, 'Work')}%
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${getTaskProgress(searchedTasks, 'Work')}%`,
                      backgroundColor: '#fca5a5',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddTask', {
              categoryIcon: study.iconName,
              categoryIconLib: study.iconLib,
              categoryColor: study.color,
              categoryName: 'Study',
            })
          }
        >
          <View style={[styles.projectCard, styles.projectCardGreen, {backgroundColor: projectCardGreenColor}]}>
            <View style={styles.daysLeftContainer}>
              <Text style={[styles.daysLeftTextPink, { color: taskColor }]}>
                {getCount('Study') > 0 ? `${getCount('Study')} tasks` : 'No tasks'}
              </Text>
              <View style={styles.userCategoryWrapper}>
                <View style={{
                  backgroundColor: study.color,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: -13,
                  right: 78,
                }}>
                  {renderCategoryIcon(study.iconName, study.iconLib, 22, "#fff")}
                </View>
              </View>
            </View>
            <Text style={styles.projectTitle}>Study</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressCircles}>
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
                <FontAwesome5 name="circle" size={10} color="#fca5a5" />
              </View>
              <Text style={styles.progressText}>
                Progress {getTaskProgress(searchedTasks, 'Study')}%
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${getTaskProgress(searchedTasks, 'Study')}%`,
                      backgroundColor: '#fca5a5',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
                  </ScrollView>
                </View>
                )}
        <View style={styles.lastTaskWrapper}>
     
  
  <Text style={[styles.lastTaskTitle, { color: textColor }]}>
    {searchQuery.trim()
      ? 'Search Results'
      : tasks.length === 0
      ? 'Features'
      : 'Last Task'}
  </Text>

  {tasks.length > 0 && !searchQuery.trim() && (
    <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen', { tasks })}>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  )}
</View>

            {/* ✅ Show this when there are no tasks */}
   {!searchQuery.trim() && tasks.length === 0 && (
        <View style={styles.emptyTasksContainer}>

          {/* Card 1 */}
          <View style={[styles.taskBox, { backgroundColor: cardColor }]}>
            <View style={[styles.iconCircle, iconColorOrganize]}>
              <Ionicons name="calendar-outline" size={28} color={taskColor} />
            </View>
            <Text style={[styles.taskBoxTitle, { color: textColor, fontSize: titleFontSize }]}>Organize Your Day</Text>
            <Text style={[styles.taskBoxSubtitle, { color: textColor, fontSize: subtitleFontSize }]}>
              Plan your daily tasks and stay focused.
            </Text>
          </View>

          {/* Card 2 */}
          <View style={[styles.taskBox, { backgroundColor: cardColor }]}>
            <View style={[styles.iconCircle, iconColorBoost]}>
              <MaterialCommunityIcons name="rocket-launch-outline" size={28} color={taskColor} />
            </View>
            <Text style={[styles.taskBoxTitle, { color: textColor, fontSize: titleFontSize }]}>Boost Productivity</Text>
            <Text style={[styles.taskBoxSubtitle, { color: textColor, fontSize: subtitleFontSize }]}>
              Track and finish tasks to stay motivated.
            </Text>
          </View>

          {/* Card 3 */}
          <TouchableOpacity onPress={() => navigation.navigate('AddTask')}>
            <View style={[styles.taskBox, { backgroundColor: cardColor }]}>
              <View style={[styles.iconCircle, iconColorCreate]}>
                <Ionicons name="add-circle-outline" size={28} color={taskColor} />
              </View>
              <Text style={[styles.taskBoxTitle, styles.taskBoxContent, { color: textColor, fontSize: titleFontSize }]}>Create Your First Task</Text>
              <Text style={[styles.taskBoxSubtitle, { color: textColor, fontSize: subtitleFontSize }]}>
                Tap here to get started and achieve more!
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity onPress={() => navigation.navigate('AboutApp')}>
            <View style={[styles.taskBox, { backgroundColor: cardColor }]}>
              <View style={[styles.iconCircle, iconColorDiscover]}>
                <Ionicons name="sparkles-outline" size={28} color={taskColor} />
              </View>
              <Text style={[styles.taskBoxTitle, { color: textColor, fontSize: titleFontSize }]}>Discover TaskApp</Text>
              <Text style={[styles.taskBoxSubtitle, styles.tasktitle, { color: textColor, fontSize: subtitleFontSize }]}>
                Unlock powerful tools to boost your productivity journey!
              </Text>
            </View>
          </TouchableOpacity>

        </View>
      )}
    </>
  );
 return (
     <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
        <SwipeListView
           data={searchedTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
           <View style={[styles.taskItem , { backgroundColor: cardColor }]}>
           <View style={styles.menuWrapper}>
            <TaskOptionsMenu
                onEdit={() => navigation.navigate('AddTask', { task: item })}
                />
            </View>
              <View style={styles.taskInfo}>
                  <View style={[styles.taskIconPink, { backgroundColor: item.categoryColor || '#fca5a5' }]}>
                       {renderCategoryIcon(item.categoryIcon, item.categoryIconLib, 30, "#fff")}
                         </View>
                              <View>
                                <Text style={[styles.taskTitle, { color: textColor }]}>{item.description}</Text>
                                <Text style={[styles.taskDate, { color: textColor }]}>
                                  {item.date} {item.time}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                        renderHiddenItem={({ item }) => (
                          <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginHorizontal: 18,
                            marginBottom: 12,
                            top: 10,
                          }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: '#f87171',
                                borderRadius: 20,
                                width: 70,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                
                              }}
                              onPress={() => {
                                setSelectedTaskId(item.id);
                                handleDelete();
                              }}
                            >
                              <Feather name="trash-2" size={24} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        )}
                        rightOpenValue={-75}
                        disableRightSwipe
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListHeaderComponent={renderListHeader}
                        ListEmptyComponent={
                          <Text style={styles.noTaskText}>
                            {searchQuery.trim() ? 'No tasks match your search.' : 'No recent tasks.'}
                          </Text>
                        }
                      />
                      
                    </SafeAreaView>
                  );
                 }

            const styles = StyleSheet.create({
              safeArea: {
                flex: 1,
                backgroundColor: '#F5F7FA',
              },
              scrollContent: {
                flexGrow: 1,
                paddingBottom: 40,
                backgroundColor: '#F5F7FA',
              },
              headerRow: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
                paddingTop: 18,
                paddingBottom: 8,
                top: 15,
              },

              searchbar:{
                width: '90%',
              },
              searchWrapper:{
                top: 27,
                left: 17,
              },


              
              userInfo: {
                flexDirection: 'row',
                alignItems: 'center',
              },

              projectImage: {
                width: 120,
                height: 120,
                borderRadius: 12,
                marginTop: 10,
                alignSelf: 'center',
                position: 'absolute',
                top: 20,
                  
                marginBottom: 10,
              },
              userIcon: {
                backgroundColor: '#fca5a5',
                borderRadius: 50,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 15,
              },
              greeting: {
                fontSize: 20,
                fontWeight: '600',
                color: '#111827',
              },
              greetingBold: {
                fontWeight: '700',
              },
              welcomeText: {
                fontSize: 14,
                color: '#9ca3af',
              },
              bellIcon: {
                marginLeft: 10,
              },
              
              
              categoriesWrapper: {
                marginTop: 60,
                marginHorizontal: 18,
              },
              categoriesHeader: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              },
              categoriesTitle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333333',
              },
              seeAllText: {
                fontSize: 14,
                color: '#6C63FF',
                fontWeight: 'bold',
              },
              projectsContainer: {
                flexDirection: 'row',
                marginBottom: 10,
              },
              projectCard: {
                borderRadius: 24,
                padding: 16,
                width: 165,
                height: 165,
                marginRight: 16,
                justifyContent: 'space-between',
              },
              projectCardPurple: {
                backgroundColor: '#8b5cf6',
              },
              projectCardPink: {
                backgroundColor: '#f87171',
              },
              projectCardGreen: {
                backgroundColor: '#a80e54',
              },
              daysLeftContainer: {
                backgroundColor: 'rgba(196, 181, 253, 0.4)',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                marginBottom: 6,
                left: 75,
              },
              daysLeftTextPurple: {
                fontSize: 10,
                color: '#c4b5fd',
                left: 5,
              },
              daysLeftTextPink: {
                fontSize: 10,
                color: '#fca5a5',
                
              },
              userCategoryWrapper: {
                marginLeft: 8,
              },
              projectTitle: {
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginVertical: 12,
              },
              progressRow: {
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              },
              progressCircles: {
                flexDirection: 'row',
                width: 40,
                justifyContent: 'space-between',
                marginRight: 6,
                
              },
              progressText: {
                fontSize: 10,
                color: '#c4b5fd',
                marginLeft: 4,
                marginRight: 4,
                
                
              },
              progressTextPink: {
                fontSize: 10,
                color: '#fca5a5',
                marginLeft: 4,
                marginRight: 4,
                top: 10,
              },
              progressBarContainer: {
                height: 8,
                backgroundColor: '#e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                marginLeft: 6,
                marginRight: 6,
                flex: 1,
              },
              progressBar: {
                height: 8,
                borderRadius: 8,
              },
              lastTaskWrapper: {
                marginTop: 30,
                marginHorizontal: 18,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              
              },
              lastTaskTitle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333333',
                marginBottom: 10,
              },
              taskItem: {
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 12,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                top: 10,
                marginBottom: 12,
                marginHorizontal: 18,
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

              menuWrapper: {
              position: 'absolute',
              top: 15,
              right: 10,
              zIndex: 10,
            },

              checkIcons: {
                flex: 1,
                position: 'absolute',
                marginLeft: 300,
              },
              taskIconPink: {
                backgroundColor: '#fca5a5',
                borderRadius: 50,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              },
              taskTitle: {
                fontSize: 15,
                fontWeight: '600',
                color: '#111827',
                flexShrink: 1,
                flexWrap: 'wrap',
                maxWidth: 200,
              },
              taskDate: {
                fontSize: 13,
                color: '#9ca3af',
              },
              verticalIcons: {
                marginLeft: 18,
              },
              noTaskText: {
                fontSize: 14,
                color: '#888888',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: 30,
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
                width: 320,
                maxHeight: 400,
                alignItems: 'center',
                elevation: 8,
              },
              modalTitle: {
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 12,
              },
              modalTaskRow: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 16,
              },
              iconClose: {
                position: 'absolute',
                top: 10,
                right: 10,
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
            emptyTasksContainer: {
              marginTop: 20,
              gap: 13,
              paddingHorizontal: 20,
            },

            taskBox: {
              borderRadius: 20,
              padding: 18,
              elevation: 4,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              alignItems: 'center',
              paddingVertical: 20,
            },

            iconCircle: {
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
              position: 'absolute',
              marginRight: '80%',
              marginTop: 15,
            },

            taskBoxTitle: {
              fontWeight: 'bold',
              marginBottom: 4,
              marginRight: 20,
            },

            taskBoxSubtitle: {
              fontSize: 11,
              textAlign: 'center',
              lineHeight: 18,
              marginLeft: 20,
            },
            taskBoxContent: {
              marginLeft: 20,
            },

            tasktitle:{
            marginLeft: 50,

            },

            });

            export default LandingPage;