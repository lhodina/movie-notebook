import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import expandIcon from "../assets/expand-icon-small.png";

const Director = (props) => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [director, setDirector] = useState({});
    const [moviesDirected, setMoviesDirected] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [notes, setNotes] = useState("");
    const [favoritesOpen, setFavoritesOpen] = useState(true);
    const [directedByOpen, setDirectedByOpen] = useState(false);
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [editFormExpanded, setEditFormExpanded] = useState(false);


    const showFavorites = () => {
        setFavoritesOpen(true);
        setDirectedByOpen(false);

    }

    const showDirectedBy = () => {
        setDirectedByOpen(true);
        setFavoritesOpen(false);
    }

    const toggleNotesExpanded = () => {
        setNotesExpanded(!notesExpanded)
    }

    const toggleEditFormExpanded = () => {
        setEditFormExpanded(!editFormExpanded)
        setNotesExpanded(false);
    }

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

    const updateNotes = e => {
        e.preventDefault();
        toggleEditFormExpanded();
        axios.post('http://localhost:5000/favorite_directors/' + id + '/update', { "notes": notes })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    useEffect( () => {
        axios.get("http://localhost:5000/directors/" + id)
            .then( (res) => {
                setUserFirstName(res.data.user_first_name);
                setUserLastName(res.data.user_last_name);
                setDirector(res.data);
                setMoviesDirected(res.data.movies_directed);
                setFavoriteMovies(res.data.favorite_movies);
                setNotes(res.data.notes);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className="Container">
            <div className="Header">
                <Link to={ "/dashboard" } >back to dashboard</Link>
                <form className="SearchBar">
                    <input className="SearchInput" type="text" value="search movies and people"></input>
                </form>
                <div className="NavUser">
                    <h5>{userFirstName} {userLastName[0]}.</h5>
                    <Link to={ "/logout" }>log out</Link>
                </div>
            </div>
            <div className="DirectorProfile">
                <img src={director.image_url} height="200px" alt="" />
                <div className="ProfileContent">
                    <h1>{ director.name }</h1>
                    <div className="btn-group" role="group">
                        <button type="button" className={ favoritesOpen ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ showFavorites }>{director.name}'s Favorite Movies</button>
                        <button type="button" className={ directedByOpen ? "active btn btn-outline-danger" : "btn btn-outline-danger"} onClick={ showDirectedBy }>Movies Directed by {director.name}</button>
                    </div>
                { directedByOpen && (
                    <div>
                        <button type="button" className="AddDirectedButton">Add Movie</button>
                    </div>
                )}
                { favoritesOpen && (
                    <div>
                        <button type="button" className="AddFavoriteButton">Add Favorite</button>
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
                                    <textarea value={notes} onChange={ (e) => { setNotes(e.target.value)} } />
                                    <br />
                                    <button className="CancelButton" onClick={ toggleEditFormExpanded }>cancel</button>
                                    <input type="submit" value="Save" />
                            </form>
                            )}

                        <div className={notesExpanded ? "NotesExpanded" : "NotesCollapsed"}>
                            <div className="CollapsedParagraph">
                                <p>{ previewNotes() } <img onClick={ toggleNotesExpanded } src={expandIcon} alt="expand icon"/></p>
                            </div>
                            <button onClick={ toggleEditFormExpanded }>edit</button>
                        </div>
                    </div>
                    <div className="DirectorLinks">
                        <h3>Articles + Videos</h3>
                        <ul>
                            <Link><li>Cannes Interview</li></Link>
                            <Link><li>Article in Cahiers du Cinema</li></Link>
                            <Link><li>Charlie Rose Interview</li></Link>
                            <Link><li>Roger Ebert's Review of Fargo</li></Link>
                            <Link><li>92Y Conversation with Frances McDormand</li></Link>
                        </ul>
                        <Link>+ Add link</Link>
                    </div>
                </div>
                <div className="DirectorDisplayContainer">
                    { directedByOpen && (
                        <div className="DisplayDirectorMovies">
                            {
                                moviesDirected.map( (movie, index) => {
                                    return (
                                        <div className="CoreMovie" key={index}>
                                            <img src={movie.image_url} alt="" height="200px"/>
                                            <div className="CoreMovieBody">
                                                <Link><h5>{ movie.title }</h5></Link>
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
                                        <img src={movie.image_url} alt="" height="200px"/>
                                        <div className="CoreMovieBody">
                                            <Link><h5>{ movie.title }</h5></Link>
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
