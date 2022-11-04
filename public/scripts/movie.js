
const form = document.getElementsByClassName("movie-edit-form")[0];
const linksForm = document.getElementsByClassName("links-form")[0];
console.log('linksForm:', linksForm)

let movieId;
if (form) movieId = form.id;
if (linksForm) movieId = linksForm.id.split("-")[2];

console.log("movieId:", movieId);


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
        watchedStatus: data.watchedStatus
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



linksForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Inside the submit event listener...")
    const formData = new FormData(linksForm);
    const entries = formData.entries();

    const data = {};
    for (let entry of entries) {
        data[entry[0]] = entry[1];
    }

    const body = {
        linkUrl: data.linkUrl,
        linkText: data.linkText
    };

    console.log('body:', body)

    await fetch(`http://localhost:8080/movies/${movieId}/links`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });

    await fetch(`http://localhost:8080/movies/${movieId}`, {
        method: "GET"
    });
});
