import React, { createContext, useState, useContext } from 'react';

interface AuthContextProps {
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
    password: string | null;
    setPassword: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextProps>({
    username: null,
    setUsername: () => {},
    password: null,
    setPassword: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ username, setUsername, password, setPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);