import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';

function renderCategoryIcon(iconName: string, iconLib?: string, size = 24, color = "#fff") {
  if (!iconName) return null;
  switch (iconLib) {
    case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} />;
    case 'Octicons':
      return <Octicons name={iconName} size={size} color={color} />;
    default:
      return <Feather name="help-circle" size={size} color={color} />;
  }
}

const CategoriesScreen = ({ route }: { route: any }) => {
  const { darkMode } = useTheme();
  const [taskList, setTaskList] = useState(route.params.tasks);
  const navigation = useNavigation();


  const handleBackPress =() => {
    navigation.goBack();
  }

  const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';
  const checkColor = darkMode ? '#FFFFFF' : 'blue';

  const handleDelete = (taskId: string) => {
    const updatedList = taskList.filter((item: any) => item.id !== taskId);
    setTaskList(updatedList);
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.taskItem, { backgroundColor: cardColor }]}>
      <View style={[styles.iconCircle, { backgroundColor: item.categoryColor || '#6C63FF' }]}>
        {renderCategoryIcon(item.categoryIcon, item.categoryIconLib, 22, "#fff")}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, { color: textColor }]}>{item.description}</Text>
        <Text style={[styles.taskDate, { color: legendColor }]}>{item.date} {item.time}</Text>
        <Feather name='check' size={20} color={checkColor} style={styles.checkWrapper} />
      </View>
    </View>
  );

  const renderHiddenItem = (data: any) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        style={[styles.hiddenButton, { backgroundColor: 'red' }]}
        onPress={() => handleDelete(data.item.id)}
      >
        <Feather name="trash-2" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.innerTitleWrapper, {backgroundColor: cardColor}]}>
         <TouchableOpacity onPress={handleBackPress}>
             <MaterialIcons style={styles.navIcons} name="keyboard-arrow-left" size={35} color={textColor} />
                </TouchableOpacity>
                  <Text style={[styles.notiTittle, {color: textColor}]}>All Task</Text>
                  </View>
      <SwipeListView
        data={taskList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80}
        disableRightSwipe
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks found.</Text>}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  taskItem: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal: 30,
    width: width - 32,
    alignSelf: 'center',
    top: 18,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    left: 10,
  },
  taskDate: {
    fontSize: 13,
    color: '#888',
    left: 10,
  },
  checkWrapper: {
    position: 'absolute',
    left: 230,
    alignItems: 'center',
    top: 5,
  },
  hiddenItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 80,
    marginBottom: 10,
    paddingRight: 30,
    top: 10,
  },
  hiddenButton: {
    width: 70,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  noTaskText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40
  },
  innerTitleWrapper: {
  flexDirection: 'row',
  height: 70,
  width: 430,
  right: 28,
  borderBottomRightRadius: 45,
  
},
navIcons: {
  top: 23,
  left: 20,
},
notiTittle: {
  position: 'absolute',
  top: 29,
  left: '37%',
  fontSize: 20,
},
});

export default CategoriesScreen;
