import React from 'react'
import { useNavigate, Outlet } from "react-router-dom"
import SignUp from './pages/SignUp';

//temporary - need to replace loggedIn with when you get JWT TOKEN and use UseContext
//When you logged in, I want the JWT token to be sent over to the profolio page as a prop 
//to check if we're logged in, inside the cookie should store the kwt token, so if it's empty string, then ur not logged in, else logged in
const useAuth = () => {
    const user = { loggedIn: false };
    return user && user.loggedIn;
};

export default function AccessRoutes() {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <SignUp />;
};
