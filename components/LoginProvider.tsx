import { createContext, useState, useEffect, useCallback } from "react";
import { fetch } from "@/utils/Fetch";

class LoginState {
  showLoginModal: boolean = false;
  isLoggedIn: boolean = false;
  showLoginError: boolean = false;
  isFavoriting: boolean = false;
  login!: (username: string, password: string) => Promise<void>;
  logout!: () => Promise<void>;
  checkFavorite!: (id: string) => Promise<boolean>;
  favorite!: (id: string) => Promise<boolean>;
  unfavorite!: (id: string) => Promise<boolean>;
  showModal!: (show: boolean) => void;
}

export const LoginContext = createContext(new LoginState());

interface Props {
  children: React.ReactNode;
}

export const LoginProvider: React.FC<Props> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  useEffect(() => {
    loadIsLoggedIn();
  }, []);

  useEffect(() => {
    setShowLoginError(false);
  }, [showLoginModal])

  const loadIsLoggedIn = useCallback(async () => {
    if (await alreadyLoggedIn()) {
      setIsLoggedIn(true);
    } 
  }, []);

  const alreadyLoggedIn = useCallback(async () => {
    const content = await fetchHNMainPage();
    return content.match(/logout\?auth/);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    if (await alreadyLoggedIn()) {
      return;
    }
    try {
      const loginResult = await fetchHNPage('login', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `goto=news&acct=${encodeURIComponent(username)}&pw=${encodeURIComponent(password)}`,
      });
  
      if (!loginResult.match(/logout\?auth/)) {
        setShowLoginError(true);
        return;
      }
  
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } catch {
      setShowLoginError(true);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const tokens = await fetchAuthTokens("1000");
      const { token = null } = tokens.find(item => item.action === 'logout') || {};
      if (token != null) {
        await fetchHNPage(`logout?auth=${encodeURIComponent(token)}`, {});
        if (!await alreadyLoggedIn()) {
          setIsLoggedIn(false);
        }
      }
    } catch {
      // ignore
    }
    setShowLoginModal(false);
  }, []);

  const checkFavorite = useCallback(async (id: string) => {
    try {
      const content = await fetchHNPage(`item?id=${id}`, {});
      if (content && content.indexOf(`un&#8209;favorite`) > 0) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  const favorite = useCallback(async (id: string) => {
    setIsFavoriting(true);
    try {
      const tokens = await fetchAuthTokens(id);
      const { token = null } = tokens.find(item => item.action === 'fave' && item.id === id) || {};
      if (token != null) {
        await fetchHNPage(`fave?id=${id}&auth=${token}`, {});
        return await checkFavorite(id);
      }
    } catch {
      console.log("favoriting failed");
    } finally {
      setIsFavoriting(false);
    }
    return false;
  }, []);

  const unfavorite = useCallback(async (id: string) => {
    setIsFavoriting(true);
    try {
      const tokens = await fetchAuthTokens(id);
      const { token = null } = tokens.find(item => item.action === 'fave' && item.id === id) || {};
      if (token != null) {
        await fetchHNPage(`fave?id=${encodeURIComponent(id)}&auth=${token}&un=t`, {});
        return !await checkFavorite(id);
      }
    } catch {
      console.log("unfavoriting failed");
    } finally {
      setIsFavoriting(false);
    }
    return false;
  }, []);

  const fetchHNPage = useCallback(async (path: string, { ...opts }: RequestInit) => {
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
  }, []);

  const fetchHNMainPage = useCallback(async () => await fetchHNPage('', {}), []);

  const fetchAuthTokens = useCallback(async (id: string) => {
    const data = await fetchHNPage(`item?id=${id}`, {});
    // rate limited otherwise... TODO figure out a better way
    await new Promise((resolve) => setTimeout(resolve, 500));
    return (String(data || '').match(/(["'])(?:(?=(\\?))\2.)*?\1/g) || [])
      .filter(n => n.match(/auth=/))
      .map((item) => {
        const action = item.match(/["'](.*?)\?/);
        const auth = item.match(/["'].*?auth=([a-f0-9]*)/);
        const id = item.match(/["'].*?id=([0-9]*)/);
        return {
          token: auth && auth[1] ? auth[1] : null,
          action: action && action[1] ? action[1] : null,
          id: id && id[1] ? id[1] : null
        }
      });
  }, []);

  const showModal = useCallback((show: boolean) => {
    setShowLoginModal(show);
  }, []);

  return (
    <LoginContext.Provider
      value={{
        showLoginModal,
        isLoggedIn,
        showLoginError,
        isFavoriting,
        checkFavorite,
        favorite,
        unfavorite,
        login,
        logout,
        showModal,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
