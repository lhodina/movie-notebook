import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import expandIcon from "../assets/expand-icon-small.png";
import Header from './Header';
import ReviewForm from './ReviewForm';
import AddFanForm from './AddFanForm';


const Director = () => {
    const [user, setUser] = useState({});
    const [currentDirector, setCurrentDirector] = useState({});
    const [moviesDirected, setMoviesDirected] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [notes, setNotes] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [favoritesOpen, setFavoritesOpen] = useState(true);
    const [directedByOpen, setDirectedByOpen] = useState(false);
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [editFormExpanded, setEditFormExpanded] = useState(false);
    const [userLinks, setUserLinks] = useState([]);
    const [linkFormExpanded, setLinkFormExpanded] = useState(false);
    const [newLinkText, setNewLinkText] = useState("");
    const [newLinkURL, setNewLinkURL] = useState("");
    const [movieDirectedFormOpen, setMovieDirectedFormOpen] = useState(false);
    const [favoriteMovieFormOpen, setFavoriteMovieFormOpen] = useState(false);
    const [grayout, setGrayout] = useState(false);
    const [fanFormOpen, setFanFormOpen] = useState(false);
    const [userFavoriteDirectors, setUserFavoriteDirectors] = useState([]);
    const [userFavoriteCritics, setUserFavoriteCritics] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReviewFormOpen, setNewReviewFormOpen] = useState(false);
    const [displayed, setDisplayed] = useState([]);

    const { id } = useParams();

    const previewNotes = () => {
        let notesArr = notes.split(" ");
        if (notesArr.length > 30 && notesExpanded === false) {
            let trimmed = notesArr.slice(0, 30);
            return `${trimmed.join(" ")}...`;
        } else {
            return notes;
        }
    }

    useEffect( () => {
        axios.get("http://localhost:5000/directors/" + id, { withCredentials: true })
            .then( (res) => {
                console.log("directors res: ", res);
                setUser({
                    "id": res.data.user_id,
                    "first_name": res.data.user_first_name,
                    "last_name": res.data.user_last_name
                });
                setCurrentDirector(res.data);
                setMoviesDirected(res.data.movies_directed);
                setFavoriteMovies(res.data.favorite_movies);
                setNotes(res.data.notes);
                setEditNotes(res.data.notes);
                setUserLinks(res.data.links);
                setUserFavoriteDirectors(res.data.user_favorite_directors);
                setUserFavoriteCritics(res.data.user_favorite_critics);
                setReviews(res.data.reviews);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id]);

    const showFavorites = () => {
        setFavoritesOpen(true);
        setDirectedByOpen(false);
    }

    const showDirectedBy = () => {
        setDirectedByOpen(true);
        setFavoritesOpen(false);
    }

    const toggleEditFormExpanded = () => {
        setEditFormExpanded(!editFormExpanded);
        setNotesExpanded(false);
        toggleGrayout();
    }

    const toggleLinkFormExpanded = () => {
        setLinkFormExpanded(!linkFormExpanded);
        toggleGrayout();
    }

    const toggleMovieDirectedForm = () => {
        setMovieDirectedFormOpen(!movieDirectedFormOpen);
        toggleGrayout();
    }

    const toggleFavoriteMovieForm = () => {
        setFavoriteMovieFormOpen(!favoriteMovieFormOpen);
        toggleGrayout();
    }

    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const toggleNewReviewForm = () => {
        setNewReviewFormOpen(!newReviewFormOpen);
        toggleGrayout();
    }

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
    }

    const updateNotes = e => {
        e.preventDefault();
        toggleEditFormExpanded();
        setNotes(editNotes);
        axios.post('http://localhost:5000/favorite_directors/' + id + '/update', { "notes": editNotes }, { withCredentials: true })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    const addLink = e => {
        e.preventDefault();
        axios.post('http://localhost:5000/directors/' + id + '/links', {
            "text": newLinkText,
            "url": newLinkURL,
            "user_id": user.id,
            "director_id": id
        }, { withCredentials: true }).then((res) => {
            setUserLinks([...userLinks, {
                "id": res["data"]["id"],
                "text": newLinkText,
                "url": newLinkURL,
                "user_id": user.id,
                "director_id": id
            }])
        })
        setNewLinkText("")
        setNewLinkURL("")
        toggleLinkFormExpanded();
    }

    const removeLinkFromDom = linkId => {
        setUserLinks(userLinks.filter(link => link.id !== linkId));
    }

    const deleteLink = linkId => {
        axios.post(`http://localhost:5000/director_links/${linkId}/delete`, { withCredentials: true })
            .then(res => {
                removeLinkFromDom(linkId);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="Container">
            { grayout && (
                <div className="Grayout"></div>
            )}
            <Header user={user} userFavoriteDirectors={userFavoriteDirectors} userFavoriteCritics={userFavoriteCritics} reviews={reviews} toggleForm={toggleNewReviewForm} />
            <div className="DirectorProfile">
                { newReviewFormOpen && (
                    <div className="NewReviewForm">
                        <ReviewForm user={user} location="newReview" toggleForm={toggleNewReviewForm} reviews={reviews} setReviews={setReviews} displayed={displayed} setDisplayed={setDisplayed} />
                    </div>
                )}
                { movieDirectedFormOpen && (
                    <div className="DirectedByForm">
                        <ReviewForm user={user} location="movieDirected" currentDirector={currentDirector} moviesDirected={moviesDirected} setMoviesDirected={setMoviesDirected} toggleForm={toggleMovieDirectedForm} />
                    </div>
                )}
                { favoriteMovieFormOpen && (
                    <div className="FavoriteMovieForm">
                        <ReviewForm user={user} location="favoriteMovies" currentDirector={currentDirector} favoriteMovies={favoriteMovies} setFavoriteMovies={setFavoriteMovies} toggleForm={toggleFavoriteMovieForm} />
                    </div>
                )}
                { fanFormOpen && (
                    <div>
                        {/* <AddFanForm movie_id={currentMovieId} directorFans={directorFans} setDirectorFans={setDirectorFans} criticFans={criticFans} setCriticFans={setCriticFans} toggleForm={toggleFanForm} /> */}
                    </div>
                )}
                <img src={currentDirector.image_url} height="200px" alt="" />
                <div className="ProfileContent">
                    <h1>{ currentDirector.name }</h1>
                    <div className="btn-group" role="group">
                        <button type="button" className={ favoritesOpen ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ showFavorites }>{currentDirector.name}'s Favorite Movies</button>
                        <button type="button" className={ directedByOpen ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ showDirectedBy }>Movies Directed by {currentDirector.name}</button>
                    </div>
                { directedByOpen && (
                    <div>
                        <button type="button" className="AddDirectedButton" onClick={toggleMovieDirectedForm}>Add Movie</button>
                    </div>
                )}
                { favoritesOpen && (
                    <div>
                        <button type="button" className="AddFavoriteButton" onClick={toggleFavoriteMovieForm}>Add Favorite</button>
                    </div>
                )}
                </div>
            </div>
            <div className="DirectorMain">
                <div className="UserContent">
                    <div className="DirectorNotes">
                        <h3>My Notes</h3>
                        { editFormExpanded && (
                            <form onSubmit={ updateNotes } className="UpdateNotesForm">
                                <textarea value={editNotes} onChange={ (e) => { setEditNotes(e.target.value)} } />
                                <br />
                                <input type="submit" value="Save" />
                                <button className="CancelButton" onClick={ toggleEditFormExpanded }>cancel</button>
                            </form>
                        )}
                        <div className={notesExpanded ? "NotesExpanded" : "NotesCollapsed"}>
                            <div className="CollapsedParagraph">
                                <p>{ previewNotes() } <img className="ExpandIcon" onClick={ toggleEditFormExpanded } src={expandIcon} alt="expand icon"/></p>
                            </div>
                        </div>
                    </div>
                    <div className="DirectorLinks">
                        <h3>Articles + Videos</h3>
                        <ul>
                            { userLinks.map( (link, index) => {
                                return (
                                    <li key={index}>
                                        <a href={link.url} target="_blank" rel="noreferrer" >{link.text}</a>
                                        <button onClick={ (e) => {deleteLink(link.id)} } className="DeleteLinkButton"> X </button>
                                    </li>
                                )
                            })
                            }
                        </ul>
                        <button onClick={ toggleLinkFormExpanded }>Add Link</button>
                        { linkFormExpanded && (
                            <form className={"LinkForm" } onSubmit={ addLink }>
                                <label htmlFor="text">Text</label>
                                <input name="text" value={newLinkText} onChange={ (e) => setNewLinkText(e.target.value) } />
                                <br />
                                <label htmlFor="url">URL</label>
                                <input name="url" value={newLinkURL} onChange={ (e) => setNewLinkURL(e.target.value) } />
                                <br />
                                <input type="submit" value="Add Link" />
                                <button className="CancelButton" onClick={toggleLinkFormExpanded}>cancel</button>
                            </form>
                        )}
                    </div>
                </div>
                <div className="DirectorDisplayContainer">
                    { directedByOpen && (
                        <div className="DisplayDirectorMovies">
                            {
                                moviesDirected.map( (movie, index) => {
                                    return (
                                        <div className="CoreMovie" key={index}>
                                            <Link to={"/reviews/" + movie.review_id}><img src={movie.image_url} alt="" height="200px"/></Link>
                                            <div className="CoreMovieBody">
                                                <Link to={"/reviews/" + movie.review_id}><h5>{ movie.title }</h5></Link>
                                                <div className="LikedBy">
                                                    {(movie.director_fans.length > 0 || movie.critic_fans.length > 0) && <h6>Liked By:</h6>}
                                                    <ul>
                                                        { movie.director_fans.map( (directorFan, index) => (
                                                            <li key={ index }><Link to={ "/directors/" + directorFan.id } >{directorFan.name }</Link></li>
                                                        )) }
                                                        { movie.critic_fans.map( (critic, index) => (
                                                            <li key={ index }><Link to={ "/critics/" + critic.id }>{critic.name }</Link></li>
                                                        )) }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )}

                    { favoritesOpen && (
                        <div className="DisplayDirectorMovies">
                        {
                            favoriteMovies.map( (movie, index) => {
                                return (
                                    <div className="CoreMovie" key={index}>
                                        <Link to={"/reviews/" + movie.review_id}><img src={movie.image_url} alt="" height="200px"/></Link>
                                        <div className="CoreMovieBody">
                                            <Link to={"/reviews/" + movie.review_id}><h5>{ movie.title }</h5></Link>
                                            <div className="LikedBy">
                                                <h6>Liked By:</h6>
                                                <ul>
                                                    { movie.director_fans && movie.director_fans.map( (directorFan, index) => (
                                                        directorFan.id != id && <li key={ index }><Link to={ "/directors/" + directorFan.id } >{directorFan.name }</Link></li>
                                                    )) }
                                                    { movie.critic_fans && movie.critic_fans.map( (critic, index) => (
                                                        <li key={ index }><Link to={ "/critics/" + critic.id }>{critic.name }</Link></li>
                                                    )) }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Director
