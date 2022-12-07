import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function isValidEmail(email_) {
  const checkEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
  if(!checkEmail.test(email_)) {
    return false;
  }
  return true;
}

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const usr_register = async() => {
    let data = {email, password};
    let validEmail = isValidEmail(data.email);
    
    try {
      if(validEmail) {
        const response = await fetch("/user/register", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
          },
        });

        if(!response.ok) {
          throw new Error("Login Failed");
        }
        navigate("/Login");
      } else {
        setError("Invalid Email");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="header">
        <a href='/' className="logo">Cointoss</a>
      </div>
      <div className='login-signup'>
        <div className='cover'>
          <h1>Sign Up</h1>
          <input type="text" placeholder='Username' className='usr-pass' name="email" onChange={(e) => {setEmail(e.target.value)}} />
          <input type="password" placeholder='Password' className='usr-pass' name="password" onChange={(e) => {setPassword(e.target.value)}} />
          <button onClick={() => usr_register()} className='btn'>Sign Up</button>
          {error !== "" && <p style={{color: "red"}}>{error}</p>}
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Already have an account? <a href='/Login' style={{color: "blue"}}>Login</a></p>
        </div>
      </div>
      {console.log(email, password)}
    </>
  )
}

export default SignUp;