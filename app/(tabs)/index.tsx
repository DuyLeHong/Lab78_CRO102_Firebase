// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';

const auth = getAuth(firebaseApp);

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert('Lỗi đăng nhập: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert('Lỗi đăng ký: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert('Lỗi đăng xuất: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Xin chào {user.email}</Text>
          <Button title="Đăng xuất" onPress={handleLogout} color="#F7A400" />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <View style={styles.buttonSpacing}>
            <Button title="Đăng nhập" onPress={handleLogin} color="#F7A400" />
          </View>
          <Button title="Đăng ký" onPress={handleRegister} color="#F7A400" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8
  },
  buttonSpacing: {
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 20
  }
});
