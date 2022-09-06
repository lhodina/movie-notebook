console.log("hello from director.js script");

const removeButtons = document.querySelectorAll('.remove-btn');
const addDirectedButton = document.getElementById("add-directed-button");
const addFavoriteButton = document.getElementById("add-favorite-button");
const addDirectedForm = document.getElementById("add-directed-form");
const addFavoriteForm = document.getElementById("add-favorite-form");

const url = window.location.href;
const directorId = url.split("/")[4];

for (let button of removeButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const movieId = event.target.id;

        const res = await fetch(`/directors/${directorId}/favorites/${movieId}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.message === "Success") {
            const container = document.querySelector(`#movie-container-${movieId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}


addDirectedButton.addEventListener("click", async (event) => {
    console.log("where's me directeds?")
    addFavoriteForm.style.display = "none";

    addDirectedForm.removeAttribute("hidden");
    addDirectedForm.style.display = "block";
});


addFavoriteButton.addEventListener("click", async (event) => {
    console.log("where's me favorite?")
    addDirectedForm.style.display = "none";

    addFavoriteForm.removeAttribute("hidden");
    addFavoriteForm.style.display = "block";
});
