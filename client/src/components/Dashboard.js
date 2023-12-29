import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import Header from './Header';
import AddFanForm from './AddFanForm';


const Dashboard = () => {
    const [user, setUser] = useState({});
    const [userFavoriteDirectors, setUserFavoriteDirectors] = useState([]);
    const [userFavoriteCritics, setUserFavoriteCritics] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [watched, setWatched] = useState([]);
    const [unwatched, setUnwatched] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [pressed, setPressed] = useState("unwatched");
    const [grayout, setGrayout] = useState(false);
    const [fanFormOpen, setFanFormOpen] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(0);
    const [criticFans, setCriticFans] = useState([]);
    const [directorFans, setDirectorFans] = useState([]);

    const navigate = useNavigate();

    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
    }

    const placeholder = (review) => {
        if (review.likes_count < 1) {
            return <div>
                <p>No likes yet</p>
                </div>
        }
    }

    const displayAll = () => {
        setDisplayed(reviews);
        setPressed("all");
    }

    const displayWatched = () => {
        setDisplayed(watched);
        setPressed("watched");
    }

    const displayUnwatched = () => {
        setDisplayed(unwatched);
        setPressed("unwatched");
    }

    const displayDirectorFans = (currentReview) => {
        if (directorFans && directorFans.length && directorFans[0].movie_id === currentReview.movie_id) {
            let newFan = directorFans[0];
            setDirectorFans([]);
            let exists;
            if (currentReview.director_fans && currentReview.director_fans.length) {
                exists = currentReview.director_fans.find((fan) => fan.name === newFan.name);
            }
            if (!exists) currentReview.director_fans.push(newFan);
        };

        let directorFansList;
        if (currentReview.director_fans && currentReview.director_fans.length) {
            directorFansList = currentReview.director_fans.map((director, index) => (
                <Link to={ "/directors/" + director.id } key={index}><p>{director.name}</p></Link>
            ));
        }

        return directorFansList;
    }

    const displayCriticFans = (currentReview) => {
        if (criticFans.length && criticFans[0].movie_id === currentReview.movie_id) {
            let newFan = criticFans[0];
            setCriticFans([]);
            let exists;
            if (currentReview.critic_fans && currentReview.critic_fans.length) {
                exists = currentReview.critic_fans.find((fan) => fan.name === newFan.name);
            }
            if (!exists) currentReview.critic_fans.push(newFan);
        };

        let criticFansList;
        if (currentReview.critic_fans && currentReview.critic_fans.length) {
            criticFansList = currentReview.critic_fans.map((critic, index) => (
            <Link to={ "/critics/" + critic.id } key={index}><p>{critic.name}</p></Link>
            ));
        }

        return criticFansList
    }

    useEffect(() => {
        axios.get("http://localhost:5000/dashboard", { withCredentials: true })
            .then(res => {
                if (!res["data"]["user_id"]) {
                    navigate("/login")
                } else {
                    setUser({
                        "id": res.data.user_id,
                        "first_name": res.data.user_first_name,
                        "last_name": res.data.user_last_name
                    });
                    setUserFavoriteDirectors(res.data.favorite_directors);
                    setUserFavoriteCritics(res.data.favorite_critics);
                    setReviews(res.data.reviews);
                    setDisplayed(res.data.unwatched);
                    setWatched(res.data.watched);
                    setUnwatched(res.data.unwatched);
                }
            })
            .catch(err => console.log(err))
    }, [navigate]);

    return (
        <div className="Container">
            <Header user={user} userFavoriteDirectors={userFavoriteDirectors} setUserFavoriteDirectors={setUserFavoriteDirectors} userFavoriteCritics={userFavoriteCritics} reviews={reviews} setReviews={setReviews} displayed={displayed} setDisplayed={setDisplayed} displayAll={displayAll} toggleGrayout={toggleGrayout}/>
            { grayout && (
                <div className="Grayout"></div>
            )}
            <h1>CORE MOVIES</h1>
            <div className="btn-group" role="group">
                <button type="button" className={pressed === "unwatched" ? "btn Pressed" : "btn Unpressed"} onClick={ displayUnwatched }>Unwatched</button>
                <button type="button" className={pressed === "watched" ? "btn Pressed" : "btn Unpressed"} onClick={ displayWatched }>Watched</button>
                <button type="button" className={pressed === "all" ? "btn Pressed" : "btn Unpressed"} onClick={ displayAll }>All Reviews</button>
            </div>
            <div className="Main">
                { fanFormOpen && (
                    <div>
                        <AddFanForm movie_id={currentMovieId} directorFans={directorFans} setDirectorFans={setDirectorFans} criticFans={criticFans} setCriticFans={setCriticFans} toggleForm={toggleFanForm} />
                    </div>
                )}
            {
                displayed.map( (review, index) => {
                    return (
                        <div className="CoreMovie" key={index}>
                            <Link to={ "/reviews/" + review.id } className="MoviePosterLink"><img src={review.image_url} alt="movie poster" className="MoviePoster" /></Link>
                            <div className="CoreMovieBody">
                                <Link to={ "/reviews/" + review.id }><h5>{ review.title }</h5></Link>
                                <div className="LikedBy">
                                    <h6>Liked By:</h6>
                                    { displayDirectorFans(review) }
                                    { displayCriticFans(review) }
                                    { placeholder(review) }
                                    <button onClick={ () => {
                                            setCurrentMovieId(review.movie_id);
                                            toggleFanForm();
                                        } } className="AddFanButton">Add a fan
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
