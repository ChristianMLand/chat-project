import { useState, createContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "~/hooks";
import { getLoggedUser } from '~/services';

export const AppContext = createContext(null);

export const AuthContext = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const socket = useSocket();

    const clear = () => {
        // socket.disconnect();
        setLoggedUser(null);
        navigate("/");
    };

    const refresh = () => {
        getLoggedUser().then(({ data, error }) => {
            if (error) clear();
            else setLoggedUser(data);
        });
    }

    useEffect(() => {
        socket.on('disconnect', clear);
        if (loggedUser && !socket.connected) socket.connect();
        if (pathname !== "/" && !loggedUser) refresh();
        return () => socket.off('disconnect', clear);
    }, [pathname, loggedUser]);

    return (
        <AppContext.Provider value={{ socket, loggedUser, refresh, clear }}>
            {children}
        </AppContext.Provider>
    );
};