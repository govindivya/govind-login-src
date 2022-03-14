import React, { useRef ,useEffect} from "react";
import { AuthContext } from "../App";

const LoginForm = ({ forgot,register,submitLogin, setEmail, setPassword, email, password }) => {
 const loginRef = useRef(null);
 const { auth, dispatch } = React.useContext(AuthContext);
useEffect(() => {
 
  if(auth.loading){
    loginRef.current.disabled=true;
  }
  else{
    loginRef.current.disabled=false
  }
}, [auth.loading])

  return (
    <div className="form">
      <form onSubmit={submitLogin}>
        <h3>Login</h3>
        <p>Email ID</p>
        <input 
        type="email"
        placeholder="Email" 
        value={email} 
        onChange={(e)=>setEmail(e.target.value.trim())}
         />
         <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value.trim())}
        />
        <input type="submit" ref={loginRef}  value={auth.loading?"Wait...":"Login"}/>
      </form>
      <p onClick={forgot}>Forgot Password ?</p>
      <p onClick={register}>Register Now</p>

    </div>
  );
};

export default LoginForm;
