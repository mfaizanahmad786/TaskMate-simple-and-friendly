import React, { useEffect, useState } from 'react'
import { VscArrowCircleRight } from "react-icons/vsc";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { useRef } from 'react';
import { authService } from '../../Apis/authService';
import { taskService } from '../../Apis/taskService';

const TaskList = ({ deleteTask,onTaskUpdate,isOpen,setIsOpen,setTask}) => {

    const scrollArea = useRef();
    const [tasks, setTasks] = useState([]);
    const currentUser = authService.getCurrentUser()
    


    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = async () => {
        try {
            if (!currentUser) {
                window.alert("User data not available")
            }

            const taskData = await taskService.getAllTasks();
            const activeTasks = taskData.filter(task => task.acceptanceStatus !== 'Rejected' && task.status !== 'Completed');

            setTasks(activeTasks)
        } catch (e) {
            console.log(e)
        }
    }

    const markComplete = async (id, status) => {
        try {
             await taskService.updateTask(id, status)
            
            if(status.status === "Accepted"){
               const updatedTasks = tasks.map(task => 
                task._id === id ? {...task,acceptanceStatus:"Accepted"} : task
               )

               setTasks(updatedTasks)
            }else{
                setTasks(tasks.filter(task => task._id !== id))
            }
            if (onTaskUpdate) {
                onTaskUpdate()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const scrollLeft = () => {
        if (scrollArea.current) {
            scrollArea.current.scrollBy({
                left: -550,
                behavior: 'smooth',
            });
        }
    }
    const scrollRight = () => {
        if (scrollArea.current) {
            scrollArea.current.scrollBy({
                left: 550,
                behavior: 'smooth',
            })
        }
    }

    return (
        <>
            <div id='tasklist' ref={scrollArea} className='h-[80%] overflow-x-auto gap-5 flex justify-start items-center flex-nowrap  '>

                {
                    tasks.length === 0 ? (<div className="text-xl font-bold text-center w-full">No tasks to display</div>) : (
                        tasks.map((task) => (
                            <div className='flex-shrink-0 bg-gray-900 ml-2 w-1/4 rounded-2xl h-[90%]  flex flex-col p-5' key={task._id}>
                                <div className='flex justify-between'>
                                    <h3 className=' text-sm font-medium bg-red-600  px-4 py-3 rounded'>High</h3>
                                    <div className='text-xl p-2'>
                                        {task.date}
                                    </div>
                                </div>
                                <div className='text-4xl mt-3 font-medium'>{task.title}</div>
                                <div className='mt-3'>{task.description}</div>
                                {task.acceptanceStatus === "Pending" ? (
                                    <div className="acceptance">
                                        <button
                                            onClick={() => markComplete(task._id, { status: "Accepted" })}
                                            className='mt-5 bg-[#02733E] hover:bg-[#038C4C] text-white px-4 py-2 rounded'>
                                            Accept
                                        </button>
                                        <button
                                            onClick={()=>{setIsOpen(true);
                                                setTask(task)
                                            }}
                                            
                                            className='mt-5 bg-[#D9534F] hover:bg-[#C9302C] text-white px-4 py-2 rounded ml-4'>
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => markComplete(task._id, { status: "Completed" })}
                                        className='mt-5 bg-[#02733E] hover:bg-[#038C4C] text-white px-4 py-2 rounded'>
                                        Mark as Completed
                                    </button>
                                )}


                            </div>
                        )))}

            </div>
            <div className="flex justify-center items-center gap-5">
                <VscArrowCircleLeft onClick={scrollLeft} className="text-6xl text-blue-500 hover:text-blue-700 cursor-pointer" />
                <VscArrowCircleRight onClick={scrollRight} className="text-6xl text-blue-500 hover:text-blue-700 cursor-pointer" />
            </div>
        </>
    )
}

export default TaskList