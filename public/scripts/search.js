// const { search } = require("../../routes");

console.log("Hello from the search.js script");

const searchForm = document.getElementById("search-form");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const searchResultsList = document.getElementById("search-results-list");


searchBar.addEventListener("input", async (event) => {
    event.preventDefault();
    const value = event.target.value.toLowerCase();

    if (value) {
        console.log("value:", value);

        const res = await fetch(`/search/${value}`, {
            method: "GET"
        });

        const results = await res.json();
        const movieResults = results.movieResults;
        const directorResults = results.directorResults;
        const criticResults = results.criticResults;
        const collectionResults = results.collectionResults;
        console.log("movieResults:", movieResults);
        console.log("directorResults:", directorResults);
        console.log("criticResults:", criticResults);
        console.log("collectionResults:", collectionResults);
        searchResultsList.innerHTML = "";

        for (let result of movieResults) {
            searchResultsList.innerHTML += `<li>${result.title}</li>`;
        }

        for (let result of directorResults) {
            searchResultsList.innerHTML += `<li>${result.name}</li>`;
        }

        for (let result of criticResults) {
            searchResultsList.innerHTML += `<li>${result.name}</li>`;
        }

        for (let result of collectionResults) {
            searchResultsList.innerHTML += `<li>${result.name}</li>`;
        }
    } else {
        searchResultsList.innerHTML = "";
    }
});
