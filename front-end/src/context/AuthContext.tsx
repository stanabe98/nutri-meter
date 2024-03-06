import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export interface UserInfo {
  email: string;
  name: string;
  pic: string;
  token: string;
  _id: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo: UserInfo = JSON.parse(userInfoString);
      setUser(userInfo);
    } else {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export default AuthProvider;
