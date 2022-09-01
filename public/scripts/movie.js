
const form = document.getElementsByClassName("movie-edit-form")[0];
console.log("form:", form);
const movieId = form.id;
console.log("movieId:", movieId);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const entries = formData.entries();

    const data = {};
    for (let entry of entries) {
        console.log("entry:", entry);
        data[entry[0]] = entry[1];
    }

    const body = {
        title: data.title,
        directorName: data.directorName,
        yearReleased: data.yearReleased,
        imageLink: data.imageLink,
        starRating: data.starRating,
        review: data.review,
        collectionList: data.collectionList,
        watchedStatus: data.watchedStatus
    }


    console.log("body:", body);

    const res = await fetch(`http://localhost:8080/movies/${movieId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });

    window.location = "/";
});
