import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput
} from "react-native";
import { useThemeColor } from "@/utils/Colors";
import { LoginContext } from "./HackerNewsProvider";

const LoginModal: React.FC = () => {
  const loginContext = useContext(LoginContext);
  const colorScheme = useColorScheme();
  const textColor = useThemeColor(colorScheme, 'text');
  const tintColor = useThemeColor(colorScheme, 'tint');
  const cardColor = useThemeColor(colorScheme, 'card');
  const errorColor = useThemeColor(colorScheme, 'error');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setPassword('');
    setUsername('');
  }, [loginContext.showLoginError, loginContext.isLoggedIn])

  return (
    <Modal
      visible={loginContext.showLoginModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => loginContext.showModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>
            {loginContext.isLoggedIn ? 'Account' : 'Login'}
          </Text>
          {loginContext.isLoggedIn ? (
            <TouchableOpacity onPress={loginContext.logout} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: tintColor }]}>Log Out</Text>
            </TouchableOpacity>
          ) : (
            <>
              {loginContext.showLoginError && (
                <Text style={[styles.errorText, { color: errorColor }]}>
                  Login failed.
                </Text>
              )}
              <TextInput
                style={[styles.input, { color: textColor, borderColor: tintColor }]}
                placeholder="Username"
                placeholderTextColor={textColor}
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={[styles.input, { color: textColor, borderColor: tintColor }]}
                placeholder="Password"
                placeholderTextColor={textColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity onPress={async () => await loginContext.login(username, password)} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: tintColor }]}>Log In</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => loginContext.showModal(false)} style={styles.modalButton}>
            <Text style={[styles.modalButtonText, { color: tintColor }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
});

export default LoginModal;