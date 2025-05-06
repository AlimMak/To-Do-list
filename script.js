console.log("Script loaded....")
const addTask = document.getElementById("addTaskButton");
const clearArray = document.getElementById("clearListButton");
const arrayKey = "todoThings";
let taskArray = new Array();
taskArray = loadTodoList(arrayKey);
createList(taskArray);


addTask.addEventListener("click", addToArray);
clearArray.addEventListener("click", clearList);

function createList(arg) {

    const list = document.getElementById("taskList");
    list.innerHTML = ""; 
    
    for (let i = 0; i < arg.length; i++){
    const listItem = document.createElement("li");
    const taskSpan = document.createElement("span");
    taskSpan.textContent = arg[i];

    const deleteIt = document.createElement("button");
    deleteIt.textContent = "remove";
    deleteIt.addEventListener("click", removeToDo);

    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteIt);

    document.getElementById("taskList").appendChild(listItem);
    
    }
}

function addToArray(){
    if (validateTask(document.getElementById("taskInput").value) == true){
    taskArray.push(document.getElementById("taskInput").value);
    saveToDoList();
    document.getElementById("taskInput").value = null;
    console.log(taskArray);
    createList(taskArray)
}
}

function clearList(){
    taskArray = [];
    saveToDoList();
    createList(taskArray);
    console.log(taskArray);

}

function removeToDo(){
    const listItemToRemove = this.parentNode;
    const textToRemove = listItemToRemove.querySelector('span').textContent;

    taskArray = taskArray.filter(item => item !== textToRemove);
    saveToDoList();
    listItemToRemove.remove();
    createList(taskArray);
    
}

function saveToDoList(){
    localStorage.setItem(arrayKey, JSON.stringify(taskArray));
}

function loadTodoList(arrayKey){
    const storedTodo = localStorage.getItem(arrayKey);
    if (storedTodo) {
        taskArray = JSON.parse(storedTodo);
    } else{
        taskArray = [];
    }
   return taskArray;
}

function validateTask(arg){
    let x = arg;
    if (x.trim() === "") {
        alert("Input must have a value");
        return false;
    }else{
        return true;
    }
}