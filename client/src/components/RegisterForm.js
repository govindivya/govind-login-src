import React,{ useRef, useEffect } from "react";
import { AuthContext } from "../App";

const RegisterForm = ({
  login,
  forgot,
  submitRegister,
  phone,
  setPhone,
  setEmail,
  setPassword,
  email,
  password,
}) => {
  const registerRef = useRef(null);
  const { auth, dispatch } = React.useContext(AuthContext);
  useEffect(() => {
    if (auth.loading) {
      registerRef.current.disabled = true;
    } else {
      registerRef.current.disabled = false;
    }
  }, [auth]);

  return (
    <div className="form">
      <form onSubmit={submitRegister}>
        <h3>Register</h3>
        <p>Email ID</p>
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <p>Phone</p>
        <input
          type="number"
          placeholder="Enter Your Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p>Password</p>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
        <small>Minimum 8 Alpha Numeric </small>

        <input type="submit" ref={registerRef} value={auth.loading?"Wait...":"Register"} />
      </form>
      <p onClick={forgot}>Forgot Password ?</p>
      <p onClick={login}>Login Now</p>
    </div>
  );
};

export default RegisterForm;
