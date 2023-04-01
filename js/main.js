var getAndDisplayAllTasks;
var taskFilter = "all";

$(document).ready(function () {
  getAndDisplayAllTasks = function (filter) {
    $.ajax({
      type: "GET",
      url: "https://fewd-todolist-api.onrender.com/tasks?api_key=151",
      dataType: "json",
      success: function (response, textStatus) {
        $("#todo-list").empty();
        response.tasks.forEach(function (task) {
          if (
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed)
          ) {
            $("#todo-list").append(
              '<div class="row"><input type="checkbox" class="mark-complete col-xs-1" data-id="' +
                task.id +
                '"' +
                (task.completed ? " checked" : "") +
                '><p class="col-xs-5">' +
                task.content +
                '</p><button class="delete  btn-danger col-xs-2" data-id="' +
                task.id +
                '">Delete</button></div>'
            );
          }
        });
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  var createTask = function () {
    $.ajax({
      type: "POST",
      url: "https://fewd-todolist-api.onrender.com/tasks?api_key=151",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: $("#new-task-content").val(),
        },
      }),
      success: function (response, textStatus) {
        $("#new-task-content").val("");
        getAndDisplayAllTasks(taskFilter);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  $("#create-task").on("submit", function (e) {
    e.preventDefault();
    createTask();
  });

  // update the task list when the filter is changed
  $("#tasks").on("change", function () {
    taskFilter = $(this).val();
    getAndDisplayAllTasks(taskFilter);
  });

  getAndDisplayAllTasks(taskFilter);
});

var deleteTask = function (id) {
  $.ajax({
    type: "DELETE",
    url: "https://fewd-todolist-api.onrender.com/tasks/" + id + "?api_key=151",
    success: function (response, textStatus) {
      getAndDisplayAllTasks(taskFilter);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

$(document).on("click", ".delete", function () {
  deleteTask($(this).data("id"));
});

var markTaskComplete = function (id) {
  $.ajax({
    type: "PUT",
    url:
      "https://fewd-todolist-api.onrender.com/tasks/" +
      id +
      "/mark_complete?api_key=151",
    dataType: "json",
    success: function (response, textStatus) {
      getAndDisplayAllTasks(taskFilter);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    },
  });
};

$(document).on("change", ".mark-complete", function () {
  if (this.checked) {
    markTaskComplete($(this).data("id"));
  } else {
    markTaskActive($(this).data("id"));
  }
});