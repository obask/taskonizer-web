from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Set up templates
templates = Jinja2Templates(directory="templates")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# In-memory TODO list
todos = []


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the main TODO page."""
    return templates.TemplateResponse("index.html", {"request": request, "todos": todos})


@app.post("/add", response_class=HTMLResponse)
async def add_todo(request: Request, todo: str = Form(...)):
    """Add a new TODO."""
    todos.append({"id": len(todos) + 1, "text": todo, "completed": False})
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})


@app.post("/toggle/{todo_id}", response_class=HTMLResponse)
async def toggle_complete(request: Request, todo_id: int):
    """Toggle the completion status of a TODO."""
    for todo in todos:
        if todo["id"] == todo_id:
            todo["completed"] = not todo["completed"]
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})


@app.post("/delete/{todo_id}", response_class=HTMLResponse)
async def delete_todo(request: Request, todo_id: int):
    """Delete a TODO."""
    global todos
    todos = [todo for todo in todos if todo["id"] != todo_id]
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})


@app.post("/edit/{todo_id}", response_class=HTMLResponse)
async def edit_todo(request: Request, todo_id: int, text: str = Form(...)):
    """Edit a TODO."""
    for todo in todos:
        if todo["id"] == todo_id:
            todo["text"] = text
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})
