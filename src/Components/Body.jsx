import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Body = () => {
  const [input, setInput] = useState("");
  const [todolist, setTodolist] = useState([]);
  const [handleEdit, setHandleEdit] = useState(null);

  // Load todo list from local storage on component mount
  useEffect(() => {
    const savedTodolist = JSON.parse(localStorage.getItem('todolist'));
    if (savedTodolist) {
      setTodolist(savedTodolist);
    } else {
      setTodolist([]); // Ensure it's set to an empty array if nothing is in localStorage
    }
  }, []);

  // Save todo list to local storage whenever it changes
  useEffect(() => {
    if (todolist.length > 0) {
      localStorage.setItem('todolist', JSON.stringify(todolist));
    }
  }, [todolist]);

 

  function HandleEdit(id) {
    const todoToEdit = todolist.find((todo) => todo.id === id);
    setInput(todoToEdit.item);
    setHandleEdit(id);
  }

  function addToList() {
    if (input.trim() !== "") {
      if (handleEdit) {
        const updatedList = todolist.map((todo) =>
          todo.id === handleEdit ? { ...todo, item: input } : todo
        );
        setTodolist(updatedList);
        setHandleEdit(null);
        setInput("");
      } else {
        const newTodo = { id: uuidv4(), item: input, completed: false };
        setTodolist([...todolist, newTodo]);
        setInput("");
      }
    }
  }

  function deleteTodo(id) {
    const updatedList = todolist.filter(todo => todo.id !== id);
    setTodolist(updatedList);
  }

  function toggleCompletion(id) {
    const updatedList = todolist.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodolist(updatedList);
  }

  return (
    <div className="p-4 max-w-sm mx-auto rounded-xl shadow-md space-y-4 mt-6 bg-violet-300">
      <div className="flex items-center">
        <input
          className="w-50 rounded-md flex-grow p-2"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter todo"
        />
        <button
          onClick={addToList}
          className="bg-blue-950 rounded-lg ml-2 text-white p-2"
        >
          {handleEdit ? "Update" : "Add"}
        </button>
      </div>
      <h2><b>Your todos:</b></h2>
      {todolist.map((item) => (
        <div key={item.id} className="text-black flex justify-between items-center mt-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleCompletion(item.id)}
              className="mr-2"
            />
            <span className={item.completed ? "line-through" : ""}>
              {item.item}
            </span>
          </div>
          <div>
            <button onClick={() => HandleEdit(item.id)} className="bg-blue-950 rounded-lg ml-2 text-white p-2">
              Edit
            </button>
            <button 
              onClick={() => deleteTodo(item.id)} 
              className="bg-blue-950 rounded-lg ml-2 text-white p-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Body;
