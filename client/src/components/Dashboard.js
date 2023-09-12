import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
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

    const removeFromDom = reviewId => {
        setReviews(reviews.filter(review => review.id !== reviewId));
    }

    const deleteReview = reviewId => {
        axios.delete("http://localhost:5000/reviews/delete/" + reviewId)
            .then(res => {
                removeFromDom(reviewId)
            })
            .catch(err => console.log(err));
    }

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
                <h2>Your Movies</h2>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Watched</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reviews.map( (review, index) => {
                                return (
                                    <tr className="review" key={index}>
                                        <td><img src={review.image_url} alt=""height="75px" width="50px"/></td>
                                        <td><Link to={ "/reviews/" + review.id }>{ review.title }</Link></td>
                                        <td>{ review.director_name}</td>
                                        <td>{ review.year }</td>
                                        <td>{ review.watched}</td>
                                        <td>{ review.rating}</td>
                                        <td><button className="btn btn-danger" onClick = { (e) => {deleteReview(review.id)} }>Delete</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                <Link to={"/reviews/add"}>review a movie</Link>
            </div>
        </>
    )
}

export default Dashboard;
