import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import AddFanForm from './AddFanForm'

const Dashboard = (props) => {
    const { user } = props;
    const [favoriteDirectors, setFavoriteDirectors] = useState([]);
    const [favoriteCritics, setFavoriteCritics] = useState([]);
    const [collections, setCollections] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [directorsOpen, setDirectorsOpen] = useState(false);
    const [criticsOpen, setCriticsOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [fanFormOpen, setFanFormOpen] = useState(false);
    const [grayout, setGrayout] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(0);

    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
    }


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

    const handleRefresh = () => {
        // We want the entire movie ranking order to be rearranged, not just have the new name rendered on the movie card
        window.location.reload();
    }

    useEffect(() => {
        axios.get("http://localhost:5000/dashboard")
            .then(res => {
                setFavoriteDirectors(res.data.favorite_directors);
                setFavoriteCritics(res.data.favorite_critics);
                setCollections(res.data.collections);
                setReviews(res.data.reviews);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="Container">
            { grayout && (
                <div className="Grayout"></div>
            )}
            <div className="Header">
                <h4>Welcome, {user.first_name}</h4>
                <div className="NavMenuItem" onMouseEnter={ toggleDirectors } onMouseLeave={ toggleDirectors } >
                    <h5>My Directors</h5>
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
                    <h5>My Critics</h5>
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
                { fanFormOpen && (
                    <div>
                        <AddFanForm movie_id={currentMovieId} toggleForm={toggleFanForm} handleRefresh={handleRefresh} />
                    </div>
                )}
            {
                reviews.map( (review, index) => {
                    return (
                        <div className="CoreMovie" key={index}>
                            <Link to={ "/reviews/" + review.id }><img src={review.image_url} alt="" height="200px"/></Link>
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
                                    <button onClick={ () => {
                                        setCurrentMovieId(review.movie_id);
                                        toggleFanForm();
                                        } }>Add a fan
                                    </button>
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
