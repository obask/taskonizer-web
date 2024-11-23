function enableEditing(buttonElement) {
    // Find the closest <li> element
    const listItem = buttonElement.closest("li");
    const todoId = listItem.id.replace("todo-", ""); // Extract todoId from id attribute
    const text = listItem.querySelector("span").textContent; // Get the current text of the TODO

    // Clone the edit template
    const template = document.querySelector("#edit-template").content.cloneNode(true);

    template.querySelector("li").id = `todo-${todoId}`;

    // Fill template fields
    const form = template.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleFormSubmit(form, `/edit/${todoId}`, `#todo-${todoId}`);
    });

    const input = template.querySelector("input[name='text']");
    input.value = text;

    // Set cancel logic
    template.querySelector("button.cancel").addEventListener("click", () => cancelEditing(todoId, listItem));

    // Replace the list item with the template
    listItem.replaceWith(template);
}


// Cancel editing logic
function cancelEditing(todoId, originalContent) {
    const listItem = document.querySelector(`#todo-${todoId}`)
    listItem.replaceWith(originalContent)
}


// Handle form submissions
const handleFormSubmit = async (form, url, target) => {
    const formData = new FormData(form)
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    })

    if (response.ok) {
        document.querySelector(target).innerHTML = await response.text()
    } else {
        console.error("Failed to submit form")
    }
}

async function deleteTodoDOM(buttonElement) {
    // Find the closest <li> element and extract the todoId
    const listItem = buttonElement.closest("li");
    const todoId = listItem.id.replace("todo-", "");

    try {
        const response = await fetch(`/delete/${todoId}`, {
            method: "POST"
        });

        if (response.ok) {
            // Remove the <li> element from the DOM
            listItem.replaceWith(await response.text());
        } else {
            console.error("Failed to delete TODO.");
        }
    } catch (error) {
        console.error("Error while deleting TODO:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // Attach event listeners to add form
    const addForm = document.querySelector("form")
    addForm.addEventListener("submit", (event) => {
        event.preventDefault()
        handleFormSubmit(addForm, "/add", "#todo-list")
    })
})