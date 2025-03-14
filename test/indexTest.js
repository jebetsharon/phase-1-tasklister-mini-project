const { JSDOM } = require("jsdom");
const assert = require("assert");

describe("TaskLister", function () {
  let dom, document, window;

  beforeEach(function () {
    // Set up jsdom with a simple HTML structure
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <form id="create-task-form">
            <label for="new-task-description">Task description:</label>
            <input type="text" id="new-task-description" name="new-task-description" placeholder="description">
            <input type="submit" value="Create New Task">
          </form>
          <ul id="tasks"></ul>
        </body>
      </html>
    `);

    document = dom.window.document;
    window = dom.window;

    // Mock window and document for testing
    global.document = document;
    global.window = window;

    // Ensure MutationObserver is available
    global.MutationObserver = dom.window.MutationObserver;

    // Import the main script
    require('../src/index.js'); // Directly require the script
  });

  it("should add a task to the list when the form is submitted", function (done) {
    this.timeout(10000); // Increase timeout to 10 seconds

    const inputField = document.getElementById("new-task-description");
    const formElement = document.querySelector("form");
    const taskList = document.querySelector("#tasks");

    // Ensure taskList exists before starting the test
    assert(taskList, "Task list element not found");

    // Simulate user input
    inputField.value = "Wash the dishes";

    // Add a MutationObserver to detect when the DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && taskList.querySelector("li")) {
          const taskItem = taskList.querySelector("li");
          try {
            assert(taskItem, "Task item not found in the list");
            assert(taskItem.textContent.includes("Wash the dishes"), "Task not added correctly");
            observer.disconnect(); // Stop observing once the task is added
            done(); // Mocha will know the test is done
          } catch (err) {
            observer.disconnect();
            done(err); // If assertion fails, report error
          }
        }
      });
    });

    observer.observe(taskList, { childList: true });

    // Manually trigger the submit handler for the form
    formElement.querySelector('input[type="submit"]').click(); // Use click on the submit button
  });
});
