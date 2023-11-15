import React, { useState } from 'react'
import axios from 'axios';
import { useParams} from "react-router-dom";
import { FaStar } from "react-icons/fa";

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

const UpdateReviewForm = (props) => {
    const {rating, setRating, watched, setWatched, toggleReviewForm } = props;
    const { id } = useParams();
    const [errors, setErrors] = useState([]);
    const [hoverValue, setHoverValue] = React.useState(undefined);

    const updateReview = e => {
        e.preventDefault();
        // setRating(rating);
        setWatched(watched);
        axios.post("http://localhost:5000/reviews/" + id, {
            rating,
            watched
        })
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

    const checkWatched = () => {
        if (watched == 1) {
            return <><input className="form-input" type="radio" name="watched" value="1" checked id="radio-watched"  /><label>Watched</label><input className="form-input" type="radio" name="watched" id="radio-unwatched" value="0" onChange = { (e) => setWatched(e.target.value) } /><label>Unwatched</label></>
        } else if (watched == 0) {
            return <><input className="form-input" type="radio" name="watched" value="1" id="radio-watched" onChange = { (e) => setWatched(e.target.value) } /><label>Watched</label><input className="form-input" type="radio" name="watched" id="radio-unwatched" value="0" checked  /><label>Unwatched</label></>
        } else {
            return <><p>What's-a goin' on here?</p></>
        }
    }

    return (
        <div className="Container">
            <h2>Update Review</h2>
            <form onSubmit={ updateReview }>
                {errors.map((err, index) => (
                    <p className="error-message" key="{index}">{err}</p>
                ))}
                <p>
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
                </p>
                <p>
                    <label>Watched Status:</label>
                    <br />
                    <>{ checkWatched() }</>
                </p>
                <input type="submit" value="Save" />
                <button onClick={toggleReviewForm}>cancel</button>
            </form>
        </div>
    )
}

export default UpdateReviewForm;
