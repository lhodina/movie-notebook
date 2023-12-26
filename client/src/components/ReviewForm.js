import React, { useState } from 'react';
import axios from 'axios';
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
    const { location, currentDirector, currentCritic, toggleNewReviewForm, moviesDirected, setMoviesDirected, favoriteMovies, setFavoriteMovies, reviews, setReviews, displayed, setDisplayed } = props;
    const [ title, setTitle ] = useState("");
    const [ rating, setRating ] = useState(0);
    const [ watched, setWatched ] = useState("");
    const [ notes, setNotes ] = useState("");
    const [errors, setErrors] = useState([]);
    const [hoverValue, setHoverValue] = useState(undefined);


    const onSubmitHandler = e => {
        e.preventDefault();
        let director_id;
        let critic_id;
        if (currentDirector) {
            director_id = currentDirector.id;
        }
        if (currentCritic) {
            critic_id = currentCritic.id;
        }

        axios.post("http://localhost:5000/reviews", {
            title,
            rating,
            watched,
            notes,
            director_id,
            critic_id,
            location
        }, { withCredentials: true })
            .then( res => {
                if (location === "newReview") {
                    console.log("axios.post res: ", res);
                    toggleNewReviewForm();
                    setReviews([...reviews, res.data])
                    setDisplayed([...displayed, res.data])
                } else if (location === "movieDirected") {
                    setMoviesDirected([...moviesDirected, res.data]);
                    toggleNewReviewForm();
                } else if (location === "favoriteMovies") {
                    setFavoriteMovies([...favoriteMovies, res.data]);
                    toggleNewReviewForm();
                }
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

    // Star rating logic
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
        <div className="Container">
            <form onSubmit={ onSubmitHandler } className="AddReviewForm">
                {errors.map((err, index) => (
                    <p className="error-message" key={index}>{err}</p>
                ))}
                <p>
                    <label>Title</label>
                    <br />
                    <input className="form-input" type="text" onChange = { (e) => setTitle(e.target.value) } />
                </p>
                <div>
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
                </div>
                <p>
                    <label>Watched Status</label>
                    <br />
                    <input className="form-input" type="radio" name="watched" value="1" checked={ watched==="1" } id="radio-watched" onChange = { (e) => setWatched("1") } />
                    <label>Watched</label>
                    <input className="form-input" type="radio" name="watched" value="0" checked={ watched==="0"} id="radio-unwatched" onChange = { (e) => setWatched("0") } />
                    <label>Unwatched</label>
                </p>
                <p>
                    <label>Notes</label>
                    <br />
                    <textarea className="form-input" type="text" onChange = { (e) => setNotes(e.target.value) } />
                </p>
                <input type="submit" value="Save" />
                <button type="button" onClick={toggleNewReviewForm}>cancel</button>
            </form>
        </div>
    )
}

export default ReviewForm;
