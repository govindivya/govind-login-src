import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import ForgotPassword from "../../components/ForgotPassword";
import "../../components/style.css";
import { useState } from "react";
import React from "react";
import { AuthContext } from "../../App";
import { register, login, forgotPassword } from "../../auth/action";
import { useAlert } from "react-alert";

const Auth = () => {
  const alert = useAlert();
  const { dispatch } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [page, setPage] = useState(1);

  /******************************************************************************8 */
  function clearAll() {
    setEmail("");
    setPassword("");
    setPhone("");
  }

  /******************************************************************************8 */
  // To change view to registerForm

  function registerForm() {
    clearAll();
    setPage(2);
  }

  /******************************************************************************8 */
  // To change view to LoginForm

  function loginForm() {
    clearAll();
    setPage(1);
  }

  /******************************************************************************8 */
  // To change view to forgotForm

  function forgotForm() {
    clearAll();
    setPage(3);
  }
  /******************************************************************************8 */
  function validateEmail() {
    const validated = email.match(/[a-zA-z0-9](@gmail.com)$/);
    return validated;
  }
  /******************************************************************************8 */

  async function submitLogin(e) {
    e.preventDefault();
    const data = await login(dispatch, email, password);
    if (!data.success) {
      alert.error(data.error);
      return;
    }
    clearAll();
    alert.show("You are logged in !");
  }
  /******************************************************************************8 */

  async function submitRegister(e) {
    e.preventDefault();
    const isValidEmail = validateEmail();
    if (!isValidEmail) {
      alert.error("Not a valid email");
    }
    let strongPassword = passwordValildator();
    if (!strongPassword) {
      alert.error(
        "Password should have one uppercase letter ,one lowercase letter,one digit and one special character"
      );
      return;
    }

    const data = await register(dispatch, { phone, email, password });
    if (!data.success) {
      alert.error(data.error);
      return;
    }
    clearAll();
    alert.show("You are registered successfully");
  }
  /******************************************************************************8 */

  async function submitForgot(e) {
    e.preventDefault();
    const data = await forgotPassword(email);
    if (!data.success) {
      alert.error(data.error);
      return;
    }
    alert.success("Reset link is set to your registred email id");
    setPage(1);
    clearAll();
  }

  /******************************************************************************8 */

  function phoneValidator() {
    if (
      phone.charAt(0) === "0" ||
      phone.charAt(0) === "1" ||
      phone.charAt(0) === "2" ||
      phone.charAt(0) === "3" ||
      phone.charAt(0) === "4" ||
      phone.charAt(0) === "5"
    ) {
      return false;
    }
    if (phone.length !== 10) {
      return false;
    }
    return true;
  }
  /******************************************************************************8 */

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
  return (
    <div className="container">
      {page === 1 && (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          register={registerForm}
          forgot={forgotForm}
          submitLogin={submitLogin}
        />
      )}
      {page === 2 && (
        <RegisterForm
          phone={phone}
          email={email}
          setEmail={setEmail}
          setPhone={setPhone}
          phoneValidator={phoneValidator}
          password={password}
          setPassword={setPassword}
          login={loginForm}
          forgot={forgotForm}
          submitRegister={submitRegister}
        />
      )}
      {page === 3 && (
        <ForgotPassword
          email={email}
          setEmail={setEmail}
          register={registerForm}
          login={loginForm}
          sumbitForgot={submitForgot}
        />
      )}
    </div>
  );
};

export default Auth;
