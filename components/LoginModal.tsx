import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal
} from "react-native";
import { useThemeColor } from "@/utils/Colors";
import { LoginContext } from "./LoginProvider";


const LoginModal: React.FC = () => {

  const loginContext = useContext(LoginContext);

  const colorScheme = useColorScheme();
  const textColor = useThemeColor(colorScheme, 'text');
  const tintColor = useThemeColor(colorScheme, 'tint');
  const cardColor = useThemeColor(colorScheme, 'card');

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
              // TODO fields!!!
              <TouchableOpacity onPress={() => loginContext.login('TODO', 'TODO')} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: tintColor }]}>Log In</Text>
              </TouchableOpacity>
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
  });

export default LoginModal;
