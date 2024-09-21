import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    });

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        if (!isLoggedIn) {
            toast.success("Signed Out Successfully!");
        } else {
            toast.success("Login Successful");
        }
    }, [isLoggedIn]);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setIsLoggedIn(true);
                setUser(currentUser);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);


    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
            {children}
        </LoginContext.Provider>
    );


};



export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}