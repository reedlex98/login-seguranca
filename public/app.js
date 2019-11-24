const addNewTodo = e => {
    if (e.keyCode === 13) {
        $.post("/api/todos/", { name: e.target.value })
            .then(data => {
                document.querySelector("#add-todo").value = ""
                addTodos([data])
            })
            .catch(err => { console.log(err) })
    }

}

const addTodos = objs => objs.forEach(obj => {
    const li = $(`<li completed='${obj.completed}' class='${obj.completed ? 'done' : ''}'><span>${obj.name}</span><button class='delete'>X</button></li>`)
    $(".todos").append(li)
    li.data("id", obj._id)
    li.data("completed", obj.completed)
})

const deleteTodo = e => {
    e.stopPropagation()
    const parent = $(e.target).parent()
    const id = parent.data("id")

    parent.remove()

    $.ajax({
        url: `/api/todos/${id}`,
        method: "DELETE"
    })
        .then(res => { console.log(res) })
        .catch(err => { console.log(err) })
}

const updateTodo = e => {
    const target = $(e.target).prop("tagName") === "SPAN" ? $(e.target).parent() : $(e.target)
    const id = target.data("id")
    const completedStatus = target.data("completed")
    
    $.ajax({
        method: "PUT",
        url: `/api/todos/${id}`,
        data: {
            completed: !completedStatus
        }
    })
        .then(() => { target.toggleClass("done"); target.data("completed", !completedStatus) })
        .catch(err => { console.log(err) })

}


$(document).ready(() => {
    $.getJSON("/api/todos/")
        .then(addTodos)

    $("#add-todo").on("keyup", addNewTodo)

    $(".todos").on('click', 'button', deleteTodo)

    $(".todos").on('click', 'li', updateTodo)
})