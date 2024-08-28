import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create the context
export const AuthContext = createContext();
// Create the provider component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [logoutMessage, setLogoutMessage] = useState("");


    // useEffect(() => {
    //     const token = localStorage.getItem("authToken");
    //     console.log("Token from Session Storage: ", token); // Check token from session storage
    //     if (token) {
    //         const decodedToken = jwtDecode(token);
    //         console.log("Decoded Token on Load: ", decodedToken); // Check if the token is decoded correctly
    //         setAuth({
    //             id: decodedToken.id,
    //             userName: decodedToken.fullName,

    //         });

    //         if(decodedToken.exp*1000< Date.now()){
    //             logout()
    //         }
    //     }
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            
            if (decodedToken.exp * 1000 < Date.now()) {
                logout();
            } else {
                setAuth({
                    id: decodedToken.id,
                    userName: decodedToken.fullName,
                });
            }
        }
    }, []);
    

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        // console.log("Decoded Token: ", decodedToken); // Check decoded token
        setAuth({
            id: decodedToken.id,
            userName: decodedToken.fullName,
        });
        localStorage.setItem("authToken", token);
        // console.log("Stored Token: ", sessionStorage.getItem("authToken")); // Check if the token is stored correctly
    };
    

    const logout = () => {
        setAuth(null);
        localStorage.removeItem("authToken");
        setLogoutMessage("You have been logged out.");
        setTimeout(() => {
            setLogoutMessage('');
        }, 2000);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, logoutMessage }}>
            {children}
        </AuthContext.Provider>
    );
};
