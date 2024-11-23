from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

app = FastAPI()

# Set up templates
templates = Jinja2Templates(directory="templates")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# In-memory TODO list
todos = []
todo_id_counter = 1  # Separate ID counter for consistency

@app.get("/app.js")
async def serve_static_file():
    """Serve static files with no-cache headers."""
    response = FileResponse("app.js")
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the main TODO page."""
    return templates.TemplateResponse("index.html", {"request": request, "todos": todos})


@app.post("/add", response_class=HTMLResponse)
async def add_todo(request: Request, todo: str = Form(...)):
    """Add a new TODO."""
    global todo_id_counter
    todos.append({"id": todo_id_counter, "text": todo, "completed": False})
    todo_id_counter += 1
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})


@app.post("/toggle/{todo_id}", response_class=HTMLResponse)
async def toggle_complete(request: Request, todo_id: int):
    """Toggle the completion status of a TODO."""
    todo = next((t for t in todos if t["id"] == todo_id), None)
    if todo is None:
        raise HTTPException(status_code=404, detail="TODO not found")
    todo["completed"] = not todo["completed"]
    return templates.TemplateResponse("partials/todo_list.html", {"request": request, "todos": todos})


@app.post("/delete/{todo_id}", response_class=HTMLResponse)
async def delete_todo(request: Request, todo_id: int):
    """Delete a TODO."""
    global todos
    todos = [todo for todo in todos if todo["id"] != todo_id]
    return HTMLResponse(status_code=204)  # Return empty response with no content


@app.post("/edit/{todo_id}", response_class=HTMLResponse)
async def edit_todo(request: Request, todo_id: int, text: str = Form(...)):
    """Edit a TODO."""
    todo = next((t for t in todos if t["id"] == todo_id), None)
    if todo is None:
        raise HTTPException(status_code=404, detail="TODO not found")
    todo["text"] = text
    return templates.TemplateResponse("partials/todo_item.html", {"request": request, "todo": todo})
