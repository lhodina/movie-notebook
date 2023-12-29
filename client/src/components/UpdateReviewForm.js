import React, { useState } from 'react'
import axios from 'axios';
import { useParams} from "react-router-dom";
import { FaStar } from "react-icons/fa";

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

const UpdateReviewForm = (props) => {
    const {rating, setRating, watched, setWatched, toggleReviewForm } = props;
    const { id } = useParams();
    const [errors, setErrors] = useState([]);
    const [hoverValue, setHoverValue] = React.useState(undefined);

    const updateReview = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/reviews/" + id, {
            rating,
            watched
        }, { withCredentials: true })
        .then( res => {
            toggleReviewForm();
        })
        .catch( err => console.log(err))
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
        <div className="Container">
            <h2>Update Review</h2>
            <form onSubmit={ updateReview }>
                {errors.map((err, index) => (
                    <p className="error-message" key={index}>{err}</p>
                ))}
                <div>
                    <label>Rating:</label>
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
                    <input className="form-input Radio Watched" type="radio" name="watched" value="1" checked={ watched==="1" } id="radio-watched" onChange = { (e) => setWatched("1") } />
                    <label className="Label Watched">Watched</label>
                    <input className="form-input Radio Unwatched" type="radio" name="watched" value="0" checked={ watched==="0"} id="radio-unwatched" onChange = { (e) => setWatched("0") } />
                    <label className="Label Unwatched">Unwatched</label>
                </p>
                <input type="submit" value="Save" className="Button SaveButton" />
                <button onClick={toggleReviewForm} className="Button CancelButton">cancel</button>
            </form>
        </div>
    )
}

export default UpdateReviewForm;
