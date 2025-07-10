// LockScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const LockScreen = ({ onAuthenticated }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const scanFingerprint = () => {
    FingerprintScanner.authenticate({
      description: 'Scan your fingerprint to unlock the app',
    })
      .then(() => {
        FingerprintScanner.release();
        onAuthenticated(); // Callback to navigate to app
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then(scanFingerprint)
      .catch((error) => {
        setErrorMessage(error.message);
      });

    return () => {
      FingerprintScanner.release();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fingerprint Required</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <Button title="Retry" onPress={scanFingerprint} />
    </View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  error: { color: 'red', marginBottom: 20 },
});
