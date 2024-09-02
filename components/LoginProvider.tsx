import { createContext, useState, useEffect, useCallback } from "react";
import { fetch } from "@/utils/Fetch";

class LoginState {
  showLoginModal: boolean = false;
  isLoggedIn: boolean = false;
  login!: (username: string, password: string) => Promise<void>;
  logout!: () => Promise<void>;
  showModal!: (show: boolean) => void;
}

export const LoginContext = createContext(new LoginState());

interface Props {
  children: React.ReactNode;
}

export const LoginProvider: React.FC<Props> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    loadIsLoggedIn();
  }, []);

  const loadIsLoggedIn = async () => {
    if (await alreadyLoggedIn()) {
      setIsLoggedIn(true);
    } 
  };

  const alreadyLoggedIn = async () => {
    const content = await fetchHNMainPage();
    return content.match(/logout\?auth/);
  };

  const login = useCallback(async (username: string, password: string) => {
    if (await alreadyLoggedIn()) {
      return;
    }

    const loginResult = await fetchHNPage('login', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `goto=news&acct=${encodeURIComponent(username)}&pw=${encodeURIComponent(password)}`,
    });

    if (!loginResult.match(/logout\?auth/)) {
      return;
    }

    setIsLoggedIn(true);
    setShowLoginModal(false);
  }, []);

  const logout = useCallback(async () => {
    if (isLoggedIn) {
      const token = await fetchAuthToken();
      if (token == null) {
        setIsLoggedIn(false);
      } else {
        await fetchHNPage(`logout?auth=${encodeURIComponent(token)}`, {});
        if (!await alreadyLoggedIn()) {
          setIsLoggedIn(false);
        }
      }
    }
    setShowLoginModal(false);
  }, []);

  const fetchHNPage = async (path: string, { ...opts }: RequestInit) => {
    let url = 'https://news.ycombinator.com';
    if (path) {
      url += `/${path}`;
    }
    return await fetch(url, {
      ...opts,
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
      referrerPolicy: 'origin'
    }).then(res => res.text());
  };

  const fetchHNMainPage = async () => await fetchHNPage('', {});
  
  const fetchAuthToken = async () => {
    const data = await fetchHNPage(`item?id=1000`, {});
    return (String(data || '').match(/(["'])(?:(?=(\\?))\2.)*?\1/g) || [])
      .filter(n => n.match(/auth=/))
      .map((item) => {
        const auth = item.match(/["'].*?auth=([a-f0-9]*)/);
        return auth && auth[1] ? auth[1] : null
      })[0];
  };

  const showModal = useCallback((show: boolean) => {
    setShowLoginModal(show);
  }, []);

  return (
    <LoginContext.Provider
      value={{
        showLoginModal,
        isLoggedIn,
        login,
        logout,
        showModal,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
