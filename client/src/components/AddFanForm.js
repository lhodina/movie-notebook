import React, { useState } from 'react';
import axios from 'axios';

const AddFanForm = (props) => {
    const { movie_id, toggleForm, directorFans, setDirectorFans, criticFans, setCriticFans, newFan, setNewFan } = props;
    const [ name, setName ] = useState("");
    const [ fanType, setFanType ] = useState("director");
    const [ errors, setErrors ] = useState([]);

    const capitalize = (name) => {
        let arr = name.split(" ");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(" ");
    }

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post(`http://localhost:5000/movies/${movie_id}/${fanType}_fans`, {
            name
        }, { withCredentials: true })
            .then( res => {
                toggleForm();
                let capitalized = capitalize(name);
                if (fanType === "director") {
                    setDirectorFans([...directorFans, {"id": res["data"]["director_id"], "name": capitalized, "movie_id": movie_id }])
                } else if (fanType === "critic") {
                    criticFans && setCriticFans([...criticFans, {"id": res["data"]["critic_id"], "name": capitalized, "movie_id": movie_id}])
                }

            })
            .catch( err => {
                console.log(err);
            })
    }

    const fanTypeDirector = () => {
        setFanType("director")
    }

    const fanTypeCritic = () => {
        setFanType("critic")
    }

    return (
        <div className="FanForm">
            <div>
                <h1>Add a Fan</h1>
                <div className="btn-group" role="group">
                    <button type="button" className={ fanType === "director" ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ fanTypeDirector }>Director</button>
                    <button type="button" className={ fanType === "critic" ? "active btn btn-outline-danger" : "btn btn-outline-danger" } onClick={ fanTypeCritic }>Critic</button>
                </div>
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
                <input type="submit" value="Submit" />
                <button onClick={toggleForm}>cancel</button>
            </form>
        </div>
    )
}

export default AddFanForm;
