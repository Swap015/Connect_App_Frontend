import { createContext, useState, useEffect } from "react";
import api from "../../api/axios";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  
    const [loading, setLoading] = useState(true); 

    const fetchUser = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
       
        fetchUser();
    }, []);

    const login = async () => {
        await fetchUser();
    };

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
