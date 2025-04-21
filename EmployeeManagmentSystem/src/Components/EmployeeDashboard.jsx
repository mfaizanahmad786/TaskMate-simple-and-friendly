import React, { useEffect, useState } from 'react'
import TaskList from './TaskList'
import { authService } from '../../Apis/authService';
import { taskService } from '../../Apis/taskService';
import { useNavigate } from 'react-router-dom'
import PopupModal from './Popup';
import Popup from './Popup';

const EmployeeDashboard = () => {

    const navigate = useNavigate();
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0)
    const [rejectedTasks, setRejectedTasks] = useState(0)
    const [currentUser, setCurrentUser] = useState(null);
    const [openModal,setOpenModal] = useState(false)
    const [selectedTask,setSelectedTask] = useState(null)



    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/', { replace: true });
    }

    const updateTotalTasks = (tasksCount) => {
        setTotalTasks(tasksCount);
    }

    useEffect(() => {

        const fetchUser = async () => {
            const user = await authService.getCurrentUser();
            console.log(user)
            setCurrentUser(user)
        }

        fetchUser()

    }, [])

    useEffect(() => {
        if (currentUser) {
            fetchTaskStats()
        }
    }, [currentUser])

    const removeTask = (taskID) => {
        setTask(prevTask => prevTask.filter(task => task._id !== taskID))
    }

    const fetchTaskStats = async () => {
        try {
            if (!currentUser) {
                window.alert("User information not available")
            }

            const tasks = await taskService.getTaskStats()

            setCompletedTasks(tasks.completedTasks)
            setTotalTasks(tasks.totalTasks)
            setPendingTasks(tasks.pendingTasks)
            setRejectedTasks(tasks.rejectedTasks)


        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className=" bg-gray-800 h-screen w-screen overflow-y-hidden">
            <div className="header mt-20 flex justify-between">
                <div>
                    <div className='text-3xl mt-2 ml-2'>Employee Dashboard</div>
                    <div className='text-5xl mt-5 ml-2 font-bold'>Welcome, {currentUser ? currentUser.name : "Loading..."} 👋</div>
                </div>
                <div>
                    <button className='px-3 py-4 bg-red-600 mr-5 hover:bg-red-500' onClick={() => handleLogout()}>Log out</button>
                </div>
            </div>
            <div className='mt-5 flex justify-center items-center'>
                <div className='w-1/4 bg-blue-600  m-2 h-50 rounded-2xl p-10 text-3xl flex flex-col justify-between'>Total Tasks <span className='text-7xl'>{totalTasks ? totalTasks : 0}</span></div>
                <div className='w-1/4  bg-[#4747a1] m-2 h-50 rounded-2xl p-10 text-3xl flex flex-col justify-between'>Rejected Tasks <span className='text-7xl'>{rejectedTasks ? rejectedTasks : 0}</span></div>
                <div className='w-1/4 bg-[#f3797e] m-2 h-50 rounded-2xl p-10 text-3xl flex flex-col justify-between'>Completed Tasks <span className='text-7xl'>{completedTasks ? completedTasks : 0}</span></div>
                <div className='w-1/4  bg-red-500 m-2 h-50 rounded-2xl p-10 text-3xl flex flex-col justify-between'>Remaining Tasks <span className='text-7xl'>{pendingTasks ? pendingTasks : 0}</span></div>
            </div>

            <div className='h-1/2 mt-5'>
                <TaskList onTaskUpdate={fetchTaskStats} isOpen={openModal} setIsOpen={setOpenModal} setTask={setSelectedTask} deleteTask={removeTask}/>
            </div>

            {openModal && <Popup openModal={setOpenModal} task={selectedTask} setTask={setSelectedTask} onTaskUpdate={fetchTaskStats} deleteTask={removeTask}/>}
        </div>
    )
}

export default EmployeeDashboard