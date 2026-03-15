import React, { createContext, useContext, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ profileImage, setProfileImage }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
