import React, { useState } from 'react';
import { Link } from "react-router-dom";
import LogoutButton from './LogoutButton';

const Header = (props) => {
    const { user, userFavoriteDirectors, userFavoriteCritics, reviews } = props;
    const [directorsOpen, setDirectorsOpen] = useState(false);
    const [criticsOpen, setCriticsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const toggleDirectors = () => {
        setDirectorsOpen(!directorsOpen);
    }

    const toggleCritics = () => {
        setCriticsOpen(!criticsOpen);
    }

    const getSearchResults = (e) => {
        setQuery(e.target.value);
        console.log("e.target.value: ", e.target.value);
        console.log("query:", query)
        for (let review of reviews) {
            if (review.title.toLowerCase().includes(query)) {
                console.log("getSearchResults review: ", review.title)
                setSearchResults([...searchResults, review]);
            }
        }
    };

    return (
        <div className="Header">
            <h4>Welcome, {user.first_name}</h4>
            <div className="NavMenuItem" onMouseEnter={ toggleDirectors } onMouseLeave={ toggleDirectors } >
                <h5>My Directors</h5>
                { directorsOpen && (
                    <div className="NavDropdown">
                        <Link to={"/favorite_directors/add"}> + Add Favorite Director</Link>
                        <ul className="NavDropdownList" >
                        {
                            userFavoriteDirectors.map( (director, index) => (
                                <Link key={index} to={ "/directors/" + director.id } className="NavDropdownListItem"><li>{director.name}</li></Link>
                            ))
                        }
                        </ul>
                    </div>
                )}
            </div>
            <div className="NavMenuItem" onMouseEnter={ toggleCritics } onMouseLeave={ toggleCritics }>
                <h5>My Critics</h5>
                { criticsOpen && (
                    <div className="NavDropdown">
                        <Link to={"/favorite_critics/add"}> + Add Favorite Critic</Link>
                        <ul className="NavDropdownList" >
                        {
                            userFavoriteCritics.map( (critic, index) => (
                                <Link key={index} to={ "/critics/" + critic.id } className="NavDropdownListItem"><li>{critic.name}</li></Link>
                            ))
                        }
                        </ul>
                    </div>
                )}
            </div>
            {/* <div className="NavMenuItem" onMouseEnter={ toggleCollections } onMouseLeave={ toggleCollections }>
                <h5>Collections</h5>
                { collectionsOpen && (
                    <div className="NavDropdown">
                        <Link to={"/collections/add"}> + Add Collection</Link>
                        <ul className="NavDropdownList" >
                        {
                            collections.map( (collection, index) => (
                                <Link to={ "/collections/" + collection.id } className="NavDropdownListItem"><li key={index}>{collection.name}</li></Link>
                            ))
                        }
                        </ul>
                    </div>
                )}
            </div> */}

            <Link to={"/reviews/add"}><button className="btn btn-danger">+ Review a Movie</button></Link>
            <div>
                <input type="search" placeholder="search my stuff" value={query} onChange={getSearchResults} />
                <p>Query: {query}</p>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}>{result.title}</li>
                    ))}
                </ul>
            </div>
            <Link to={"/dashboard"}>back to dashboard</Link>
            <LogoutButton />
        </div>
    )
}


export default Header;
