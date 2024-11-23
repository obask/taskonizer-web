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
        handleFormSwap(form, `/edit/${todoId}`, `#todo-${todoId}`);
    });

    const input = template.querySelector("input[name='text']");
    input.value = text;

    // Set cancel logic
    template.querySelector("button.cancel").addEventListener("click", () => cancelEditing(todoId, listItem));

    // Replace the list item with the template
    listItem.replaceWith(template);
    input.focus();
}

function cancelEditing(todoId, originalContent) {
    const listItem = document.querySelector(`#todo-${todoId}`)
    listItem.replaceWith(originalContent)
}

async function handleFormSubmit(form, url, target) {
    const formData = new FormData(form);
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const html = await response.text();
        document.querySelector(target).innerHTML = html;
    } else {
        console.error("Failed to submit form");
    }
}

async function handleFormSwap(form, url, target) {
    const formData = new FormData(form);
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const html = await response.text();
        document.querySelector(target).outerHTML = html;
    } else {
        console.error("Failed to submit form");
    }
}

function deleteTodoDOM(buttonElement) {
    const listItem = buttonElement.closest("li");
    const todoId = listItem.id.replace("todo-", "");

    if (confirm("Are you sure you want to delete this todo?")) {
        fetch(`/delete/${todoId}`, {method: "POST"})
            .then((response) => {
                if (response.ok) {
                    listItem.remove();
                } else {
                    console.error("Failed to delete TODO.");
                }
            })
            .catch((error) => console.error("Error while deleting TODO:", error));
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // Attach event listeners to add form
    const addForm = document.querySelector("form")
    addForm.addEventListener("submit", (event) => {
        event.preventDefault()
        handleFormSubmit(addForm, "/add", "#todo-list")
    })

    const todoList = document.getElementById("todo-list");

    let selectedTodoIndex = -1;


    function updateSelectedTodo() {
        const todos = Array.from(todoList.querySelectorAll("li"));
        todos.forEach((todo, index) => {
            if (index === selectedTodoIndex) {
                todo.classList.add("is-selected");
                todoList.setAttribute("data-selected-id", todo.id.replace("todo-", ""));
            } else {
                todo.classList.remove("is-selected");
            }
        });
    }

    function handleKeyboardNavigation(event) {
        const todos = Array.from(todoList.querySelectorAll("li"));
        if (!todos.length) return;

        switch (event.key) {
            case "ArrowDown":
                selectedTodoIndex = (selectedTodoIndex + 1) % todos.length;
                updateSelectedTodo();
                break;
            case "ArrowUp":
                selectedTodoIndex = (selectedTodoIndex - 1 + todos.length) % todos.length;
                updateSelectedTodo();
                break;
            case "Enter":
                if (selectedTodoIndex >= 0) {
                    const selectedTodo = todos[selectedTodoIndex];
                    const isEditing = selectedTodo.querySelector("form");
                    if (isEditing) {
                        // Save changes when Enter is pressed in edit mode
                        // const form = selectedTodo.querySelector("form");
                    } else {
                        // Enter edit mode
                        enableEditing(selectedTodo.querySelector(".button.is-warning"));
                        event.preventDefault();
                    }
                }
                break;
            case "Escape":
                if (selectedTodoIndex >= 0) {
                    const selectedTodo = todos[selectedTodoIndex];
                    const isEditing = selectedTodo.querySelector(".button.is-light");
                    if (isEditing) {
                        isEditing.dispatchEvent(new Event("click", {bubbles: true}));
                    }
                }
                break;
            default:
                break;
        }
    }

    // Add event listener for keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation);
});
