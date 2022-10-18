
const form = document.getElementsByClassName("movie-edit-form")[0];
const movieId = form.id;

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entries = formData.entries();

    const data = {};
    for (let entry of entries) {
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
        watchedStatus: data.watchedStatus,
        linkUrl: data.linkUrl,
        linkText: data.linkText
    };

    const res = await fetch(`http://localhost:8080/movies/${movieId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });

    window.location = "/";
});
