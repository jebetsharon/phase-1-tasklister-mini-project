// Select the form and the task list
const form = document.getElementById("create-task-form");
const taskList = document.getElementById("tasks");

// Function to handle the form submission
function handleTaskFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission (page reload)
  
  // Get the value from the input field
  const taskDescription = document.getElementById("new-task-description").value;

  // Only add the task if the input field is not empty
  if (taskDescription.trim() !== "") {
    createTask(taskDescription); // Function to create and append the task to the DOM
  }

  // Clear the input field after submission
  document.getElementById("new-task-description").value = "";
}

// Function to create and add a task to the list
function createTask(taskDescription) {
  // Create the new task element
  const newTask = document.createElement("li");

  // Set the text of the task to the input description
  newTask.textContent = taskDescription;

  // Append the task to the task list
  taskList.appendChild(newTask);
}

// Attach event listener to the form
form.addEventListener("submit", handleTaskFormSubmit);
