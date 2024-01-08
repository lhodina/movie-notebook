import React, { useState } from 'react';
import axios from 'axios';

const FavoriteCriticForm = (props) => {
    const { toggleFavoriteCriticForm, userFavoriteCritics, setUserFavoriteCritics } = props;
    const [ name, setName ] = useState("");
    const [errors, setErrors] = useState([]);

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/favorite_critics", {
            name
        }, { withCredentials: true })
            .then( res => {
                const capitalize = (name) => {
                    let arr = name.split(" ");
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                    }
                    return arr.join(" ");
                }

                let capitalized = capitalize(name);
                if (res["data"]["message"]) {
                    let errorMessage = res["data"]["message"]
                    setErrors([...errors, errorMessage]);
                } else {
                    setUserFavoriteCritics([...userFavoriteCritics, {
                        "id": res["data"]["critic_id"],
                        "name": capitalized
                    }]);
                    toggleFavoriteCriticForm();
                }
            })
            .catch( err => {
                console.log(err);
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
                <input type="submit" value="Save" className="Button SaveButton"/>
                <button type="button" onClick={toggleFavoriteCriticForm} className="Button CancelButton">cancel</button>
            </form>
        </div>
    )
}

export default FavoriteCriticForm;
