import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const usr_register = async() => {
    let data = {email, password};
    console.log(data);

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      });

      if(!response.ok) {
        throw new Error("Login Failed");
      }
      navigate("/");

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
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Already have an account? <a href='/Login' style={{color: "blue"}}>Login</a></p>
        </div>
      </div>
      {console.log(email, password)}
    </>
  )
}

export default SignUp;