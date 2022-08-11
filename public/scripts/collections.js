const collectionDeleteButtons = document.querySelectorAll('.delete-collection');

for (let button of collectionDeleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const collectionId = event.target.id;
        console.log("collectionId:", collectionId);
        const res = await fetch(`/collections/${collectionId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#collection-container-${collectionId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}
