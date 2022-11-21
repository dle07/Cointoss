import React from 'react'
import {useCookies} from 'react-cookie';

export default function Portfolio() {
  const [cookies, setCookies] = useCookies(['jwt']);
  return (
    <>
      <div className="header">
        <a href='/' className="logo">Cointoss</a>
      </div>
      <p>Portfolio</p>
      {console.log(cookies.jwt)}
    </>
  )
}
