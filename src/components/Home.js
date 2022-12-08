import React, { useState } from 'react'

export default function Home() {

    const [emptyFlag, setEmptyFlag] = useState({
        field: null,
        section: null
    })
    const [todoSections, setTodoSections] = useState({
        review: [],
        pending: [],
        completed: []
    })

    const [newTask, setNewTask] = useState({
        review: '',
        pending: '',
        completed: ''
    })

    const [editDetails, setEditDetails] = useState({
        taskIndex: null,
        taskSection: null,
        newTask: null
    })

    const [openedTextField, setOpenedTextField] = useState(null)

    const openAddTaskField = (section) => {
        setOpenedTextField(section)
        setEmptyFlag({
            field: null,
            section: null
        })
    }

    const handleTextChange = (value, section) => {
        setNewTask({ ...newTask, [section]: value })
    }

    const handleKeyPress = (e, section) => {
        if (e.key === "Enter") {
            if (newTask[section] !== '') {
                let tempArray = todoSections[section]
                tempArray.push(newTask[section])
                setTodoSections({ ...todoSections, [section]: tempArray })
                hideTextField()
                setEmptyFlag({
                    field: null,
                    section: null
                })
            }
            else {
                setEmptyFlag({
                    field: 'Add Task',
                    section: section
                })
            }
        }
    };

    const handleEditEnterKey = (e) => {
        if(e.key === 'Enter') {
            setEditDetails({
                taskIndex: null,
                taskSection: null,
                newTask: null
            })
        }
    }

    const hideTextField = () => {
        setOpenedTextField(null)
        setNewTask({
            review: '',
            pending: '',
            completed: ''
        })
    }

    const editButtonClicked = (index, section) => {
        setEditDetails({
            taskIndex: index,
            taskSection: section,
            newTask: todoSections[section][index]
        })
    }

    const editChangeHandler = (value, index, section) => {
        if (value !== '') {
            let tempArray = todoSections[section]
            tempArray[index] = value
            setTodoSections({ ...todoSections, [section]: tempArray })
        }
    }

    const saveEditChanges = () => {
        setEditDetails({
            taskIndex: null,
            taskSection: null,
            newTask: null
        })
    }

    const deleteButtonClicked = (index, section) => {
        let tempArray = todoSections[section]
        tempArray.splice(index, 1)
        setTodoSections({ ...todoSections, [section]: tempArray })
    }

    const drag = (e, index, section) => {
        e.dataTransfer.setData("taskDetails", JSON.stringify({
            draggedTask: todoSections[section][index],
            draggedTaskPrevSection: section,
            draggedTaskIndex: index
        }));
    }

    const allowDrop = (event) => {
        event.preventDefault();
    }

    function drop(event, destination) {
        event.preventDefault();
        var data = JSON.parse(event.dataTransfer.getData("taskDetails"))
        let tempArray = todoSections[destination]
        let tempArray2 = todoSections[data.draggedTaskPrevSection]
        tempArray.push(data.draggedTask)
        tempArray2.splice(data.draggedTaskIndex, 1)
        setTodoSections({ ...todoSections, [destination]: tempArray, [data.draggedTaskPrevSection]: tempArray2 })
    }

    return (
        <main className='home-container'>
            <h1>Todo App</h1>
            <section className='todo-section'>
                <ul className='todo-container'>
                    <li>
                        <div className='todo-status-header'>
                            <h2>Review</h2>
                            <button onClick={() => openAddTaskField('review')}>+</button>
                        </div>
                        {(emptyFlag.section === 'review') ? <p className='empty-error'>*{emptyFlag.field} field is empty</p> : ''}
                        <div className='todo-status-section' onDrop={(event) => drop(event, 'review')} onDragOver={(event) => allowDrop(event)}>
                            {(openedTextField === 'review') ? <input type='text' className='add-task-field' onChange={(e) => handleTextChange(e.target.value, 'review')} value={newTask.review} onKeyPress={(e) => handleKeyPress(e, 'review')} /> : ''}

                            {(todoSections.review.length > 0) ? <ul className='todo-tasks'>
                                {todoSections.review.map((item, index) => {
                                    return (editDetails.taskSection === 'review' && editDetails.taskIndex === index) ? <li key={index}><input type='text' onChange={(e) => editChangeHandler(e.target.value, index, 'review')} value={todoSections.review[index]} onKeyPress={(e) => handleEditEnterKey(e, 'review')} /><button onClick={saveEditChanges}>Done</button></li> : <li key={index} draggable='true' onDragStart={(event) => drag(event, index, 'review')}>
                                        <p>{item}</p>
                                        <div>
                                            <button onClick={() => editButtonClicked(index, 'review')}>Edit</button>
                                            <button onClick={() => deleteButtonClicked(index, 'review')}>Delete</button>
                                        </div>
                                    </li>
                                })}
                            </ul> : <p>No Tasks Added</p>}
                        </div>
                    </li>
                    <li>
                        <div className='todo-status-header'>
                            <h2>Pending</h2>
                            <button onClick={() => openAddTaskField('pending')}>+</button>
                        </div>
                        {(emptyFlag.section === 'pending') ? <p className='empty-error'>*{emptyFlag.field} field is empty</p> : ''}
                        <div className='todo-status-section' onDrop={(event) => drop(event, 'pending')} onDragOver={(event) => allowDrop(event)}>
                            {(openedTextField === 'pending') ? <input type='text' className='add-task-field' onChange={(e) => handleTextChange(e.target.value, 'pending')} value={newTask.pending} onKeyPress={(e) => handleKeyPress(e, 'pending')} /> : ''}

                            {(todoSections.pending.length > 0) ? <ul className='todo-tasks'>
                                {todoSections.pending.map((item, index) => {
                                    return (editDetails.taskSection === 'pending' && editDetails.taskIndex === index) ? <li key={index}><input type='text' onChange={(e) => editChangeHandler(e.target.value, index, 'pending')} value={todoSections.pending[index]} onKeyPress={(e) => handleEditEnterKey(e, 'pending')} /><button onClick={saveEditChanges}>Done</button></li> : <li key={index} draggable='true' onDragStart={(event) => drag(event, index, 'pending')}>
                                        <p>{item}</p>
                                        <div>
                                            <button onClick={() => editButtonClicked(index, 'pending')}>Edit</button>
                                            <button onClick={() => deleteButtonClicked(index, 'pending')}>Delete</button>
                                        </div>
                                    </li>
                                })}
                            </ul> : <p>No Tasks Added</p>}
                        </div>
                    </li>
                    <li>
                        <div className='todo-status-header'>
                            <h2>Completed</h2>
                            <button onClick={() => openAddTaskField('completed')}>+</button>
                        </div>
                        {(emptyFlag.section === 'completed') ? <p className='empty-error'>*{emptyFlag.field} field is empty</p> : ''}
                        <div className='todo-status-section' onDrop={(event) => drop(event, 'completed')} onDragOver={(event) => allowDrop(event)}>
                            {(openedTextField === 'completed') ? <input type='text' className='add-task-field' onChange={(e) => handleTextChange(e.target.value, 'completed')} value={newTask.completed} onKeyPress={(e) => handleKeyPress(e, 'completed')} /> : ''}

                            {(todoSections.completed.length > 0) ? <ul className='todo-tasks'>
                                {todoSections.completed.map((item, index) => {
                                    return (editDetails.taskSection === 'completed' && editDetails.taskIndex === index) ? <li key={index}><input type='text' onChange={(e) => editChangeHandler(e.target.value, index, 'completed')} value={todoSections.completed[index]} onKeyPress={(e) => handleEditEnterKey(e, 'completed')} /><button onClick={saveEditChanges}>Done</button></li> : <li key={index} draggable='true' onDragStart={(event) => drag(event, index, 'completed')}>
                                        <p>{item}</p>
                                        <div>
                                            <button onClick={() => editButtonClicked(index, 'completed')}>Edit</button>
                                            <button onClick={() => deleteButtonClicked(index, 'completed')}>Delete</button>
                                        </div>
                                    </li>
                                })}
                            </ul> : <p>No Tasks Added</p>}
                        </div>
                    </li>
                </ul>
            </section>
        </main>
    )
}
