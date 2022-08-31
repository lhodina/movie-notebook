const collectionDeleteButtons = document.querySelectorAll('.delete-collection');
const removeButtons = document.querySelectorAll('.remove-btn');


for (let button of collectionDeleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const collectionId = event.target.id;
        const listLink = document.getElementById(`collection-${collectionId}-link`);
        listLink.parentElement.remove();

        const res = await fetch(`/collections/${collectionId}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.message === "Success") {
            const container = document.querySelector(`#collection-container-${collectionId}`);
            container.remove();

        } else {
            console.log("Failed to get data.");
        }
    });
}


for (let button of removeButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const displayedCollection = document.querySelectorAll('.displayCollection')[0];
        console.log("*****displayedCollection:", displayedCollection);

        const collectionId = displayedCollection.id.split("-")[2];
        // console.log("*****collectionId:", collectionId);

        const movieId = event.target.id;
        // console.log("*****movieId:", movieId);

        const res = await fetch(`/collections/${collectionId}/${movieId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("*****data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#movie-container-${movieId}`);
            container.remove();

        } else {
            console.log("Failed to get data.");
        }
    });
}
