import "./style.css";
import React, { useRef, useEffect } from "react";
import { AuthContext } from "../App";

const ResetPasswordForm = ({ password, setPassword, submitReset }) => {
  const resetRef = useRef(null);
  const { auth, dispatch } = React.useContext(AuthContext);
  useEffect(() => {
    if (auth.loading) {
      resetRef.current.disabled = true;
    } else {
      resetRef.current.disabled = false;
    }
  }, [auth]);
  return (
    <div className="form">
      <form onSubmit={submitReset}>
        <h3>Reset Password</h3>
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
        <input type="submit" ref={resetRef} value= {auth.loading?"Wait...":"Reset"} />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
