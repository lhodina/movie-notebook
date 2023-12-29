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
                let capitalizedName = capitalize(name);

                if (res["data"]["message"]) {
                    let errorMessage = res["data"]["message"]
                    setErrors([...errors, errorMessage]);
                } else {
                    setUserFavoriteDirectors([...userFavoriteDirectors, {
                        "id": res["data"]["director_id"],
                        "name": capitalizedName
                    }]);
                    toggleFavoriteDirectorForm();
                }
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
                <input type="submit" value="Save" className="Button SaveButton" />
                <button type="button" onClick={toggleFavoriteDirectorForm} className="Button CancelButton">cancel</button>
            </form>
        </div>
    )
}

export default FavoriteDirectorForm;
