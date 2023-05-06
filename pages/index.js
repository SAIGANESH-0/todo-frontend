import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  // state for the input value
  const [value, setValue] = useState("");
  // state for the editing mode
  const [editing, setEditing] = useState(false);
  // state for the current task id
  const [currentId, setCurrentId] = useState(null);

  const getTasks = async () => {
    const res = await axios.get(
      "https://todos-backend-vw3s.onrender.com/todos"
    );
    // get the data from the response
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // function to handle input change
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // function to handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if the input is not empty
    if (value.trim()) {
      // check if the editing mode is on
      if (editing) {
        const index = tasks.findIndex((task) => task._id === currentId);
        const res = await axios.put(
          `https://todos-backend-vw3s.onrender.com/todos/${currentId}`,
          { title: value, completed: tasks[index].completed }
        );
        // create a copy of the tasks state
        const updatedTasks = [...tasks];
        // update the text of the task at the found index with the input value
        updatedTasks[index].title = value;
        // update the tasks state with the updated tasks
        setTasks(updatedTasks);
        // turn off the editing mode
        setEditing(false);
        // clear the current id
        setCurrentId(null);
      } else {
        // create a new task object with a random id and the input value
        const newTask = { title: value, completed: false };
        const res = await axios.post(
          "https://todos-backend-vw3s.onrender.com/todos",
          newTask
        );
        // get the response data
        console.log(res.data);
        // update the tasks state by adding the new task
        setTasks([...tasks, newTask]);
      }
      // clear the input value
      setValue("");
    }
  };

  // function to handle task delete
  const handleDelete = async (id) => {
    const res = await axios.delete(
      `https://todos-backend-vw3s.onrender.com/todos/${id}`
    );
    // filter out the task with the given id from the tasks state
    const updatedTasks = tasks.filter((task) => task._id !== id);
    // update the tasks state with the filtered tasks
    setTasks(updatedTasks);
  };

  // function to handle task completion
  const handleComplete = async (id) => {
    const index = tasks.findIndex((task) => task._id === id);
    const res = await axios.put(
      `https://todos-backend-vw3s.onrender.com/todos/${id}`,
      { title: tasks[index].title, completed: !tasks[index].completed }
    );
    // create a copy of the tasks state
    const updatedTasks = [...tasks];
    // toggle the completed property of the task at the found index
    updatedTasks[index].completed = !updatedTasks[index].completed;
    // update the tasks state with the updated tasks
    setTasks(updatedTasks);
  };

  // function to handle task edit
  const handleEdit = (id) => {
    // find the task with the given id from the tasks state
    const task = tasks.find((task) => task._id === id);
    // set the input value to the text of the found task
    setValue(task.title);
    // turn on the editing mode
    setEditing(true);
    // set the current id to the given id
    setCurrentId(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center">Todo List App</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter a task"
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className={`w-full ${
            editing ? "bg-green-600" : "bg-blue-600"
          } text-white rounded-lg py-2 px-4 mt-2 hover:${
            editing ? "bg-green-700" : "bg-blue-700"
          }`}
        >
          {editing ? "Update Task" : "Add Task"}
        </button>
      </form>
      <ul className="mt-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between border-b border-gray-300 py-2"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleComplete(task._id)}
                className="mr-2"
              />
              <span
                className={`text-lg ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex">
              <button
                onClick={() => handleEdit(task._id)}
                className="text-yellow-600 hover:text-yellow-800 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
