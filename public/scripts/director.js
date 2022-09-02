console.log("hello from director.js script");

const removeButtons = document.querySelectorAll('.remove-btn');

const url = window.location.href;
console.log("url:", url);
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
