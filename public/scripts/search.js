console.log("Hello from the search.js script");

const searchMovies = document.getElementsByClassName("search-movies");
let location;
if (searchMovies.length) {
    location = searchMovies[0].id;
    const searchBarTwo = document.getElementById("search-bar-2");
    const searchResultsContainerTwo = document.getElementById("search-results-container-2");
    const searchResultsListTwo = document.getElementById("search-results-list-2");
    searchResultsContainerTwo.style.display = "none";

    searchBarTwo.addEventListener("input", async (event) => {
        event.preventDefault();
        const value = event.target.value.toLowerCase();

        if (value) {
            const res = await fetch(`/search/${value}/${location}`, {
                method: "GET"
            });

            const results = await res.json();

            console.log("results:", results);


            if (results.movieResults) {
                const movieResults = results.movieResults;
                for (let result of movieResults) {
                    searchResultsListTwo.innerHTML += `<li><a href="/movies/${result.id}"}>${result.title}</a></li>`;
                }
            }

            if (results.directorResults) {
                const directorResults = results.directorResults;
                for (let result of directorResults) {
                    searchResultsListTwo.innerHTML += `<li><a href="/directors/${result.id}"}>${result.name}</a></li>`;
                }
            }

            if (results.criticResults) {
                const criticResults = results.criticResults;
                for (let result of criticResults) {
                    searchResultsListTwo.innerHTML += `<li><a href="/critics/${result.id}"}>${result.name}</a></li>`;
                }
            }

            searchResultsContainerTwo.style.display = "block";
        } else {
            searchResultsListTwo.innerHTML = "";
            searchResultsContainerTwo.style.display = "none";
        }
    });

    const searchBar = document.getElementById("search-bar");
    const searchResultsContainer = document.getElementById("search-results-container");
    const searchResultsList = document.getElementById("search-results-list");

    searchResultsContainer.style.display = "none";

    searchBar.addEventListener("input", async (event) => {
        event.preventDefault();
        const value = event.target.value.toLowerCase();

        if (value) {
            const res = await fetch(`/search/${value}`, {
                method: "GET"
            });

            const results = await res.json();
            console.log("results:", results);
            const movieResults = results.movieResults;
            for (let result of movieResults) {
                searchResultsList.innerHTML += `<li><a href="/movies/${result.id}"}>${result.title}</a></li>`;
            }

            const directorResults = results.directorResults;
            for (let result of directorResults) {
                searchResultsList.innerHTML += `<li><a href="/directors/${result.id}"}>${result.name}</a></li>`;
            }

            const criticResults = results.criticResults;
            for (let result of criticResults) {
                searchResultsList.innerHTML += `<li><a href="/critics/${result.id}"}>${result.name}</a></li>`;
            }

            // searchResultsList.innerHTML = "";
            searchResultsContainer.style.display = "block";
        } else {
            searchResultsList.innerHTML = "";
            searchResultsContainer.style.display = "none";
        }
    });
} else {
    const searchBar = document.getElementById("search-bar");
    const searchResultsContainer = document.getElementById("search-results-container");
    const searchResultsList = document.getElementById("search-results-list");

    searchResultsContainer.style.display = "none";

    searchBar.addEventListener("input", async (event) => {
        event.preventDefault();
        const value = event.target.value.toLowerCase();

        if (value) {
            const res = await fetch(`/search/${value}`, {
                method: "GET"
            });

            const results = await res.json();
            const movieResults = results.movieResults;
            const directorResults = results.directorResults;
            const criticResults = results.criticResults;
            const collectionResults = results.collectionResults;

            searchResultsList.innerHTML = "";

            for (let result of movieResults) {
                searchResultsList.innerHTML += `<li><a href="/movies/${result.id}"}>${result.title}</a></li>`;
            }

            for (let result of directorResults) {
                searchResultsList.innerHTML += `<li><a href="/directors/${result.id}"}>${result.name}</a></li>`;
            }

            for (let result of criticResults) {
                searchResultsList.innerHTML += `<li><a href="/critics/${result.id}"}>${result.name}</a></li>`;
            }

            for (let result of collectionResults) {
                searchResultsList.innerHTML += `<li><a href="/collections/${result.id}"}>${result.name}</a></li>`;
            }

            searchResultsContainer.style.display = "block";
        } else {
            searchResultsList.innerHTML = "";
            searchResultsContainer.style.display = "none";
        }
    });
}
