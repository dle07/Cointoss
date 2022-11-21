import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';

function Login() {
  const [user_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  
  const usr_login = async() => {
    let data = {user_email, password};
    
    try {
      await fetch("/user/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      }).then(res => res.json()).then(token => {
        if(token.detail !== "Email not found") {
          setCookies('jwt', token)
          navigate("/");
        }
      });
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
          <h1>Login</h1>
          <input type="email" placeholder='Email' className='usr-pass' name="email" onChange={(e) => {setEmail(e.target.value)}} />
          <input type="password" placeholder='Password' className='usr-pass' name="password" onChange={(e) => {setPassword(e.target.value)}} />
          <button onClick={() => usr_login()}className='btn'>Login</button>
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Don't have an account? <a href='/SignUp' style={{color: "blue"}}>Sign Up</a></p>
        </div>
      </div>
      {console.log(user_email, password, cookies.jwt)}
    </>
  )
}

export default Login;