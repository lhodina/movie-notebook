console.log("Hello from the movies.js script");
const deleteButtons = document.querySelectorAll('.delete-btn');
const removeButtons = document.querySelectorAll('.remove-btn');

for (let button of deleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const movieId = event.target.id;
        const res = await fetch(`/movies/${movieId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#movie-container-${movieId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}


for (let button of removeButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const movieId = event.target.id;
        const res = await fetch(`/movies/${movieId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#movie-container-${movieId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}
