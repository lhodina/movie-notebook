console.log("hello from add-new-movie.js");

const sectionsToHide = document.getElementsByClassName("add-new-movie");

for (let section of sectionsToHide) {
    section.style.display = "none";
}

const dropdown = document.getElementById("create-new-movie");

dropdown.addEventListener("click", async (event) => {
    event.preventDefault();

    for (let section of sectionsToHide) {
        if (section.style.display === "block") {
            section.style.display = "none";
        } else {
            section.style.display = "block"
        }
    }
});
