import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/Firebase.init';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import Loading from '../Components/Loading';



const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);




    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }



    // for logout user
    const signOutUser = () => {
        axios.post("https://studys-phere-server.vercel.app/logout", {}, { withCredentials: true })
            .catch(err => console.log("Logout error", err));
        return signOut(auth);
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('user in the auth state change', currentUser);

            setLoading(false)

            //JWT related
            if (currentUser?.email) {
                const userData = { email: currentUser.email };
                axios.post('https://studys-phere-server.vercel.app/jwt', userData, {
                    withCredentials: true
                })
                    .then(res => {
                        console.log('JWT response:', res.data);
                    })
                    .catch(error => {
                        console.error('JWT error:', error.response?.data || error.message);
                    });
            }

        })

        return () => {
            unSubscribe();
        }
    }, [])

    const updateProfileInfo = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);


    };


    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('user in the auth state change', currentUser);

            setLoading(false)
        })

        return () => {
            unSubscribe();
        }
    }, [])


    const authInfo = {
        user,
        createUser,
        signIn,
        loading,
        signInWithGoogle,
        signOutUser,
        updateProfileInfo
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;