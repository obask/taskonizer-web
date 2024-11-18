from flask import Flask, render_template, request

app = Flask(__name__)

# In-memory storage for TODOs
todos = [
    {'id': 1, 'text': "new_todo", 'completed': False},
    {'id': 2, 'text': "new_todo2", 'completed': True},
]

@app.route('/')
def index():
    """Render the main TODO page."""
    return render_template('index.html', todos=todos)

@app.route('/add', methods=['POST'])
def add_todo():
    """Add a new TODO."""
    new_todo = request.form.get('todo')
    if new_todo:
        todos.append({'id': len(todos) + 1, 'text': new_todo, 'completed': False})
    return render_template('partials/todo_list.html', todos=todos)

@app.route('/edit/<int:todo_id>', methods=['POST'])
def edit_todo(todo_id):
    """Edit an existing TODO."""
    updated_text = request.form.get('text')
    for todo in todos:
        if todo['id'] == todo_id:
            todo['text'] = updated_text
    return render_template('partials/todo_list.html', todos=todos)

@app.route('/delete/<int:todo_id>', methods=['POST'])
def delete_todo(todo_id):
    """Delete a TODO."""
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return render_template('partials/todo_list.html', todos=todos)

@app.route('/toggle/<int:todo_id>', methods=['POST'])
def toggle_todo(todo_id):
    """Toggle the completion status of a TODO."""
    for todo in todos:
        if todo['id'] == todo_id:
            todo['completed'] = not todo['completed']
    return render_template('partials/todo_list.html', todos=todos)

if __name__ == '__main__':
    app.run(debug=True)
