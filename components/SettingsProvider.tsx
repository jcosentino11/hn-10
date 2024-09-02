import { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedBrowser } from "@/app/settings";

class SettingsState {
  selectedBrowser: SelectedBrowser = 'In App';
  setSelectedBrowser!: (browser: SelectedBrowser) => void;
}

export const SettingsContext = createContext(new SettingsState());

interface Props {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<Props> = ({ children }) => {
  const [selectedBrowser, _setSelectedBrowser] = useState<SelectedBrowser>('In App');
  const selectedBrowserStorageKey = 'selectedBrowser';

  useEffect(() => {
    loadSelectedBrowser();
  }, []);

  const setSelectedBrowser = (browser: SelectedBrowser) => {
    _setSelectedBrowser(browser);
    AsyncStorage.setItem(selectedBrowserStorageKey, browser);
  }

  const loadSelectedBrowser = async () => {
    const val = await AsyncStorage.getItem(selectedBrowserStorageKey);
    if (val) {
      setSelectedBrowser(val as SelectedBrowser);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        selectedBrowser,
        setSelectedBrowser
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
