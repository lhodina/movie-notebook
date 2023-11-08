import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddFanForm = (props) => {
    const { movie_id, toggleForm, handleRefresh } = props;
    const [ name, setName ] = useState("");
    const [fanType, setFanType] = useState("director");
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post(`http://localhost:5000/movies/${movie_id}/${fanType}_fans`, {
            name
        })
            .then( res => {
                toggleForm();
                handleRefresh();
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

    const toggleFanType = () => {
        fanType !== "director" ? setFanType("director") : setFanType("critic");
    }

    return (
        <div className="FanForm">
            <div>
                <h1>Add a Fan</h1>
                <div className="btn-group" role="group">
                    <button type="button" className={ fanType === "director" ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ toggleFanType }>Director</button>
                    <button type="button" className={ fanType === "critic" ? "active btn btn-outline-danger" : "btn btn-outline-danger" } onClick={ toggleFanType }>Critic</button>
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
