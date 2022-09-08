console.log("Hello from the index.js script");


const collectionLinks = document.querySelectorAll('.collection-link');

let displayCollection = document.getElementsByClassName("recommended")[0];
if (displayCollection) {
    displayCollection.setAttribute("class", "displayCollection");
    displayCollection.removeAttribute("hidden");
    displayCollection.style.display = "block";

    for (let link of collectionLinks) {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            const collectionIdString = event.target.id;
            const collectionId = collectionIdString.split('-')[1];
            let previousDisplay = document.getElementsByClassName('displayCollection')[0];

            if (previousDisplay) {
                previousDisplay.classList.remove("displayCollection");
                previousDisplay.style.display = "none";
            }

            displayCollection = document.getElementById(`collection-container-${collectionId}`);
            displayCollection.setAttribute("class", "displayCollection");
            displayCollection.removeAttribute("hidden");
            displayCollection.style.display = "block";
        });
    }
} else {
    console.log("Nothing added yet, let's get started!")
}
