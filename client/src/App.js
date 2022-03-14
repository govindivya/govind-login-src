import React, { Suspense, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { authReducer } from "./auth/reducer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import ResetPassword from "./pages/Auth/ResetPassword";
import { loadUser } from "./auth/action";


const Home = React.lazy(() => import("./pages/Home/Home"));
const Auth = React.lazy(() => import("./pages/Auth/Auth"));
const NotFound = React.lazy(() => import("./pages/404/404"));

export const AuthContext = React.createContext();

axios.defaults.withCredentials=true;

const authInitialState = {
  isAuthenticated: false,
  user: null,
  loading:false,
  authloading:true,
};

function App() {
  const [auth, dispatch] = React.useReducer(authReducer, authInitialState);
  useEffect(() => {
    loadUser(dispatch);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        dispatch,
      }}
    >
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              exact
              element={auth.authloading?<Loading/>:(
                auth.isAuthenticated ? <Home /> : <Auth />
              )}
            />
            <Route path="/reset/:token" exact element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
