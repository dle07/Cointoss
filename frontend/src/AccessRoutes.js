import React from 'react'
import { Outlet } from "react-router-dom"
import SignUp from './pages/SignUp';
import {useCookies} from 'react-cookie';

//temporary - need to replace loggedIn with when you get JWT TOKEN and use UseContext
//When you logged in, I want the JWT token to be sent over to the profolio page as a prop 
//to check if we're logged in, inside the cookie should store the kwt token, so if it's empty string, then ur not logged in, else logged in
export default function AccessRoutes() {
    const [cookies] = useCookies(['jwt']);
    let log = false;

    const checkAuth = () => {
        if(cookies.jwt !== "") {
            log = true;
        } else {
            log = false;
        }
        const user = { loggedIn: log };
        return user && user.loggedIn && cookies.jwt !== undefined;
    };
    const isAuth = checkAuth();
    return isAuth ? <Outlet /> : <SignUp />;
};
