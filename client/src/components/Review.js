import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import expandIcon from "../assets/expand-icon-small.png";


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
    const { user } = props;
    const { id } = useParams();
    const [review, setReview] = useState({});
    const [criticFans, setCriticFans] = useState([]);
    const [directorFans, setDirectorFans] = useState([]);
    const [fanFormOpen, setFanFormOpen] = useState(false);
    const [grayout, setGrayout] = useState(false);
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [editFormExpanded, setEditFormExpanded] = useState(false);
    const [notes, setNotes] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [userLinks, setUserLinks] = useState([]);
    const [linkFormExpanded, setLinkFormExpanded] = useState(false);
    const [newLinkText, setNewLinkText] = useState("");
    const [newLinkURL, setNewLinkURL] = useState("");


    const toggleGrayout = () => {
        setGrayout(!grayout);
    }

    const toggleFanForm = () => {
        setFanFormOpen(!fanFormOpen);
        toggleGrayout();
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
        setNotes(editNotes);
        axios.post('http://localhost:5000/reviews/' + id + '/update', { "notes": editNotes })
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

    useEffect( () => {
        axios.get("http://localhost:5000/reviews/" + id)
            .then( (res) => {
                setReview(res.data);
                setNotes(res.data.notes);
                setEditNotes(res.data.notes);
                setCriticFans(res.data.critic_fans);
                setDirectorFans(res.data.director_fans);
                setUserLinks(res.data.links);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);


    const stars = Array(5).fill(0);

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

            <div className="ReviewContent">
                <img src={review.image_url} height="200px" alt="" />
                <div className="ReviewDetails">
                    { fanFormOpen && (
                        <div>
                            <AddFanForm movie_id={review.movie_id} toggleForm={toggleFanForm} />
                        </div>
                    )}
                    <h1>{review.title}</h1>
                    <p>Directed by <Link to={'/directors/' + review.directed_by_id} >{ review.director_name}</Link></p>
                    <p>Released { review.year } </p>
                    <p>My notes:</p>
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
                    <p style={styles.stars}>
                        <span className="Rating" >My rating:</span>
                        {stars.map((_, index) => {
                            return (
                                <FaStar key={index} size={14} style={{
                                    marginRight: 10,
                                    cursor: "pointer"
                                }}
                                color={ (review.rating) > index ? colors.yellow : colors.grey }
                                />
                            )
                        })}
                    </p>
                    <p>Watched: {review.watched ? "Yes" : "No"}</p>
                    <p><Link to={ "/reviews/" + id + "/update" }>edit</Link></p>
                    <h2>Liked by:</h2>
                    <ul>
                        { criticFans.map( (critic, index) => (
                            <Link to={ "/critics/" + critic.id }  key={ index }><li>{critic.name }</li></Link>
                        )) }
                        { directorFans.map( (director, index) => (
                            <Link to={ "/directors/" + director.id} key={ index }><li>{director.name }</li></Link>
                        )) }
                    </ul>
                    { placeholder(review) }
                    <button onClick={toggleFanForm}>Add a fan</button>
                </div>
            </div>
        </div>
    )
}

export default Review;
