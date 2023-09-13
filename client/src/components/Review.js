import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";


const Review = (props) => {
    const [review, setReview] = useState({});
    const { id } = useParams();


    useEffect( () => {
        axios.get("http://localhost:5000/reviews/" + id)
            .then( (res) => {
                console.log(res.data);
                setReview(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <div className="header">
                <h1>{review.title}</h1>
                <Link to={ "/dashboard" } >back to dashboard</Link>
            </div>
            <p> { review.year } </p>
            <img src={review.image_url} height="300px" alt="" />
            <p>Directed by { review.director_name}</p>
            <p>Your notes: </p>
            <p>"{review.notes}"</p>
            <p>Watched status: {review.watched}</p>
            <p>My rating: {review.rating}</p>
            <Link to={ "/reviews/" + id + "/update" }>edit</Link>
        </div>
    )

}

export default Review;
