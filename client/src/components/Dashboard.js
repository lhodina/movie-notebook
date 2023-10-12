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
    const [directorsOpen, setDirectorsOpen] = useState(false);
    const [criticsOpen, setCriticsOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);

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

    const toggleCritics = () => {
        setCriticsOpen(!criticsOpen);
    }

    const toggleCollections = () => {
        setCollectionsOpen(!collectionsOpen);
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
                <div className="NavMenuItem" onMouseEnter={ toggleDirectors } onMouseLeave={ toggleDirectors } >
                    <h5>Favorite Directors</h5>
                    { directorsOpen && (
                        <div className="NavDropdown">
                            <ul className="NavDropdownList" >
                            {
                                favoriteDirectors.map( (director, index) => (
                                    <Link to={ "/directors/" + director.id } className="NavDropdownListItem"><li key={index}>{director.name}</li></Link>
                                ))
                            }
                            </ul>
                            <Link to={"/favorite_directors/add"}> + Add Favorite Director</Link>
                        </div>
                    )}
                </div>
                <div className="NavMenuItem" onMouseEnter={ toggleCritics } onMouseLeave={ toggleCritics }>
                    <h5>Favorite Critics</h5>
                    { criticsOpen && (
                        <div className="NavDropdown">
                            <ul className="NavDropdownList" >
                            {
                                favoriteCritics.map( (critic, index) => (
                                    <Link to={ "/critics/" + critic.id } className="NavDropdownListItem"><li key={index}>{critic.name}</li></Link>
                                ))
                            }
                            </ul>
                            <Link to={"/favorite_critics/add"}> + Add Favorite Critic</Link>
                        </div>
                    )}
                </div>
                <div className="NavMenuItem" onMouseEnter={ toggleCollections } onMouseLeave={ toggleCollections }>
                    <h5>Collections</h5>
                    { collectionsOpen && (
                        <div className="NavDropdown">
                            <ul className="NavDropdownList" >
                            {
                                collections.map( (collection, index) => (
                                    <Link to={ "/collections/" + collection.id } className="NavDropdownListItem"><li key={index}>{collection.name}</li></Link>
                                ))
                            }
                            </ul>
                            <Link to={"/collections/add"}> + Add Collection</Link>
                        </div>
                    )}
                </div>

                <Link to={"/reviews/add"}><button className="btn btn-danger">+ Review a Movie</button></Link>
                <form className="SearchBar">
                    <input className="SearchInput" type="text" value="search movies and people"></input>
                </form>
                <Link to={ "/logout" }>log out</Link>
            </div>

            <h1>CORE MOVIES</h1>
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
