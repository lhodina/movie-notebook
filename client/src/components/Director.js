import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';


const Director = (props) => {
    const [director, setDirector] = useState({});
    const [moviesDirected, setMoviesDirected] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const { id } = useParams();

    useEffect( () => {
        axios.get("http://localhost:5000/directors/" + id)
            .then( (res) => {
                console.log(res.data);
                setDirector(res.data);
                setMoviesDirected(res.data.movies_directed);
                setFavoriteMovies(res.data.favorite_movies)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <div className="header">
                <h1>{director.name}</h1>
                <Link to={ "/dashboard" } >back to dashboard</Link>
            </div>
            {/* Need to add API call for this */}
            {/* <img src={director.image_url} height="300px" alt="" /> */}
            {/* Get from favorite_directors joined to query */}
            {/* <p>{director.notes}</p> */}

            <h2>Movies Directed by {director.name}</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                {
                    moviesDirected.map( (movie, index) => {
                        return (
                            <tr key={ index }>
                                <td><img src={movie.image_url} alt="" /></td>
                                <td>{ movie.title }</td>
                                <td>{movie.year}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>

            <h2>{director.name}'s Favorite Movies</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                {
                    favoriteMovies.map( (movie, index) => {
                        return (
                            <tr key={ index }>
                                <td><img src={movie.image_url} alt="" /></td>
                                
                                <td>{ movie.title }</td>
                                <td>{ movie.director_name}</td>
                                <td>{movie.year}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
    )

}

export default Director
