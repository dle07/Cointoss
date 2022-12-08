import React from 'react'
import {useCookies} from 'react-cookie';

export default function LogOut() {
  const [cookies, setCookies] = useCookies(['jwt']);
  const removeCookie = () => {
    setCookies('jwt', "");
  }

  return (
    <div>
      {cookies.jwt !== "" && <h1 onClick={removeCookie} style={{color: 'white'}}>Log&nbsp;Out</h1>}
    </div>
  )
}
