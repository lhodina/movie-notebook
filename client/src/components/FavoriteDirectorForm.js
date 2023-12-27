import React, { useState } from 'react';
import axios from 'axios';

const FavoriteDirectorForm = (props) => {
    const { toggleFavoriteDirectorForm, userFavoriteDirectors, setUserFavoriteDirectors} = props;

    const [ name, setName ] = useState("");
    const [errors, setErrors] = useState([]);

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/favorite_directors", {
            name
        }, { withCredentials: true })
            .then( res => {
                console.log("FavoriteDirectorForm res: ", res);

                const capitalize = (name) => {
                    let arr = name.split(" ");
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                    }
                    return arr.join(" ");
                }

                let capitalized = capitalize(name);
                setUserFavoriteDirectors([...userFavoriteDirectors, {
                    "id": res["data"]["director_id"],
                    "name": capitalized
                }]);
                toggleFavoriteDirectorForm();
            })
            .catch( err => {
                console.log(err);
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
