import React, { createContext, ReactNode, useContext } from 'react';

interface AuthContextProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthContextProps) {
  const user = {
    id: '2134234234',
    name: 'Matheus Schneider',
    email: 'matheus.email@gmail.com',
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
