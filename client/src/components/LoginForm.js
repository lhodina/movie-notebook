import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const LoginForm = (props) => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/login", {
            email,
            password
        }, { withCredentials: true })
        .then( res => {
            console.log("res: ", res);
            if (res['data']['validation_messages']) {
                setErrors(res['data']['validation_messages']);
            } else {
                navigate("/dashboard");
            }
        })
        .catch( err => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className="header">
                <h2>Log In</h2>
            </div>
            <form onSubmit={ onSubmitHandler }>
                {errors.map((err, index) => (
                    <p className="error-message" key={index}>{err}</p>
                ))}
                <p>
                    <label>Email</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setEmail(e.target.value) } />
                </p>
                <p>
                    <label>Password</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setPassword(e.target.value) } />
                </p>
                <input type="submit" value="Log In" />
            </form>
        </div>
    );
}

export default LoginForm;
