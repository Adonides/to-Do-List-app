function toggleButton(){
    const navbar = document.getElementsByClassName('navbar-links')[0]
    navbar.classList.toggle('active')
}

/*MY TO DO LISTS================================================*/
const listsHolder = document.querySelector('#lists-holder')
const listForm = document.querySelector('#list-form')
const listInput = document.querySelector('#list-input')

const displayHolder = document.querySelector('#display-holder')
const listTitle = document.querySelector('#list-title')
const taskCount = document.querySelector('#task-count')
const tasksHolder = document.querySelector('#tasks')
const taskTemplate = document.querySelector('#task-template')
const taskForm = document.querySelector('#task-form')
const taskInput = document.querySelector('#task-input')

/*LISTS================================================*/
const local_StorageKey = 'AA_to_do_lists'
const local_Storage_SelectedKey = 'AA_selected_list'

let lists = JSON.parse(localStorage.
    getItem(local_StorageKey)) || []
let selectedListStorage = localStorage.
    getItem(local_Storage_SelectedKey)

function save() {
    localStorage.setItem(local_StorageKey, JSON.stringify(lists))
}

listsHolder.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListStorage = e.target.dataset.listId  
        toDoAndsave()
    }
})

function toDoLists() {
    clearElementList(listsHolder)
    myList()
    
    const selectList = lists.find(list => list.id === selectedListStorage)
    if (selectedListStorage == null) {
        displayHolder.style.display = 'none'
    } else {
        displayHolder.style.display = ''
        listTitle.innerText = selectList.name
        taskCounter(selectList)
        clearElementList(tasksHolder)
        myTasks(selectList)
    }
}

function toDoAndsave() {
    save()
    toDoLists()
}

function myList() {
    lists.forEach(list => {
        const createTagList = document.createElement('li')
        createTagList.dataset.listId = list.id //listId para poder selecionar
        createTagList.classList.add("list-name")
        createTagList.innerText = list.name
        if (list.id === selectedListStorage) {
            createTagList.classList.add("active-list")
        }
        listsHolder.appendChild(createTagList)
        
    })
}

listForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = listInput.value
    if (listName == null || listName === "") return
    const newList = createNewList(listName)
    listInput.value = null
    lists.push(newList)
    toDoAndsave()
})

function createNewList(listName) {
    return {
        id: Date.now().toString(),
        name: listName, 
        tasks: [] 
    }
}
 
function clearElementList(ulTag) {
    while (ulTag.firstChild) {
        ulTag.removeChild(ulTag.firstChild)
    }
}

/*TASKS================================================*/
tasksHolder.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectList = lists.find(list => list.id === selectedListStorage)
        const selectTask = selectList.tasks.find(task => task.id === e.target.id)
        selectTask.complete = e.target.checked
        save()
        taskCounter(selectList)
    }
})

function taskCounter(selectList) {
    const incompletetasks = selectList.tasks.
        filter(task => !task.complete).length
    const taskString = incompletetasks === 1 ? "task" : "tasks"
    taskCount.innerText = `${incompletetasks} ${taskString} remaining`
}

function myTasks(selectList) {
    selectList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksHolder.appendChild(taskElement)
    })
}

taskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = taskInput.value
    if (taskName == null || taskName === "") return
    const newTask = createNewTask(taskName)
    taskInput.value = null
    const selectList = lists.find(list => list.id === selectedListStorage)
    selectList.tasks.push(newTask)
    toDoAndsave()
})

function createNewTask(taskName) {
    return {
        id: Date.now().toString(),
        name: taskName,
        complete: false
    }
}

/*BUTTONS================================================*/
function btnDelete() {
    lists = lists.filter(list => list.id !== selectedListStorage)
    selectedListStorage = null
    toDoAndsave()
}

function btnDeleteTask() {
    const selectList = lists.find(list => list.id === selectedListStorage)
    selectList.tasks = selectList.tasks.filter(task => !task.complete)
    toDoAndsave()
}

toDoLists()