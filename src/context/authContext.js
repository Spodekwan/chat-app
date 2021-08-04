import React, { useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [ user, setUser ] = useState({});
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			unsubscribe();
			if (firebaseUser) {
				setUser(firebaseUser);
			} else {
				setUser(undefined);
			}
		});
		return unsubscribe;
	}, [])

	const value = {
		user,
		setUser 
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};