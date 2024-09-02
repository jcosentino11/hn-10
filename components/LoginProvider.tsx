import { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

class LoginState {
  isLoggedIn: boolean = false;
  showLoginModal: boolean = false;
  login!: () => Promise<void>;
  logout!: () => Promise<void>;
  showModal!: (show: boolean) => void;
}

export const LoginContext = createContext(new LoginState());

interface Props {
  children: React.ReactNode;
}

export const LoginProvider: React.FC<Props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedInStorageKey = 'isLoggedIn';
  // since there aren't types on AsyncStorage
  const isLoggedInVal = {
    true: "true",
    false: "false"
  };

  useEffect(() => {
    loadIsLoggedIn();
  }, []);

  const login = useCallback(async () => {
    await AsyncStorage.setItem(isLoggedInStorageKey, isLoggedInVal.true);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.setItem(isLoggedInStorageKey, isLoggedInVal.false);
    setIsLoggedIn(false);
    setShowLoginModal(false);
  }, []);

  const showModal = useCallback((show: boolean) => {
    setShowLoginModal(show);
  }, []);

  const loadIsLoggedIn = async () => {
    setIsLoggedIn(await AsyncStorage.getItem(isLoggedInStorageKey) === isLoggedInVal.true);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        showLoginModal,
        login,
        logout,
        showModal,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
