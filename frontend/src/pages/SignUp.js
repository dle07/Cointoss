import React from 'react'

function SignUp() {
  return (
    <>
      <div className="header">
        <a href='/' className="logo">Cointoss</a>
      </div>
      <div className='login-signup'>
        <div className='cover'>
          <h1>Sign Up</h1>
          <input type="text" placeholder='Username' className='usr-pass' />
          <input type="password" placeholder='Password' className='usr-pass' />
          <button className='btn'>Sign Up</button>
          <a href='/' style={{color: "gray"}}>Go back</a>
          <p>Already have an account? <a href='/Login' style={{color: "blue"}}>Login</a></p>
        </div>
      </div>
    </>
  )
}

export default SignUp;