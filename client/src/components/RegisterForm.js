import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = (props) => {
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/users/register", {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }, { withCredentials: true })
        .then( res => {
            console.log("res: ", res);
            if (res['data']['validation_messages']) {
                setErrors(res['data']['validation_messages']);
            } else {
                console.log("IN REACT, WE MADE IT PAST VALIDATION AND ARE ABOUT TO NAVIGATE TO DASHBOARD")
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
                <h2>Register</h2>
            </div>
            <form onSubmit={ onSubmitHandler }>
                {errors.map((err, index) => (
                    <p className="error-message" key={index}>{err}</p>
                ))}
                <p>
                    <label>First Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setFirstName(e.target.value) } />
                </p>
                <p>
                    <label>Last Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setLastName(e.target.value) } />
                </p>
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
                <p>
                    <label>Confirm Password</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setConfirmPassword(e.target.value) } />
                </p>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}

export default RegisterForm;
