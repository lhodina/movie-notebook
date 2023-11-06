import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
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

  const placeholder = (review) => {
    if (review.likes_count < 1) {
        return <div>
            <p>No likes yet </p>
            <Link to="/movies/{review.movieId}/fans/add">Add a fan</Link>
            </div>
    }
}

const Review = (props) => {
    const { user } = props;
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
    }, []);

    const stars = Array(5).fill(0);

    return (
        <div className="Container">
            <div className="Header">
                <Link to={ "/dashboard" } >back to dashboard</Link>
                <form className="SearchBar">
                    <input className="SearchInput" type="text" value="search movies and people"></input>
                </form>
                <div className="NavUser">
                    <h5>{user.first_name} {user.last_name[0]}.</h5>
                    <Link to={ "/logout" }>log out</Link>
                </div>
            </div>

            <div className="ReviewContent">
                <img src={review.image_url} height="500px" alt="" />
                <div className="ReviewDetails">
                    <h1>{review.title}</h1>
                    <p>Directed by <Link to={'/directors/' + review.directed_by_id} >{ review.director_name}</Link></p>
                    <p>Released { review.year } </p>
                    <p>Your notes: "{review.notes}"</p>
                    <p style={styles.stars}>
                        <span className="Rating" >My rating:</span>
                        {stars.map((_, index) => {
                            return (
                                <FaStar key={index} size={14} style={{
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                                color={ (review.rating) > index ? colors.yellow : colors.grey }
                                />
                            )
                        })}
                    </p>
                    <p>Watched: {review.watched ? "Yes" : "No"}</p>
                    <p><Link to={ "/reviews/" + id + "/update" }>edit</Link></p>
                    <h2>Liked by:</h2>
                    <ul>
                    { criticFans.map( (critic, index) => (
                        <Link to={ "/critics/" + critic.id }  key={ index }><li>{critic.name }</li></Link>
                    )) }
                    { directorFans.map( (director, index) => (
                        <Link to={ "/directors/" + director.id} key={ index }><li>{director.name }</li></Link>
                    )) }
                    </ul>
                    { placeholder(review) }
                </div>
            </div>
        </div>
    )
}

export default Review;
