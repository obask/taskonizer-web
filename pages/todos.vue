<template>
  <div class="container">
    <h1>TODO App</h1>
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add a new task" class="input" />
      <button type="submit" class="button">Add</button>
    </form>
    <ul>
      <li v-for="(todo, index) in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
        <span :class="{ completed: todo.completed }">Text: {{ todo["todo"] }}</span>
        <button @click="removeTodo(todo.id)" class="remove-btn">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newTodo: "",
      todos: [{
        id: 1,
        completed: false,
        todo: "dfsa",
      }],
    };
  },
  async mounted() {
    await this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get("/api/hell");
        this.todos = response.data;
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return;
      const newTodo = {
        text: this.newTodo.trim(),
        completed: false,
      };
      try {
        const response = await axios.post("http://localhost:3000/todos", newTodo);
        this.todos.push(response.data);
        this.newTodo = "";
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    },
    async updateTodo(todo) {
      try {
        await axios.put(`http://localhost:3000/todos/${todo.id}`, todo);
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    },
    async removeTodo(id) {
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        console.error("Failed to remove todo:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
