import React, { useEffect } from 'react'
import axios from 'axios';
import '../App.css';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const Login = (props) => {
    useEffect(() => {
        axios.get("http://localhost:5000/login")
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="Container">
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
