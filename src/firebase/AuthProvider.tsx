import {createContext, useContext, useEffect, useState} from "react";
import {getAuth, getFirestore, loginWithGoogle, logoutWithGoogle} from "./firebase-config";
import {User} from 'firebase/auth'
import {doc, getDoc, setDoc} from "firebase/firestore";

export type AuthContextType = {
    user ?: User,
    login: () => void,
    logout: () => void,
}
const AuthContext = createContext<AuthContextType>({
    login: () => null,
    logout: () => null,
});

export const useAuthContext = () => useContext(AuthContext);

function AuthProvider(props: any){

    const auth = getAuth();

    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        auth.onAuthStateChanged(async (newUser) => {
            setUser(newUser ?? undefined);
            setLoading(false);
            if (newUser)
                return await register(newUser);
        })
    }, [auth]);

    const login = () =>
        loginWithGoogle()
            .then(({user}) => {
                setUser(user);
            })

    const logout = () => logoutWithGoogle()


    return <AuthContext.Provider value={{user, login, logout}}>
        {!loading && props.children}
    </AuthContext.Provider>
}

/**
 * Enregistre l'utilisateur dans la collection 'users' s'il n'y est pas déjà
 * @param user
 */
async function register(user: User) {
    const newDoc = doc(getFirestore(), 'users/' + user.uid);
    if (!(await getDoc(newDoc)).exists()){
        return setDoc(newDoc, {
            uid: user.uid,
            name: user.displayName,
            photoUrl: user.photoURL
        })
    }
}

export default AuthProvider;
