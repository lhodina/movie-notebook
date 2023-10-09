import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Dashboard = () => {
    const [user, setUser] = useState("");
    const [favoriteDirectors, setFavoriteDirectors] = useState([]);
    const [favoriteCritics, setFavoriteCritics] = useState([]);
    const [collections, setCollections] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [directorsOpen, setDirectorsOpen] = useState(false)

    const removeFromDom = reviewId => {
        setReviews(reviews.filter(review => review.id !== reviewId));
    }

    const deleteReview = reviewId => {
        axios.get("http://localhost:5000/reviews/delete/" + reviewId)
            .then(res => {
                removeFromDom(reviewId)
            })
            .catch(err => console.log(err));
    }

    const placeholder = (review) => {
        if (review.likes_count < 1) {
            return <div>
                <p>No likes yet</p>
                <a href="/movies/:movieId/fans/add">Add a fan</a>
                </div>
        }
    }

    const toggleDirectors = () => {
        setDirectorsOpen(!directorsOpen);
    }

    useEffect(() => {
        axios.get("http://localhost:5000/dashboard")
            .then(res => {
                setUser(res.data);
                setFavoriteDirectors(res.data.favorite_directors);
                setFavoriteCritics(res.data.favorite_critics);
                setCollections(res.data.collections);
                setReviews(res.data.reviews);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="Container">
            <div className="Header">
                <h4>Welcome, {user.first_name}</h4>
                <div className="FavoriteDirectors">
                    <h5 onClick={ toggleDirectors }>Favorite Directors</h5>
                    { directorsOpen && (
                        <div className="DirectorsList">
                            <ul className="DirectorsListUL" >
                            {
                                favoriteDirectors.map( (director, index) => (
                                    <Link to={ "/directors/" + director.id } className="DirectorsListItem"><li key={index}>{director.name}</li></Link>
                                ))
                            }
                            </ul>
                            <Link to={"/favorite_directors/add"}> + Add Favorite Director</Link>
                        </div>
                    )}
                </div>

                <h5>Favorite Critics</h5>
                <h5>Collections</h5>
                <Link to={"/reviews/add"}><button>+ Review a Movie</button></Link>
                <form className="SearchBar">
                    <input className="SearchInput" type="text" value="search movies and people"></input>
                </form>
                <Link to={ "/logout" }>log out</Link>
            </div>

            <h2>Core Movies</h2>
            <div className="Main">
            {
                reviews.map( (review, index) => {
                    return (
                        <div className="CoreMovie" key={index}>
                            <img src={review.image_url} alt="" height="200px"/>
                            <div className="CoreMovieBody">
                                <Link to={ "/reviews/" + review.id }><h5>{ review.title }</h5></Link>
                                <div className="LikedBy">
                                    <h6>Liked By:</h6>
                                    {
                                    review.critic_fans.map((critic, index) => (
                                        <Link to={ "/critics/" + critic.id } key={index}><p>{critic.name}</p></Link>
                                    ))
                                    }
                                    {
                                    review.director_fans.map((director, index) => (
                                        <Link to={ "/directors/" + director.id } key={index}><p>{director.name}</p></Link>
                                    ))
                                    }
                                    {
                                        placeholder(review)
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Dashboard;
