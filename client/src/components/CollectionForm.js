import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const CollectionForm = (props) => {
    const [ name, setName ] = useState("");
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/collections", {
            name
        })
        .then( res => {
            navigate("/dashboard");
        })
        .catch( err => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className="header">
                <h1>Add Collection</h1>
            </div>
            <form onSubmit={ onSubmitHandler }>
                {errors.map((err, index) => (
                    <p className="error-message" key={index}>{err}</p>
                ))}
                <p>
                    <label>Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setName(e.target.value) } />
                </p>
                <input type="submit" value="Save" />
                <Link to={ "/dashboard" } >cancel</Link>
            </form>
        </div>
    );
}

export default CollectionForm;
