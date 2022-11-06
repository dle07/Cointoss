import React from 'react'

function Login() {
  return (
    <>
      <div className="header">
        <a href='/' className="logo">Cointoss</a>
      </div>
      <div className='login-signup'>
        <div className='cover'>
          <h1>Login</h1>
          <input type="text" placeholder='Username' className='usr-pass' />
          <input type="password" placeholder='Password' className='usr-pass' />
          <button className='btn'>Login</button>
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Don't have an account? <a href='/SignUp' style={{color: "blue"}}>Sign Up</a></p>
        </div>
      </div>
    </>
  )
}

export default Login;