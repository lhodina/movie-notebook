console.log("Hello from the index.js script");


const collectionLinks = document.querySelectorAll('.collection-link');
for (let link of collectionLinks) {
    link.addEventListener("click", async (event) => {
        event.preventDefault();
        const collectionIdString = event.target.id;
        console.log("*****collectionIdString:", collectionIdString);
        const collectionId = collectionIdString.split('-')[1];
        console.log("*****collectionId:", collectionId);
        const res = await fetch(`/collections/${collectionId}`);
        console.log("***res:", res);

        
        // const data = await res.json();
        // console.log("data:", data);
    });
}


// const deleteButtons = document.querySelectorAll('.delete-btn');
// for (let button of deleteButtons) {
//     button.addEventListener("click", async (event) => {
//         event.preventDefault();
//         const criticId = event.target.id;
//         console.log("criticId:", criticId);
//         const res = await fetch(`/critics/${criticId}`, {
//             method: "DELETE"
//         });

//         const data = await res.json();
//         console.log("data:", data);

//         if (data.message === "Success") {
//             const container = document.querySelector(`#critic-container-${criticId}`);
//             container.remove();
//         } else {
//             console.log("Failed to get data.");
//         }
//     });
// }
