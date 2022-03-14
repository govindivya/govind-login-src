import React,{ useRef, useEffect } from "react";
import { AuthContext } from "../App";



const ForgotPassword = ({login,register,email,setEmail,sumbitForgot}) => {

  const forgotRef = useRef(null);
  const { auth, dispatch } = React.useContext(AuthContext);
  useEffect(() => {
    if (auth.loading) {
      forgotRef.current.disabled = true;
    } else {
      forgotRef.current.disabled = false;
    }
  }, [auth]);


  return (
    <div className="form">
      <form onSubmit={sumbitForgot}>
        <h3>Forgot Password</h3>
        <p>Email ID</p>
        <input 
        type="email"
        placeholder="Email" 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)}
         />
        <input type="submit" ref={forgotRef} value={auth.loading?"Wait...":"GET LINK"}/>
      </form>
      <p onClick={login}>Longin Now ?</p>
      <p onClick={register}>Register Now</p>

    </div>
  )
}

export default ForgotPassword