import { createContext, useState } from "react";
import { AppConstants } from "../../utils/constant"; // ✅ ensure this path is accurate

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendURL = AppConstants.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('jwt'));
  const [userData, setUserData] = useState(false);

  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};