import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const FavoriteCriticForm = (props) => {
    const { user, toggleFavoriteCriticForm } = props;
    const [ name, setName ] = useState("");
    const [errors, setErrors] = useState([]);

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/favorite_critics", {
            name
        }, { withCredentials: true })
            .then( res => {
                toggleFavoriteCriticForm();
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
        <div className="Container">
            <form onSubmit={ onSubmitHandler } className="FavoriteCriticForm">
                {errors.map((err, index) => (
                    <div className="error-message" key={index}>{err}</div>
                ))}
                <div>
                    <label>Critic Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setName(e.target.value) } />
                </div>
                <input type="submit" value="Save" />
                <button type="button" onClick={toggleFavoriteCriticForm}>cancel</button>
            </form>
        </div>
    )
}

export default FavoriteCriticForm;
