console.log("Script loaded....")
const addTask = document.getElementById("addTaskButton");
const clearArray = document.getElementById("clearListButton");
const arrayKey = "todoThings";
let taskArray = new Array();
taskArray = loadTodoList(arrayKey);
createList(taskArray);


addTask.addEventListener("click", addToArray);
clearArray.addEventListener("click", clearList);

let draggedItem = null;
let taskList = document.getElementById("taskList");

function createList(arg) {

    const list = document.getElementById("taskList");
    list.innerHTML = ""; 
    
    for (let i = 0; i < arg.length; i++){
        
    const listItem = document.createElement("li");
    const taskSpan = document.createElement("span");
    taskSpan.textContent = arg[i];

    const checkbx = document.createElement("input");
    checkbx.type = "checkbox";
    checkbx.className = "completedcheckbox";
    checkbx.addEventListener("change", crossOut);

    const deleteIt = document.createElement("i");
    deleteIt.className = ("removeToDo fa-solid fa-trash fa-2x");
    deleteIt.addEventListener("click", removeToDo);

    const dragHandle = document.createElement("span");
    dragHandle.classList.add("material-symbols-outlined", "drag-handle");
    dragHandle.textContent = "drag_indicator";
    
    listItem.appendChild(deleteIt);
    listItem.appendChild(checkbx);
    listItem.appendChild(taskSpan);
    listItem.appendChild(dragHandle);

    listItem.draggable = true;
    listItem.addEventListener("dragstart", handleDragStart);
    listItem.addEventListener("dragover", handleDragOver);
    listItem.addEventListener("drop", handleDrop);
    listItem.addEventListener("dragend", handleDragEnd);


    //document.getElementById("taskList").appendChild(listItem);
    list.appendChild(listItem);
    }
}

function handleDragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.setData('text/plain', '');
    draggedItem.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
    }
     const newOrder = Array.from(taskList.children).map(item => item.querySelector('span').textContent);
     taskArray = newOrder;
     saveToDoList();
}


function handleDragEnd() {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
    }
    draggedItem = null;

}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}







function addToArray(){
    if (validateTask(document.getElementById("taskInput").value) == true){
    taskArray.push(document.getElementById("taskInput").value);
    saveToDoList();
    document.getElementById("taskInput").value = "";
    console.log(taskArray);
    createList(taskArray);
    document.querySelector('.autoresize').dispatchEvent(new Event('input'));

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

function crossOut(){
    const listElement = this.parentNode;
    const textToCross = listElement.querySelector('span').textContent;
    textToCross.style.textDecoration = "line-through";
    listElement.querySelector('span').textContent = textToCross;
}

document.querySelector('.autoresize').addEventListener('input', function(){
    this.style.height = 'auto';
    const maxHeight = 500; // set the max height the same as the one I put in css
    // set the height to the scrollbar and cap once at maxHeight
    this.style.height = Math.min(this.scrollHeight, maxHeight) + "px";
    // if scrollHeight > maxHeight then show scrollbar if not then keep it hidden
    this.style.overflowY = this.scrollHeight > maxHeight ? "auto" : "hidden";
});

// Add this after the event listener
document.querySelector('.autoresize').dispatchEvent(new Event('input'));


