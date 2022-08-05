console.log("TWO THUMBS UP. WAY UP!!");

const deleteButtons = document.querySelectorAll('.delete-btn');

for (let button of deleteButtons) {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const criticId = event.target.id;
        console.log("criticId:", criticId);
        const res = await fetch(`/critics/${criticId}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("data:", data);

        if (data.message === "Success") {
            const container = document.querySelector(`#critic-container-${criticId}`);
            container.remove();
        } else {
            console.log("Failed to get data.");
        }
    });
}
