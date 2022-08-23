const collectionDeleteButtons = document.querySelectorAll('.delete-collection');

for (let button of collectionDeleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const collectionId = event.target.id;

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
