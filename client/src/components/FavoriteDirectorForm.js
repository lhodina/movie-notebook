import React, { useState } from 'react';
import axios from 'axios';

const FavoriteDirectorForm = (props) => {
    const { toggleFavoriteDirectorForm } = props;

    const [ name, setName ] = useState("");
    const [errors, setErrors] = useState([]);

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/favorite_directors", {
            name
        }, { withCredentials: true })
            .then( res => {
                toggleFavoriteDirectorForm();
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
            <form onSubmit={ onSubmitHandler } className="FavoriteDirectorForm">
                {errors.map((err, index) => (
                    <div className="error-message" key={index}>{err}</div>
                ))}
                <div>
                    <label>Director Name</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setName(e.target.value) } />
                </div>
                <input type="submit" value="Save" />
                <button type="button" onClick={toggleFavoriteDirectorForm}>cancel</button>
            </form>
        </div>
    )
}

export default FavoriteDirectorForm;
