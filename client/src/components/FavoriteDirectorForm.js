import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const FavoriteDirectorForm = (props) => {
    const [ name, setName ] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState([]);


    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/", {
            name,
            imageUrl
        })
            .then( res => {
                navigate("/dashboard");
            })
            .catch( err => {
                const errorResponse = err.response.data.errors;

                const errorArr = [];
                for (const key of Object.keys(errorResponse)) {
                    errorArr.push(errorResponse[key].message);
                }
                setErrors(errorArr);
            })
    }

    return (
        <div>
            <div className="header">
                <h1>Add Favorite Director</h1>
                <Link to={ "/dashboard" } >back to dashboard</Link>
            </div>
            <form onSubmit={ onSubmitHandler }>
                {errors.map((err, index) => (
                    <div className="error-message" key={index}>{err}</div>
                ))}
                <div>
                    <label>Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setName(e.target.value) } />
                </div>
            </form>
        </div>
    )
}

export default FavoriteDirectorForm;
