import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // RESTORE USER SESSION
    // ==========================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");


            if (storedUser) {

                setUser(
                    JSON.parse(storedUser)
                );

            }

        } catch (error) {

            console.error(
                "Failed to restore user:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("token");

        } finally {

            setLoading(false);

        }

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================

    const login = (data) => {

        localStorage.setItem(
            "token",
            data.token
        );


        const userData = {

            id: data._id,

            name: data.name,

            email: data.email

        };


        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );


        setUser(userData);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };


    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    return useContext(
        AuthContext
    );

}
