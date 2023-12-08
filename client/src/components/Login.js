import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import RegisterForm from './RegisterForm';

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
            <div className="FormsContainer">
                <div className="RegisterForm">
                    <RegisterForm />
                </div>
                <div className="LoginForm"></div>
            </div>
        </div>
    );
}

export default Login;
