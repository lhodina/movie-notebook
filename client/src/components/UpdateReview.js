import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
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

const UpdateReview = (props) => {
    const { id } = useParams();
    const [ rating, setRating ] = useState(0);
    const [ watched, setWatched ] = useState(0);
    const [ notes, setNotes ] = useState("");
    const [movieId, setMovieId] = useState(0);
    const [errors, setErrors] = useState([]);
    const [hoverValue, setHoverValue] = React.useState(undefined);

    const navigate = useNavigate();

    useEffect( () => {
        axios.get("http://localhost:5000/reviews/" + id)
            .then( res => {
                setRating(res.data.rating);
                setWatched(res.data.watched);
                setNotes(res.data.notes);
                setMovieId(res.data.movie_id);
            })
            .catch( err => console.log(err))
    }, [])

    const updateReview = e => {
        e.preventDefault();
        axios.post("http://localhost:5000/reviews/" + id, {
            rating,
            watched,
            notes,
            movieId
        })
        .then( res => navigate("/dashboard"))
        .catch( err => console.log(err))
    }

    // const deleteReview = () => {
    //     axios.delete("http://localhost:5000/reviews/" + id)
    //         .then(res => {
    //             navigate("/dashboard");
    //         })
    //         .catch(err => console.log(err));
    // }

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
        if (watched === 1) {
            return <><input className="form-input" type="radio" name="watched" value="1" checked id="radio-watched" onChange = { (e) => setWatched(e.target.value) } /><label>Watched</label><input className="form-input" type="radio" name="watched" id="radio-unwatched" value="0" onChange = { (e) => setWatched(e.target.value) } /><label>Unwatched</label></>
        } else {
            return <><input className="form-input" type="radio" name="watched" value="1" id="radio-watched" onChange = { (e) => setWatched(e.target.value) } /><label>Watched</label><input className="form-input" type="radio" name="watched" id="radio-unwatched" value="0" checked onChange = { (e) => setWatched(e.target.value) } /><label>Unwatched</label></>

        }
    }

    return (
        <div>
            <Link to={ "/dashboard" } >back to dashboard</Link>
            <form onSubmit={ updateReview }>
                {errors.map((err, index) => (
                    <p className="error-message" key="{index}">{err}</p>
                ))}
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
                    <>{ checkWatched() }</>
                </p>
                <p>
                    <label>Notes</label>
                    <br />
                    <textarea onChange = { (e) => setNotes(e.target.value) } defaultValue={notes}></textarea>
                </p>
                <input type="submit" value="Save" />
            </form>
        </div>
    )
}

export default UpdateReview;
