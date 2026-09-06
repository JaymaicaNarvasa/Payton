import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StatusBar as NativeStatusBar, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      Alert.alert("Success", "Your password has been updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnTouchable}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Change Password</Text>

        <Text style={styles.instruction}>Enter your new password below to secure your account.</Text>
        
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.pillInputBlock}>
          <TextInput 
            style={styles.pillTextInput} 
            value={newPassword} 
            onChangeText={setNewPassword} 
            placeholder="Min. 6 characters"
            secureTextEntry
            placeholderTextColor="#94A3B8"
          />
        </View>

        <Text style={styles.inputLabel}>Confirm Password</Text>
        <View style={styles.pillInputBlock}>
          <TextInput
            style={styles.pillTextInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat new password"
            secureTextEntry
            placeholderTextColor="#94A3B8"
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, isUpdating && styles.disabledBtn]}
          onPress={handleChangePassword}
          disabled={isUpdating}
        >
          {isUpdating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryBtnText}>SAVE</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFD',
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  backBtnTouchable: { width: 20 },
  card: {
    marginHorizontal: 18,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  instruction: {
    fontSize: 13,
    color: '#050505',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 19,
  },
  pillInputBlock: {
    borderWidth: 1,
    borderColor: '#dbe0e6',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 15,
    backgroundColor: '#ffffff',
    fontWeight: '500',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 6,
    paddingLeft: 5,
  },
  pillTextInput: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    padding: 0,
  },
  primaryBtn: {
    backgroundColor: '#173D45',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  disabledBtn: { backgroundColor: '#CBD5E1' },
});