import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import expandIcon from "../assets/expand-icon-small.png";
import ReviewForm from './ReviewForm';

const Critic = (props) => {
    const { user } = props;
    const [currentCritic, setCurrentCritic] = useState({});
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [notes, setNotes] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [editFormExpanded, setEditFormExpanded] = useState(false);
    const [userLinks, setUserLinks] = useState([]);
    const [linkFormExpanded, setLinkFormExpanded] = useState(false);
    const [newLinkText, setNewLinkText] = useState("");
    const [newLinkURL, setNewLinkURL] = useState("");
    const [favoriteMovieFormOpen, setFavoriteMovieFormOpen] = useState(false);
    const [grayout, setGrayout] = useState(false);

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
        axios.get("http://localhost:5000/critics/" + id)
            .then( (res) => {
                setCurrentCritic(res.data);
                setFavoriteMovies(res.data.favorite_movies);
                setNotes(res.data.notes);
                setEditNotes(res.data.notes);
                setUserLinks(res.data.user_links);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id])

    const toggleEditFormExpanded = () => {
        setEditFormExpanded(!editFormExpanded);
        setNotesExpanded(false);
        toggleGrayout();
    }

    const toggleLinkFormExpanded = () => {
        setLinkFormExpanded(!linkFormExpanded);
        toggleGrayout();
    }

    const toggleFavoriteMovieForm = () => {
        setFavoriteMovieFormOpen(!favoriteMovieFormOpen);
        toggleGrayout();
    }

    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const updateCriticNotes = e => {
        e.preventDefault();
        toggleEditFormExpanded();
        setNotes(editNotes);
        axios.post('http://localhost:5000/favorite_critics/' + id + '/update', { "notes": editNotes })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    const addCriticLink = e => {
        e.preventDefault();
        axios.post('http://localhost:5000/critics/' + id + '/links', {
            "text": newLinkText,
            "url": newLinkURL,
            "user_id": user.id,
            "critic_id": id
        }).then((res) => {
            setUserLinks([...userLinks, {
                "id": res["data"]["id"],
                "text": newLinkText,
                "url": newLinkURL,
                "user_id": user.id,
                "critic_id": id
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
        axios.post(`http://localhost:5000/critic_links/${linkId}/delete`)
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
            <div className="Header">
                <Link to={ "/dashboard" } >back to dashboard</Link>
                <form className="SearchBar">
                </form>
                <div className="NavUser">
                    <h5>{user.first_name} {user.last_name[0]}.</h5>
                    <Link to={ "/logout" }>log out</Link>
                </div>
            </div>
            <div className="CriticProfile">
                { favoriteMovieFormOpen && (
                    <div className="FavoriteMovieForm">
                        <ReviewForm user={user} location="favoriteMovies" currentCritic={currentCritic} favoriteMovies={favoriteMovies} setFavoriteMovies={setFavoriteMovies} toggleForm={toggleFavoriteMovieForm} />
                    </div>
                )}
                <div className="ProfileContent">
                    <h1>{ currentCritic.name }</h1>
                    <div>
                        <button type="button" className="AddFavoriteButton" onClick={toggleFavoriteMovieForm}>Add Favorite</button>
                    </div>
                </div>
            </div>
            <div className="CriticMain">
                <div className="UserContent">
                    <div className="CriticNotes">
                        <h3>My Notes</h3>
                            { editFormExpanded && (
                                <form onSubmit={ updateCriticNotes } className="UpdateNotesForm">
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
                    <div className="CriticLinks">
                        <h3>Articles + Videos</h3>
                        <ul>
                            { userLinks.map( (link, index) => {
                                return (
                                    <li key={index}><a href={link.url} target="_blank" rel="noreferrer" >{link.text}</a><button onClick={ (e) => {deleteLink(link.id)} } className="DeleteLinkButton"> X </button></li>
                                )
                            })
                            }
                        </ul>
                        <button onClick={ toggleLinkFormExpanded }>Add Link</button>
                        { linkFormExpanded && (
                            <form className={"LinkForm" } onSubmit={ addCriticLink }>
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
                <div className="CriticDisplayContainer">
                    <div className="DisplayCriticMovies">
                        {
                            favoriteMovies.map( (movie, index) => {
                                return (
                                    <div className="CoreMovie" key={index}>
                                        <Link to={"/reviews/" + movie.review_id}><img src={movie.image_url} alt="movie poster" height="200px"/></Link>
                                        <div className="CoreMovieBody">
                                            <Link to={"/reviews/" + movie.review_id}><h5>{ movie.title }</h5></Link>
                                            <div className="LikedBy">
                                            {(movie.director_fans.length > 0 || movie.critic_fans.length > 0) && <h6>Liked By:</h6>}
                                                <ul>
                                                    { movie.director_fans.map( (directorFan, index) => (
                                                        <li key={ index }><Link to={ "/directors/" + directorFan.id } >{directorFan.name }</Link></li>
                                                    )) }
                                                    { movie.critic_fans.map( (critic, index) => (
                                                        critic.id != id && <li key={ index }><Link to={ "/critics/" + critic.id }>{critic.name }</Link></li>
                                                    )) }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Critic
