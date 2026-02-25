$(document).ready(function () {

    $("#addTask").click(function () {
        var task = $("#task").val().trim();
        if (task === null)
            return;

        const li = document.createElement("li");
        const span = document.createElement("span");
        const button = document.createElement("button");

        span.textContent = task;
        button.textContent = "Delete";

        button.classList.add("delete-btn");

        li.appendChild(span);
        li.appendChild(button);

        document.getElementById("taskList").appendChild(li);

        $("#task").val("");
    });

    $(document).on("click", ".delete-btn", function () {
        $(this).parent().remove();
    });

    $("#deleteAll").click(function () {
        if ($("#taskList li").length > 0) {
            $("#taskList").empty();
        }
    });

});
