import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../App.css';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const Login = (props) => {
    const [authorizationMessage, setAuthorizationMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/login", { withCredentials: true })
            .then(res => {
                if (res.data.authorization_message) {
                    setAuthorizationMessage(res.data.authorization_message);
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="Container LoginPage">
            { authorizationMessage && (<p className="AlertMessage">{authorizationMessage}</p>)}
            <h1>Movie Notebook</h1>
            <div className="FormsContainer">
                <div className="RegisterForm">
                    <RegisterForm />
                </div>
                <div className="LoginForm">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
