import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";


const Review = (props) => {
    const [review, setReview] = useState({});
    const [criticFans, setCriticFans] = useState([]);
    const [directorFans, setDirectorFans] = useState([]);
    const { id } = useParams();


    useEffect( () => {
        axios.get("http://localhost:5000/reviews/" + id)
            .then( (res) => {
                setReview(res.data);
                setCriticFans(res.data.critic_fans);
                setDirectorFans(res.data.director_fans);
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
            <p>Liked by:</p>
            <ul>
            { criticFans.map( (fan, index) => (
                <li key={ index }>{fan.name }</li>
            )) }
            { directorFans.map( (fan, index) => (
                <li key={ index }>{fan.name }</li>
            )) }
            </ul>



            <Link to={ "/reviews/" + id + "/update" }>edit</Link>
        </div>
    )

}

export default Review;
