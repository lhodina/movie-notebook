import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import expandIcon from "../assets/expand-icon-small.png";
import ReviewForm from './ReviewForm';
import AddFanForm from './AddFanForm'


const Director = (props) => {
    const { user } = props;
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

    const { id } = useParams();

    const previewNotes = () => {
        console.log("notes: ", notes);
        let notesArr = notes.split(" ");
        console.log("notesArr: ", notesArr);
        if (notesArr.length > 30 && notesExpanded === false) {
            let trimmed = notesArr.slice(0, 30);
            return `${trimmed.join(" ")}...`;
        } else {
            return notes;
        }
    }

    useEffect( () => {
        axios.get("http://localhost:5000/directors/" + id)
            .then( (res) => {
                setCurrentDirector(res.data);
                setMoviesDirected(res.data.movies_directed);
                setFavoriteMovies(res.data.favorite_movies);
                setNotes(res.data.notes);
                setEditNotes(res.data.notes);
                setUserLinks(res.data.links);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

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

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
    }

    const updateNotes = e => {
        e.preventDefault();
        toggleEditFormExpanded();
        setNotes(editNotes);
        axios.post('http://localhost:5000/favorite_directors/' + id + '/update', { "notes": editNotes })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    // Replace hardcoded user id
    const addLink = e => {
        e.preventDefault();
        axios.post('http://localhost:5000/directors/' + id + '/links', {
            "text": newLinkText,
            "url": newLinkURL,
            "user_id": user.id,
            "director_id": id
        }).then((res) => {
            setUserLinks([...userLinks, {
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

    return (
        <div className="Container">
            { grayout && (
                <div className="Grayout"></div>
            )}
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
            <div className="DirectorProfile">
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
                                    <a href={link.url} target="_blank" rel="noreferrer" key={index}><li>{link.text}</li></a>
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
                                                    <h6>Liked By:</h6>
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
