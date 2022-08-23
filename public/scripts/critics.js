
const deleteButtons = document.querySelectorAll('.delete-btn');

for (let button of deleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const criticId = event.target.id;
        const res = await fetch(`/critics/${criticId}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.message === "Success") {
            const container = document.querySelector(`#critic-container-${criticId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}
