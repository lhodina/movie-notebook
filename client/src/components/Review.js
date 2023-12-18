import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import expandIcon from "../assets/expand-icon-small.png";
import Header from './Header';
import UpdateReviewForm from './UpdateReviewForm';
import AddFanForm from './AddFanForm';

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
        </div>
    }
}

const Review = (props) => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [review, setReview] = useState({});
    const [rating, setRating] = useState(0);
    const [watched, setWatched] = useState(0);
    const [criticFans, setCriticFans] = useState([]);
    const [directorFans, setDirectorFans] = useState([]);
    const [fanFormOpen, setFanFormOpen] = useState(false);
    const [grayout, setGrayout] = useState(false);
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [editNotesFormExpanded, setEditNotesFormExpanded] = useState(false);
    const [notes, setNotes] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [userLinks, setUserLinks] = useState([]);
    const [linkFormExpanded, setLinkFormExpanded] = useState(false);
    const [newLinkText, setNewLinkText] = useState("");
    const [newLinkURL, setNewLinkURL] = useState("");
    const [updateReviewFormOpen, setUpdateReviewFormOpen] = useState(false);
    const [userFavoriteDirectors, setUserFavoriteDirectors] = useState([]);
    const [userFavoriteCritics, setUserFavoriteCritics] = useState([]);
    const [reviews, setReviews] = useState([]);

    const navigate = useNavigate();

    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
    }

    const toggleEditNotesFormExpanded = () => {
        setEditNotesFormExpanded(!editNotesFormExpanded);
        setNotesExpanded(false);
        toggleGrayout();
    }

    const toggleLinkFormExpanded = () => {
        setLinkFormExpanded(!linkFormExpanded);
        toggleGrayout();
    }

    const toggleReviewForm = () => {
        setUpdateReviewFormOpen(!updateReviewFormOpen);
        toggleGrayout();
    }

    const previewNotes = () => {
        let notesArr = notes.split(" ");
        if (notesArr.length > 30 && notesExpanded === false) {
            let trimmed = notesArr.slice(0, 30);
            return `${trimmed.join(" ")}...`;
        } else {
            return notes;
        }
    }

    const updateNotes = e => {
        e.preventDefault();
        toggleEditNotesFormExpanded();
        setNotes(editNotes);
        axios.post('http://localhost:5000/reviews/' + id + '/notes', { "notes": editNotes }, { withCredentials: true })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    const addLink = e => {
        e.preventDefault();
        axios.post('http://localhost:5000/movies/' + review.movie_id + '/links', {
            "text": newLinkText,
            "url": newLinkURL,
            "user_id": user.id,
            "movie_id": review.movie_id
        }, { withCredentials: true })
        .then(res => {
            setUserLinks([...userLinks, {
                "id": res["data"]["id"],
                "text": newLinkText,
                "url": newLinkURL,
                "user_id": user.id,
                "movie_id": review.movie_id
            }])
        })
        .catch(err => console.log(err));
        toggleLinkFormExpanded();
    }

    const removeLinkFromDom = linkId => {
        setUserLinks(userLinks.filter(link => link.id !== linkId));
    }

    const deleteLink = linkId => {
        axios.post(`http://localhost:5000/movie_links/${linkId}/delete`, { withCredentials: true })
            .then(res => {
                removeLinkFromDom(linkId);
            })
            .catch(err => console.log(err));
    }


    const deleteReview = reviewId => {
        axios.delete("http://localhost:5000/reviews/delete/" + reviewId, { withCredentials: true })
            .then(res => {
                navigate("/dashboard");
            })
            .catch(err => console.log(err));
    }


    useEffect( () => {
        axios.get("http://localhost:5000/reviews/" + id, { withCredentials: true })
            .then( (res) => {
                console.log("reviews res: ", res);
                setUser({
                    "id": res.data.user_id,
                    "first_name": res.data.user_first_name,
                    "last_name": res.data.user_last_name
                });
                setReview(res.data);
                setRating(res.data.rating);
                setWatched(res.data.watched);
                setNotes(res.data.notes);
                setEditNotes(res.data.notes);
                setCriticFans(res.data.critic_fans);
                setDirectorFans(res.data.director_fans);
                setUserLinks(res.data.user_links);
                setUserFavoriteDirectors(res.data.user_favorite_directors);
                setUserFavoriteCritics(res.data.user_favorite_critics);
                setReviews(res.data.reviews);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id]);


    const stars = Array(5).fill(0);

    return (
        <div className="Container">
            { grayout && (
                <div className="Grayout"></div>
            )}
            <Header user={user} userFavoriteDirectors={userFavoriteDirectors} userFavoriteCritics={userFavoriteCritics} reviews={reviews} />
            <div className="ReviewProfile">
                <img src={review.image_url} height="250px" alt="movie poster" />
                <div className="ReviewDetails">
                    { fanFormOpen && (
                        <div>
                            <AddFanForm movie_id={review.movie_id} toggleForm={toggleFanForm} criticFans={criticFans} setCriticFans={setCriticFans} directorFans={directorFans} setDirectorFans={setDirectorFans}/>
                        </div>
                    )}
                    <h1>{review.title}</h1>
                    <p>Directed by <Link to={'/directors/' + review.directed_by_id} >{ review.director_name}</Link></p>
                    <p>Released { review.year } </p>
                    <p style={styles.stars}>
                        <span className="Rating" >My rating:</span>
                        {stars.map((_, index) => {
                            return (
                                <FaStar key={index} size={14} style={{
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                                color={ (rating) > index ? colors.yellow : colors.grey }
                                />
                            )
                        })}
                    </p>
                    <p>Watched: {watched == 1 ? "Yes" : "No"}</p>
                    <button onClick={ toggleReviewForm }>edit</button>

                    { updateReviewFormOpen && (
                        <div className="UpdateReviewForm">
                            <UpdateReviewForm user={user} rating={rating} review={review} setReview={setReview} setRating={setRating} watched={watched} setWatched={setWatched} toggleReviewForm={toggleReviewForm} />
                        </div>

                    )}
                </div>
            </div>
            <div className="ReviewMain">
                <div className="ReviewNotes">
                    <h2>My Notes</h2>
                    { editNotesFormExpanded && (
                        <form onSubmit={ updateNotes } className="UpdateNotesForm">
                            <textarea value={editNotes} onChange={ (e) => { setEditNotes(e.target.value)} } />
                            <br />
                            <input type="submit" value="Save" />
                            <button className="CancelButton" onClick={ toggleEditNotesFormExpanded }>cancel</button>
                        </form>
                    )}
                    <div className={notesExpanded ? "NotesExpanded" : "NotesCollapsed"}>
                        <div className="CollapsedParagraph">
                            <p>{ previewNotes() } <img className="ExpandIcon" onClick={ toggleEditNotesFormExpanded } src={expandIcon} alt="expand icon"/></p>
                        </div>
                    </div>
                </div>
                <div className="ReviewLinks">
                    <h2>Articles + Videos</h2>
                    <ul>
                        { userLinks.map( (link, index) => {
                            return (
                                <li key={index}>
                                    <a href={link.url} target="_blank" rel="noreferrer">{link.text}</a>
                                    <button className="DeleteLinkButton" onClick={(e) => {deleteLink(link.id)} }>X</button>
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
                <div className="LikedByContainer">
                    <div className="ReviewLikedBy">
                        <h2>Liked by:</h2>
                        <ul>
                            { criticFans.map( (critic, index) => (
                                <li key={ index }><Link to={ "/critics/" + critic.id }>{critic.name }</Link></li>
                            )) }
                            { directorFans.map( (directorFan, index) => (
                                <li key={ index }><Link to={ "/directors/" + directorFan.id} >{directorFan.name }</Link></li>
                            )) }
                        </ul>
                        { placeholder(review) }
                        <button onClick={toggleFanForm}>Add a fan</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Review;
