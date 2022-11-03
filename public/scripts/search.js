console.log("Hello from the search.js script");

const createNewMovie = document.getElementById("create-new-movie");

const searchBar = document.getElementById("search-bar");
const searchResultsContainer = document.getElementById("search-results-container");
const searchResultsList = document.getElementById("search-results-list");

if (searchResultsContainer) {
    searchResultsContainer.style.display = "none";
}

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

        if (searchResultsList.innerHTML) {
            searchResultsContainer.style.display = "block";
        }
    } else {
        searchResultsList.innerHTML = "";
        searchResultsContainer.style.display = "none";
    }
});
