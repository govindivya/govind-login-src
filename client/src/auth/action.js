import axios from "axios";
// Login
export const login = async (disptach, email, password) => {
  try {
    console.log("Loading")
    disptach({type:'LOADING'});
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:4000"

      },
    };
    axios.defaults.withCredentials=true;
    const { data } = await axios.post(
      `/api/auth/login`,
      { email, password },
      config
    );
    console.log("Loaded")

    disptach({ type: "LOGIN", payload: data.user });
    return { success: true };
  } catch (error) {
    disptach({ type: "FAIL" });
    console.log(error);
    return { success: false, error: error.response.data.error };
  }
};

// Register
export const register = async (disptach, userData) => {
  try {
    disptach({type:'LOADING'});

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:4000"
      },
    };
    const { data } = await axios.post(
      `/api/auth/register`,
      { ...userData },
      config
    );
    disptach({ type: "REGISTER", payload: data.user });
    return { success: true };
  } catch (error) {
    console.log(error.response.data.error);
    disptach({ type: "FAIL" });
    return { success: false, error: error.response.data.error };
  }
};

// Logout User
export const logout = async (disptach) => {
  try {
    disptach({type:'LOADING'});
    await axios.get(`/api/auth/logout`);
    disptach({ type: "LOGOUT" });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.response.data.error };
  }
};

export const loadUser = async (disptach) => {
  try {
    disptach({type:'AUTHLOADING'});
    const { data } = await axios.get(`/api/auth/user`);
    disptach({ type: "LOAD", payload: data.user });
  } catch (error) {
    disptach({ type: "FAIL" });
    return { success: false, error: error.response.data.error };
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/auth/password/forgot`,
      {email},
      config
    );
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.response.data.error };
  }
};

// Reset Password
export const resetPassword = async (token, password) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/auth/password/reset/${token}`,
      {password},
      config
    );
   if(data.success){
    return { success: true };
   }
  } catch (error) {
    console.log(error);
    return { success: false, error: error.response.data.error };
  }
};
