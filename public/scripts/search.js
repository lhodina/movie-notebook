console.log("Hello from the search.js script");

const searchForm = document.getElementById("search-form");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const searchResultsList = document.getElementById("search-results-list");


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
    } else {
        searchResultsList.innerHTML = "";
    }
});
