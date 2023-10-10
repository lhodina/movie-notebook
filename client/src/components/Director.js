import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";

const Director = (props) => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [director, setDirector] = useState({});
    const [moviesDirected, setMoviesDirected] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const { id } = useParams();

    useEffect( () => {
        axios.get("http://localhost:5000/directors/" + id)
            .then( (res) => {
                setUserFirstName(res.data.user_first_name);
                setUserLastName(res.data.user_last_name);
                setDirector(res.data);
                setMoviesDirected(res.data.movies_directed);
                setFavoriteMovies(res.data.favorite_movies)
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
                    <div className="ButtonBar">
                        <button>{director.name}'s Favorite Movies</button>
                        <button>Movies Directed by {director.name}</button>
                    </div>
                </div>
            </div>
            <div className="UserContent">
                <div className="DirectorNotes">
                    <h3>My Notes</h3>
                    <p>Joel and Ethan Coen, more than any living directors, know how to make Steve Buscemi's face sing sad sad songs to make us laugh til we cry til we die (laughing). They know how to make John Goodman roll over us on the floor laughing til all our bones are crushed and also our souls under the weight of despair. And they know how to get George Clooney to show the world how dumb he really is. If I ever kill myself while watching a movie, it will be a Coen brothers movie.</p><Link>(edit)</Link>
                </div>
                <div className="DirectorLinks">
                    <h3>Articles and Videos</h3>
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
        </div>
    )

}

export default Director
