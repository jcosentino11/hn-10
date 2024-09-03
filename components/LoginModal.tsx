import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  Linking
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
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
            <View>
            <TouchableOpacity onPress={() => Linking.openURL(`https://news.ycombinator.com/favorites?id=${loginContext.username}`)} style={styles.modalButton}>
              <View style={styles.buttonContentRow}>
                <Text style={[styles.modalButtonText, { color: tintColor }]}>View Favorites</Text>
                <Feather name="external-link" size={18} color={tintColor} style={styles.externalLinkIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={loginContext.logout} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: tintColor }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
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
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  externalLinkIcon: {
    marginLeft: 8,
  },
});

export default LoginModal;