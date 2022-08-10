const deleteButtons = document.querySelectorAll('.delete-btn');

for (let button of deleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const directorId = event.target.id;
        console.log("directorId:", directorId);
        const res = await fetch(`/directors/${directorId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#director-container-${directorId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}
