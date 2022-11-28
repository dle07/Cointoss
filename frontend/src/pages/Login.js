import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
//import {useCookies} from 'react-cookie';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [cookie, setCookie] = useCookies("");
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  const usr_login = async() => {
    let data = {email, password};
    console.log(data);

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      });
      //.then(res => setCookie(res.data))

      if(!response.ok) {
        throw new Error("Login Failed");
      }

      let loggedIn = await response.json();
      setUser(loggedIn);
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
          <h1>Login</h1>
          <input type="email" placeholder='Email' className='usr-pass' name="email" onChange={(e) => {setEmail(e.target.value)}} />
          <input type="password" placeholder='Password' className='usr-pass' name="password" onChange={(e) => {setPassword(e.target.value)}} />
          <button onClick={() => usr_login()}className='btn'>Login</button>
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Don't have an account? <a href='/SignUp' style={{color: "blue"}}>Sign Up</a></p>
        </div>
      </div>
      {console.log(email, password)}
    </>
  )
}

export default Login;