import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from "react-icons/fa";

// Star rating functionality from Albert Devshot
// https://www.youtube.com/watch?v=l1Q7o8skKPM

const colors = {
    yellow: "rgb(211, 164, 46)",
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
    const { location, currentDirector, currentCritic, toggleNewReviewForm, moviesDirected, setMoviesDirected, favoriteMovies, setFavoriteMovies, reviews, setReviews, watched, setWatched, unwatched, setUnwatched, displayed, setDisplayed } = props;
    const [ title, setTitle ] = useState("");
    const [ rating, setRating ] = useState(0);
    const [ watchedStatus, setWatchedStatus ] = useState("");
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
            watched: watchedStatus,
            notes,
            director_id,
            critic_id,
            location
        }, { withCredentials: true })
            .then( res => {
                console.log("ReviewForm res: ", res);
                if (res.data["message"]) {
                    let errorMessage = res.data["message"];
                    setErrors([...errors, errorMessage]);
                } else if (location === "newReview") {
                    toggleNewReviewForm();
                    setReviews([...reviews, res.data])
                    if (watchedStatus === "1") {
                        setWatched([...watched, res.data])
                    } else if (watchedStatus === "0") {
                        setUnwatched([...unwatched, res.data])
                    }
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
                console.log(err);
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
                {location === "newReview" && <div>
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
                        <label className="WatchedStatusLabel">Watched Status</label>
                        <br />
                        <input className="form-input Radio Watched" type="radio" name="watched" value="1" checked={ watchedStatus==="1" } id="radio-watched" onChange = { (e) => setWatchedStatus("1") } />
                        <label className="Label Watched">Watched</label>
                        <input className="form-input Radio Unwatched" type="radio" name="watched" value="0" checked={ watchedStatus==="0"} id="radio-unwatched" onChange = { (e) => setWatchedStatus("0") } />
                        <label className="Label Unwatched">Unwatched</label>
                    </p>
                    <p>
                        <label>Notes</label>
                        <br />
                        <textarea className="form-input" type="text" onChange = { (e) => setNotes(e.target.value) } />
                    </p>
                </div>}
                <input type="submit" value="Save" className="Button SaveButton" />
                <button type="button" onClick={toggleNewReviewForm} className="Button CancelButton">cancel</button>
            </form>
        </div>
    )
}

export default ReviewForm;
