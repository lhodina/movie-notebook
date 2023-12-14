import React, { useState } from 'react';
import { Link } from "react-router-dom";
import LogoutButton from './LogoutButton';

const Header = (props) => {
    const { user, favoriteDirectors, favoriteCritics } = props;

    const [directorsOpen, setDirectorsOpen] = useState(false);
    const [criticsOpen, setCriticsOpen] = useState(false);

    const toggleDirectors = () => {
        setDirectorsOpen(!directorsOpen);
    }

    const toggleCritics = () => {
        setCriticsOpen(!criticsOpen);
    }

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
                            favoriteDirectors.map( (director, index) => (
                                <Link to={ "/directors/" + director.id } className="NavDropdownListItem"><li key={index}>{director.name}</li></Link>
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
                            favoriteCritics.map( (critic, index) => (
                                <Link to={ "/critics/" + critic.id } className="NavDropdownListItem"><li key={index}>{critic.name}</li></Link>
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
            <form className="SearchBar">
                <input className="SearchInput" type="text" value="search my stuff" onChange={() => console.log("this search bar will eventually do something")}></input>
            </form>
            <LogoutButton />
        </div>
    )
}


export default Header;
