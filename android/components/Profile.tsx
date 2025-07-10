import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useLanguage } from './LanguageContext';
import { launchImageLibrary,launchCamera  } from 'react-native-image-picker';
import { useNotification } from './NotificationContext';
import { useTheme } from './ThemeContext';


type RootStackParamList = {
  Login: undefined;
  Privacy: undefined;
  Started: undefined;
};

const Profile = ({ onImageChange }: { onImageChange?: (uri: string | null) => void } = {}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
 const { darkMode, toggleDarkMode } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const userName = "Glevin Bonganciso";
  const [newUserName, setNewUserName] = useState(userName);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [profileName, setProfileName] = useState('');
  const { addNotification } = useNotification();
   const [notificationEnabled, setNotificationEnabled] = useState(true);

  const getProfileName = async () => {
    const username = await AsyncStorage.getItem('username');
    return username || '';
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('username');
      if (saved) setUsername(saved);
    })();
  }, []);

  const saveUsername = async () => {
    setUsername(input);
    await AsyncStorage.setItem('username', input);
    setEditing(false);
    setProfileName(input);
    addNotification(`You updated your profile name to "${input}"`);
  };

  useEffect(() => {
    const fetchProfileName = async () => {
      const name = await getProfileName();
      setProfileName(name);
    };
    fetchProfileName();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('rememberMe');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Started' }],
    });
  };

  const handleProfileIconPress = () => {
    setModalVisible(true);
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri || null;
        setProfileImage(uri);
        if (uri !== null) {
          await AsyncStorage.setItem('profileUri', uri);
        }
        addNotification(`You updated your profile picture`);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem('profileUri');
      if (uri) setProfileImage(uri);
    })();
  }, []);

 const containerStyle = [
  styles.container,
  { backgroundColor: darkMode ? '#0f172a' : '#F5F7FA' }
];
  const bgColor = darkMode ? '#0f172a' : '#fff';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';


useEffect(() => {
    AsyncStorage.getItem('notificationEnabled').then(val => {
      if (val !== null) setNotificationEnabled(val === 'true');
    });
  }, []);

  const toggleNotification = async () => {
    const newValue = !notificationEnabled;
    setNotificationEnabled(newValue);
    await AsyncStorage.setItem('notificationEnabled', newValue ? 'true' : 'false');
  };

  const handleCameraPress = () => {
  launchCamera({ mediaType: 'photo', quality: 0.5 }, async (response) => {
    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri || null;
      setProfileImage(uri);
      if (uri !== null) {
        await AsyncStorage.setItem('profileUri', uri);
      }
      addNotification(`You updated your profile picture`);
    }
  });
};

  

  return (
    <View style={containerStyle}>
      <View style={styles.coverContainer}>
        <Image
          source={require('../assets/cover.png')}
          style={styles.coverImage}
        />
        <View style={styles.coverOverlay} />
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Feather name="user" size={48} color="#6C63FF" />
              </View>
            )}
          </TouchableOpacity>


          <Modal
                  visible={modalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setModalVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', bottom: 50 }}
                    onPress={() => setModalVisible(false)}
                  >
                    <View style={{ backgroundColor: cardColor, borderRadius: 12, padding: 24, width: 250 }}>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                        onPress={() => {
                          setModalVisible(false);
                          handleCameraPress();
                        }}
                      >
                        <Feather name="camera" size={22} color="#6C63FF" />
                        <Text style={{ marginLeft: 12, fontSize: 16, color: textColor }}>Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                          setModalVisible(false);
                          launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, async (response) => {
                            if (response.assets && response.assets.length > 0) {
                              const uri = response.assets[0].uri || null;
                              setProfileImage(uri);
                              if (uri !== null) {
                                await AsyncStorage.setItem('profileUri', uri);
                              }
                              addNotification(`You updated your profile picture`);
                            }
                          });
                        }}
                      >
                        <Feather name="image" size={22} color="#6C63FF" />
                        <Text style={{  marginLeft: 12, fontSize: 16, color: textColor }}>Choose from Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                </Modal>
                          {editing ? (
                            <View style={styles.editRow}>
                              <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="Enter username"
                                style={styles.input}
                              />
                              <TouchableOpacity onPress={saveUsername}>
                                <Feather name="check" size={22} color="#6C63FF" />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.editRow}>
                              <Text style={[styles.username, { color: textColor }]}>{username || 'No username'}</Text>
                              <TouchableOpacity onPress={() => { setInput(username); setEditing(true); }}>
                                <Feather name="edit-2" size={20} color="#6C63FF" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.dropWrapper}>
                        <View style={styles.row}>
                          <Feather name="moon" size={20} color="#6C63FF" />
                          <Text style={[styles.buttonText, { color: textColor }]}>Dark Mode</Text>
                    <Switch
                  value={darkMode}
                  style={{ marginLeft: 'auto' }}
                  onValueChange={toggleDarkMode}
                  thumbColor={darkMode ? "#6C63FF" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#a5b4fc" }}
                />
                        </View>
                        

        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Feather name="log-out" size={20} color="#f87171" />
          <Text style={[styles.buttonText, { color: textColor }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 0
  },
  coverContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 80
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
   
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  profileImageContainer: {
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    alignItems: 'center',
    
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff'
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff'
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    left: 15,
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 10
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 18,
    marginRight: 10
  },
  dropWrapper: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
    
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#333'
  },
});

export default Profile;
