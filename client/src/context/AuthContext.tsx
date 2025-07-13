// import React, { createContext, useContext, useEffect, useState } from "react";
// import { connectSocket } from "../utils/socket"; // ✅ adjust path if needed

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUserState] = useState<User | null>(null);
//   const [token, setTokenState] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");

//     if (storedUser && storedToken) {
//       const parsedUser = JSON.parse(storedUser);
//       setUserState(parsedUser);
//       setTokenState(storedToken);
//       connectSocket(parsedUser._id); // ✅ connect socket on initial load
//     }
//   }, []);

//   const setUser = (user: User | null) => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//       connectSocket(user._id); // ✅ connect socket when user is set
//     } else {
//       localStorage.removeItem("user");
//     }
//     setUserState(user);
//   };

//   const setToken = (token: string | null) => {
//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//     setTokenState(token);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, setUser, setToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// };


// context/AuthContext.tsx


import React, { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "../utils/socket"; // adjust if needed

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUserState(parsedUser);
      setTokenState(storedToken);
      connectSocket(parsedUser._id);
    }

    setLoading(false); // ✅ finished loading
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      connectSocket(user._id);
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

