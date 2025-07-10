import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Spinner from 'react-native-loading-spinner-overlay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeContext';


function Started() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const imageTranslateY = useRef(new Animated.Value(-100)).current;
  const textTranslateY = useRef(new Animated.Value(100)).current;
  const [showText, setShowText] = useState(false);
  const navigation = useNavigation();
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [signUpPasswordVisible, setSignUpPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const isFocused = useIsFocused();
  const [signUpRetypePassword, setSignUpRetypePassword] = useState('');
  const [signUpRetypePasswordVisible, setSignUpRetypePasswordVisible] = useState(false);
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

 

useEffect(() => {
  FingerprintScanner
    .isSensorAvailable()
    .then(() => setIsFingerprintAvailable(true))
    .catch(() => setIsFingerprintAvailable(false));

  // Optional: cleanup
  return () => {
    FingerprintScanner.release();
  };
}, []);


  useEffect(() => {
    Animated.timing(imageTranslateY, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    

    const timer = setTimeout(() => {
      setShowText(true);
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);



    return () => clearTimeout(timer);
  }, []);

  const handleFingerprintAuth = () => {
    FingerprintScanner.authenticate({
      title: 'Authentication Required',
      description: 'Use your fingerprint to unlock',
    })
      .then(() => {
        FingerprintScanner.release();
        setLoading(true);
        setTimeout(() => {
          navigation.navigate('LandingPage' as never);
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        FingerprintScanner.release();
        Alert.alert('Authentication Failed', error.message);
      });
  };

  // Login handler
  const handleLogin = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');
    if (
      loginUsername === storedUsername &&
      loginPassword === storedPassword &&
      loginUsername !== ''
    ) {
      setLoginError('');
      setShowLoginModal(false);
      setLoading(true);
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }
      setTimeout(() => {
        navigation.navigate('LandingPage' as never);
        setLoading(false);
      }, 1500);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // On mount, check remember me
  useEffect(() => {
    AsyncStorage.getItem('rememberMe').then(val => {
      if (val === 'true') setRememberMe(true);
    });
  }, []);


  // Sign Up handler
 const handleSignUp = async () => {
  if (!signUpUsername || !signUpPassword || !signUpRetypePassword) {
    setSignUpError('Please fill all fields');
    return;
  }
  if (signUpPassword !== signUpRetypePassword) {
    setSignUpError('Passwords do not match');
    return;
  }
  await AsyncStorage.setItem('username', signUpUsername);
  await AsyncStorage.setItem('password', signUpPassword);
  setSignUpError('');
  setShowSignUpModal(false);
  setLoading(true);
  setJustSignedUp(true); // set flag
  setTimeout(() => {
    navigation.navigate('LandingPage' as never);
    setLoading(false);
  }, 1500);
};

  useEffect(() => {
    const checkAccount = async () => {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      setAccountExists(!!username && !!password);
    };
    checkAccount();
  }, [showSignUpModal, isFocused]); // re-check after sign up or when s

  const handleResetAccount = async () => {
  await AsyncStorage.removeItem('username');
  await AsyncStorage.removeItem('password');
  await AsyncStorage.removeItem('rememberMe');
  setAccountExists(false);
  setLoginUsername(''); 
  setLoginPassword('');
  setSignUpUsername('');
  setSignUpPassword('');
  Alert.alert('Account Reset', 'Your account has been reset.');
};

useEffect(() => {
  if (accountExists && !showSignUpModal && !justSignedUp) {
    handleFingerprintAuth();
  }
}, [accountExists, showSignUpModal, justSignedUp]);


const { darkMode } = useTheme();

 const bgColor = darkMode ? '#0f172a' : '#F9F9F9';
  const textColor = darkMode ? '#fff' : '#333';
  const cardColor = darkMode ? '#1f2937' : '#FFFFFF';
  const buttonColor = darkMode ? '#7c3aed' : '#6C63FF';
  const signColor = darkMode ? '#16a34a' : '#22c55e';

  return (
    <View style={{...styles.container, backgroundColor: bgColor}}>
      <View style={styles.ImageWrapper}>
        <TouchableOpacity
            onPress={handleResetAccount}
            style={[styles.resetWrapper, { marginBottom: 500, backgroundColor: buttonColor }]}
          >
            <Text style={styles.textAccount}>Reset App</Text>
          </TouchableOpacity>
                  <Animated.Image
          source={require('../assets/image1.png')}
          style={[styles.image, { transform: [{ translateY: imageTranslateY }] }]}
          resizeMode="contain"
        />
        {showText && (
          <Animated.View style={[styles.textBlock, { transform: [{ translateY: textTranslateY }] }]}>
            <Text style={[styles.textWrapper, { color: textColor }]}>Boost Your Productivity,</Text>
            <Text style={[styles.textWrapper, { color: textColor }]}>Finish Tasks Smarter</Text>
            <Text style={[styles.textTittleWrapper1, { color: textColor }]}>Organize, track, and prioritize your tasks</Text>
            <Text style={[styles.textTittleWrapper, { color: textColor }]}>anytime, anywhere with TaskApp</Text>
          </Animated.View>
        )}
      </View>

      {loading && (
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF' }}
          overlayColor="rgba(0, 0, 0, 0.5)"
          animation="fade"
          size="large"
          color="#FFF"
        />
      )}
{accountExists && !showSignUpModal && (
  isFingerprintAvailable ? (
    <TouchableOpacity
      onPress={handleFingerprintAuth}
      style={[styles.button,{backgroundColor: buttonColor}]}
    >
      <Text style={styles.textTittle}>
        Unlock with Fingerprint
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => setShowLoginModal(true)}
      style={[
        styles.button,
        { backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
      ]}
    >
      <Feather name="log-in" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.textTittle}>Login</Text>
    </TouchableOpacity>
  )
)}


    {!accountExists && (
  <>
    <TouchableOpacity
      onPress={() => setShowLoginModal(true)}
      style={[styles.button, { marginTop: 20, backgroundColor: buttonColor , flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
    >
      <Feather name="log-in" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.textTittle}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setShowSignUpModal(true)}
      style={[styles.button, { marginTop: 20, backgroundColor: signColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
    >
      <Feather name="user-plus" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.textTittle}>Sign Up</Text>
    </TouchableOpacity>
 </>
)}
      {/* Login Modal */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer,{backgroundColor:cardColor}]}>
            <Text style={[styles.modalTitle,{color: textColor}]}>Login</Text>
            {loginError ? (
              <Text style={{ color: 'red', marginBottom: 10 }}>{loginError}</Text>
            ) : null}
               <View style={{ width: '100%', position: 'relative' }}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color="#6b7280"
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 29,
                    zIndex: 10,
                    color: textColor,
                  }}
                />
            <TextInput
              placeholder="Username"
              
              value={loginUsername}
              onChangeText={setLoginUsername}
             style={[styles.input, { paddingLeft: 48, color: textColor }]}
              placeholderTextColor="#9ca3af"
              accessibilityLabel="Username input field"
              autoCapitalize="none"
            />
            </View>
            <View style={{ width: '100%', position: 'relative' }}>
                 <MaterialIcons
                  name="lock"
                  size={20}
                  color="#6b7280"
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 29,
                    zIndex: 10,
                    color: textColor,
                  }}
                />
              <TextInput
                placeholder="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                 placeholderTextColor="#9ca3af"
               style={[styles.input, { paddingLeft: 48, color: textColor }]}
                secureTextEntry={!loginPasswordVisible}
                onSubmitEditing={handleLogin}

              />
           <TouchableOpacity
                style={{ position: 'absolute', right: 20, top: 29 }}
                onPress={() => setLoginPasswordVisible(v => !v)}
              >
                <Feather name={loginPasswordVisible ? 'eye' : 'eye-off'} size={17} color="#888" />
              </TouchableOpacity>
            </View>
            <View style={styles.rememberMeRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setRememberMe(v => !v)}
              >
                {rememberMe ? (
                  <Feather name="check-square" size={17} color="#007AFF" />
                ) : (
                  <Feather name="square" size={17} color="#888" />
                )}
              </TouchableOpacity>
              <Text style={[{ marginLeft: 8, fontSize: 16,color: textColor }]}>Remember Me</Text>
            </View>
            
            <Pressable
              onPress={handleLogin}
              style={[styles.Authbutton, { marginTop: 10,backgroundColor: buttonColor }]}
            >
              <Text style={styles.textSignIn}>Login</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                await AsyncStorage.removeItem('password');
                setLoginPassword('');
                Alert.alert('Password Reset', 'Your password has been cleared. Please sign up again or contact support.');
              }}
              style={{ marginTop: 15, marginBottom: 5 }}
            >
              <Text style={{ color: '#007AFF', textAlign: 'center', textDecorationLine: 'underline' }}>
                Forgot Password?
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowLoginModal(false);
                setShowSignUpModal(true);
              }}
              style={{ marginTop: 20 }}
            >
              <Text style={{ color: '#007AFF', textAlign: 'center' }}>
                Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
              </Text>
            </Pressable>
          <View style={{ width: '100%', alignItems: 'flex-end', position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
              <TouchableOpacity onPress={() => setShowLoginModal(false)}>
                <Feather name="x" size={28} color={textColor}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sign Up Modal */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={showSignUpModal}
        onRequestClose={() => setShowSignUpModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, {backgroundColor: cardColor}]}>
            <Text style={[styles.modalTitle,{color: textColor}]}>Sign Up</Text>
            {signUpError ? (
              <Text style={{ color: 'red', marginBottom: 10 }}>{signUpError}</Text>
            ) : null}
           <View style={{ width: '100%', position: 'relative' }}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color={textColor}
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 27,
                    zIndex: 10,

                  }}
                />
                <TextInput
                  placeholder="Username"
                  value={signUpUsername}
                  onChangeText={setSignUpUsername}
                  style={[styles.input, { paddingLeft: 48 ,color: textColor }]} 
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                
                />
              </View>
            <View style={{ width: '100%', position: 'relative' }}>
              <MaterialIcons
                name="lock"
                size={20}
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 27,
                  zIndex: 10,
                  color: textColor,
                }}
              />
              <TextInput
                placeholder="Password"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                 style={[styles.input, { paddingLeft: 48, color: textColor }]} 
                  placeholderTextColor="#9ca3af"
                secureTextEntry={!signUpPasswordVisible}
                onSubmitEditing={handleSignUp}
              />
            <TouchableOpacity
                style={{ position: 'absolute', right: 20, top: 29 }}
                onPress={() => setSignUpPasswordVisible(v => !v)}
              >
                <Feather name={signUpPasswordVisible ? 'eye' : 'eye-off'} size={17} color="#888" />
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', position: 'relative' }}>
                <MaterialIcons
                  name="lock"
                  size={22}
                
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 27,
                    zIndex: 10,
                    color: textColor,
                  }}
                />
                <TextInput
                  placeholder="Retype Password"
                  value={signUpRetypePassword}
                  onChangeText={setSignUpRetypePassword}
                  style={[styles.input, { paddingLeft: 48, color: textColor }]}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!signUpRetypePasswordVisible}
                  onSubmitEditing={handleSignUp}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 20, top: 29 }}
                  onPress={() => setSignUpRetypePasswordVisible(v => !v)}
                >
                  <Feather name={signUpRetypePasswordVisible ? 'eye' : 'eye-off'} size={17} color="#888" />
                </TouchableOpacity>
              </View>
            <View style={{ width: '100%', alignItems: 'flex-end', position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
                <TouchableOpacity onPress={() => setShowSignUpModal(false)}>
                  <Feather name="x" size={28} color={textColor} />
                </TouchableOpacity>
              </View>
              <Pressable
                onPress={handleSignUp}
                style={[styles.Authbutton, { marginTop: 10, backgroundColor: buttonColor }]}
              >
                <Text style={styles.textSignIn}>Sign Up</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowLoginModal(true);
                  setShowSignUpModal(false);
                }}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: '#007AFF', textAlign: 'center' }}>
                  Don't have an account? <Text style={{ fontWeight: 'bold' }}>Log In</Text>
                </Text>
              </Pressable>
          
            </View>
          </View>
        </Modal>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  ImageWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    textAlign: 'center',
    fontSize: 30,
    lineHeight: 40,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
    
  },
  resetWrapper: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 20,
    height: 33,
  },
  
  iconStyle: {
    position: 'absolute',
    top: 90,
    left: 40,
    zIndex: 10,
  },
  textAccount: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: 15,
  },
  textTittleWrapper1: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 25,
    marginTop: 20,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    width: '100%',
  },
  checkbox: {
    padding: 2,
  },
  textTittleWrapper: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 20,
  },
  image: {
    width: 350,
    height: 350,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 15,
    top: 250,
    width: 300,
  },
  Authbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
     
    top: 10,
    width: 280,
    backgroundColor: '#6C63FF',
  },
  textSignIn: {
    fontSize: 17,
    color: '#F9F9F9',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    
  },
  textTittle: {
    fontSize: 17,
    color: '#F9F9F9',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    opacity: 0.9,
    
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Regular',
  },
});

export default Started;