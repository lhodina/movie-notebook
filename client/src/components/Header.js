import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import LogoutButton from './LogoutButton';
import ReviewForm from './ReviewForm';
import FavoriteDirectorForm from './FavoriteDirectorForm';
import FavoriteCriticForm from './FavoriteCriticForm';

const Header = (props) => {
    const { user, userFavoriteDirectors, setUserFavoriteDirectors, userFavoriteCritics, setUserFavoriteCritics, reviews, setReviews, displayed, setDisplayed, displayAll, toggleGrayout } = props;
    const [newReviewFormOpen, setNewReviewFormOpen] = useState(false);
    const [favoriteDirectorFormOpen, setFavoriteDirectorFormOpen] = useState(false);
    const [favoriteCriticFormOpen, setFavoriteCriticFormOpen] = useState(false);
    const [directorsOpen, setDirectorsOpen] = useState(false);
    const [criticsOpen, setCriticsOpen] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const closeSearchDropdown = (e) => {
            if (!e.target.closest(".SearchArea")) {
                setQuery("");
            }
        };
        document.addEventListener("click", closeSearchDropdown);
        return () => document.removeEventListener("click", closeSearchDropdown);
      }, []);

    const openDirectors = () => {
        setDirectorsOpen(true);
    }

    const closeDirectors = () => {
        setDirectorsOpen(false);
    }

    const openCritics = () => {
        setCriticsOpen(true);
    }

    const closeCritics = () => {
        setCriticsOpen(false);
    }

    const toggleNewReviewForm = () => {
        setNewReviewFormOpen(!newReviewFormOpen);
        closeDirectors();
        closeCritics();
        toggleGrayout();
    }

    const toggleFavoriteDirectorForm = () => {
        setFavoriteDirectorFormOpen(!favoriteDirectorFormOpen);
        closeDirectors();
        toggleGrayout();
    }

    const toggleFavoriteCriticForm = () => {
        setFavoriteCriticFormOpen(!favoriteCriticFormOpen);
        closeCritics();
        toggleGrayout();
    }

    const updateQuery = (e) => {
        setQuery(e.target.value);
    };

    const showSearchResults = () => {
        const showReviews = [];
        for (let review of reviews) {
            if (query && review.title.toLowerCase().startsWith(query)) {
                showReviews.push(review);
            }
        }

        const showDirectors = [];
        for (let director of userFavoriteDirectors) {
            if (query && director.name.toLowerCase().startsWith(query)) {
                showDirectors.push(director);
            }
        }

        const showCritics = [];
        for (let critic of userFavoriteCritics) {
            if (query && critic.name.toLowerCase().startsWith(query)) {
                showCritics.push(critic);
            }
        }

        return (query.length > 1 && <div className="NavDropdown"><ul className="NavDropdownList">

            {showReviews.length > 0 && showReviews.map((review, index) => {
                return <Link to={'/reviews/' + review.id} key={index} className="NavDropdownListItem"><li>{review.title}</li></Link>
            })}
            {showDirectors.length > 0 && showDirectors.map((director, index) => {
                return <Link to={'/directors/' + director.id} key={index} className="NavDropdownListItem"><li>{director.name}</li></Link>
            })}
            {showCritics.length > 0 && showCritics.map((critic, index) => {
                return <Link to={'/critics/' + critic.id} key={index} className="NavDropdownListItem"><li>{critic.name}</li></Link>
            })}
        </ul></div>)
    }

    const getSearchResults = (e) => {
        updateQuery(e);
        showSearchResults();
    }

    return (
        <div className="Header">
            { newReviewFormOpen && (
                <div className="NewReviewForm">
                    <ReviewForm user={user} location="newReview" toggleNewReviewForm={toggleNewReviewForm} reviews={reviews} setReviews={setReviews} displayAll={displayAll} displayed={displayed} setDisplayed={setDisplayed} />
                </div>
            )}
            { favoriteDirectorFormOpen && (
                <div className="FavoriteDirectorForm">
                    <FavoriteDirectorForm user={user} toggleFavoriteDirectorForm={toggleFavoriteDirectorForm} userFavoriteDirectors={userFavoriteDirectors} setUserFavoriteDirectors={setUserFavoriteDirectors}  />
                </div>
            )}
            { favoriteCriticFormOpen && (
                <div className="FavoriteCriticForm">
                    <FavoriteCriticForm user={user} toggleFavoriteCriticForm={toggleFavoriteCriticForm} userFavoriteCritics={userFavoriteCritics} setUserFavoriteCritics={setUserFavoriteCritics} />
                </div>
            )}
            <h5>Welcome, {user.first_name}</h5>
            <div className="NavMenuItem" onMouseEnter={ openDirectors } onMouseLeave={ closeDirectors } >
                <h5>My Directors</h5>
                { directorsOpen && (
                    <div className="NavDropdown">
                        <button className="Button AddFavoriteButton" onClick={toggleFavoriteDirectorForm}>+ Add Favorite Director</button>
                        <ul className="NavDropdownList" >
                        {
                            userFavoriteDirectors.map( (director, index) => (
                                <Link key={index} to={ "/directors/" + director.id } className="NavDropdownListItem"><li>{director.name}</li></Link>
                            ))
                        }
                        </ul>
                    </div>
                )}
            </div>
            <div className="NavMenuItem" onMouseEnter={ openCritics } onMouseLeave={ closeCritics }>
                <h5>My Critics</h5>
                { criticsOpen && (
                    <div className="NavDropdown">
                        <button className="Button AddFavoriteButton" onClick={toggleFavoriteCriticForm}>+ Add Favorite Critic</button>
                        <ul className="NavDropdownList" >
                        {
                            userFavoriteCritics.map( (critic, index) => (
                                <Link key={index} to={ "/critics/" + critic.id } className="NavDropdownListItem"><li>{critic.name}</li></Link>
                            ))
                        }
                        </ul>
                    </div>
                )}
            </div>
            <button className="Button AddReviewButton" onClick={toggleNewReviewForm}>+ Review a Movie</button>
            <div className="SearchArea">
                <input type="search" placeholder="search my stuff" value={query} onChange={getSearchResults} />
                {showSearchResults()}
            </div>
            <Link to={"/dashboard"}>back to dashboard</Link>
            <LogoutButton />
        </div>
    )
}

export default Header;
