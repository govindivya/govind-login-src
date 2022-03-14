import { useState } from "react";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "../../App";
import { useAlert } from "react-alert";

import { forgotPassword, resetPassword } from "../../auth/action";

const ResetPassword = () => {
  const alert = useAlert();
  const naviagte = useNavigate();
  const { dispatch } = React.useContext(AuthContext);
  const [password, setPassword] = useState("");
  const { token } = useParams();

  function passwordValildator() {
    if (password.length < 8) {
      return false;
    }
    let upper = -1;
    let lower = -1;
    let digit = -1;
    let special = -1;
    for (let i = 0; i < password.length; i++) {
      if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
        digit = i;
      } else if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
        upper = i;
      } else if (
        password.charCodeAt(i) >= 97 &&
        password.charCodeAt(i) <= 122
      ) {
        lower = i;
      } else {
        special = i;
      }
    }
    if (upper === -1 || lower === -1 || digit === -1 || special === -1) {
      return false;
    }
    return true;
  }
  async function submitReset(e) {
    e.preventDefault();
    const strong = passwordValildator();
    if (!strong) {
      alert.error(
        "Password should have one uppercase letter ,one lowercase letter,one digit and one special character"
      );
      return;
    }
    const data = await resetPassword(token,password);
    if (!data.success) {
      alert.error(data.error);
      return;
    }
    alert.show("Your password has been changed !");
    naviagte("/");
  }
  return (
    <div className="container">
      <ResetPasswordForm
        password={password}
        setPassword={setPassword}
        submitReset={submitReset}
      />
    </div>
  );
};

export default ResetPassword;
