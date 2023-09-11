import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

// Star rating functionality from Albert Devshot
// https://www.youtube.com/watch?v=l1Q7o8skKPM

const colors = {
    yellow: "rgb(255, 215, 0)",
    grey: "rgb(210, 210, 210)"
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }

const ReviewForm = (props) => {
    const [ title, setTitle ] = useState("");
    const [ directorName, setDirectorName ] = useState("");
    const [ year, setYear] = useState("");
    const [ rating, setRating ] = useState(0);
    const [ watched, setWatched ] = useState("");
    const [ notes, setNotes ] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [hoverValue, setHoverValue] = React.useState(undefined);

    const navigate = useNavigate();

    const onSubmitHandler = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/reviews", {
            title,
            directorName,
            year,
            rating,
            watched,
            notes,
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

    const stars = Array(5).fill(0);


    const handleClick = value => {
        setRating(value)
    };

    const handleMouseOver = value => {
        setHoverValue(value);
    }

    const handleMouseLeave = () => {
        setHoverValue(undefined);
    }

    return (
        <div>
            <div className="header">
                <h1>Review a Movie</h1>
                <Link to={ "/dashboard" } >back to dashboard</Link>
            </div>
            <p>Testing: </p>
            <form onSubmit={ onSubmitHandler }>
                {errors.map((err, index) => (
                    <p className="error-message" key="{index}">{err}</p>
                ))}

                <p>
                    <label>Title</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setTitle(e.target.value) } />
                </p>
                <p>
                    <label>Director</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setDirectorName(e.target.value) } />
                </p>
                <p>
                    <label>Year</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setYear(e.target.value) } />
                </p>
                <p>
                    <label>Rating</label>
                    <br />
                    <div style={styles.stars}>
                        {stars.map((_, index) => {
                            return (
                                <FaStar key={index} size={14} style={{
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                                color={ (hoverValue || rating) > index ? colors.yellow : colors.grey }
                                onClick={ () => handleClick(index + 1) }
                                onMouseOver={ () => handleMouseOver(index + 1)}
                                onMouseLeave={handleMouseLeave}
                                />
                            )
                        })}
                    </div>
                </p>
                <p>
                    <label>Watched Status</label>
                    <br />
                    <input className="form-input" type="radio" name="watched" id="radio-watched" onChange = { (e) => setWatched(e.target.value) } />
                    <label>Watched</label>
                    <input className="form-input" type="radio" name="watched" id="radio-unwatched" onChange = { (e) => setWatched(e.target.value) } />
                    <label>Unwatched</label>

                </p>
                <p>
                    <label>Notes</label>
                    <br />
                    <textarea className="form-input" type="text" onChange = { (e) => setNotes(e.target.value) } />
                </p>
                <input type="submit" value="Save" />
            </form>
        </div>
    )
}

export default ReviewForm;
