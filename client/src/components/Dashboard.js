import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import '../App.css';

const Dashboard = () => {
    const [user, setUser] = useState("");
    const [favoriteDirectors, setFavoriteDirectors] = useState([]);
    const [favoriteCritics, setFavoriteCritics] = useState([]);
    const [collections, setCollections] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/dashboard")
            .then(res => {
                setUser(res.data);
                setFavoriteDirectors(res.data.favorite_directors);
                setFavoriteCritics(res.data.favorite_critics);
                setCollections(res.data.collections);
                setReviews(res.data.reviews);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <>
            <h1>Welcome, {user.first_name}</h1>
            <Link to={ "/logout" }>log out</Link>

            <h2>Your Stuff</h2>
            <div className="favoritedirectors">
                <h3>Favorite Directors</h3>
                {
                    favoriteDirectors.map( (director, index) => {
                        return (
                            <div className="favoritedirector" key={index}>
                                <Link to={ "/directors/" + director.id }>{ director.name }</Link>
                            </div>
                        )
                    })
                }
                <Link to={"/favoritedirectors/add"}>add a director</Link>
            </div>

            <div className="favoritecritics">
                <h3>Favorite Critics</h3>
                {
                    favoriteCritics.map( (critic, index) => {
                        return (
                            <div className="favoritecritic" key={index}>
                                <Link to={ "/critics/" + critic.id }>{ critic.name }</Link>
                            </div>
                        )
                    })
                }
                <Link to={"/favoritecritics/add"}>add a critic</Link>
            </div>

            <div className="collections">
                <h3>Your Collections</h3>
                {
                    collections.map( (collection, index) => {
                        return (
                            <div className="collection" key={index}>
                                <Link to={ "/collections/" + collection.id }>{ collection.name }</Link>
                            </div>
                        )
                    })
                }
                <Link to={"/collections/add"}>add a collection</Link>
            </div>

            <div className="reviews">
                <h3>Your Movies</h3>
                {
                    reviews.map( (review, index) => {
                        return (
                            <div className="review" key={index}>
                                <Link to={ "/reviews/" + review.id }>{ review.title }</Link>
                            </div>
                        )
                    })
                }
                <Link to={"/reviews/add"}>add a movie</Link>
            </div>

            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Movies</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Directors</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Critics</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2>Picks For You</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Liked By</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>La Dolce Vita</td>
                            <td>Federico Fellini</td>
                            <td>
                                <p>Greta Gerwig</p>
                                <p>Noah Baumbach</p>
                                <p>A.O. Scott</p>
                            </td>
                        </tr>
                        <tr>
                            <td>The Goodfellah</td>
                            <td>Francis Ford Scorcese</td>
                            <td>
                                <p>Roger Ebert</p>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Dashboard;
