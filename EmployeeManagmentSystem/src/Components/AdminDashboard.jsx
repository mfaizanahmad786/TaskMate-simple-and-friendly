import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../Apis/authService';
import { taskService } from '../../Apis/taskService';
import AdminPopup from './AdminPopup';

const AdminDashboard = () => {

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [tasks, setTasks] = useState([])
    const [assignedTo, setAssignedTo] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState()

    const handleLogout = () => {
        authService.logout()
        navigate('/', { replace: true });
    }

    const fetchTasks = async () => {
        try {
            const user = await authService.getCurrentUser()
            setCurrentUser(user)

            const taskData = await taskService.getAllTasks();
            setTasks(taskData)
        } catch (e) {
            console.log(e);
            console.log("failed to fetch tasks")
        }
    }

    useEffect(() => { fetchTasks() }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !date || !assignedTo || !description) {
            window.alert("Please fill all fields");
            return;
        }

        try {
            await taskService.createTask({
                title,
                date,
                assignedTo,
                category,
                description
            })

            setTitle("");
            setDate("");
            setAssignedTo("");
            setCategory("");
            setDescription("");

            setTimeout(() => {
                fetchTasks();
            }, 500);

        } catch (e) {
            console.log(e)
        }


    }



    return (
        // Changed back to w-screen and added padding-bottom
        <div className="bg-gray-800 min-h-screen w-screen overflow-y-auto overflow-x-hiddenpb-10">
            {/* Header section */}
            <div className='flex justify-between'>
                <div className="header pt-10 ">
                    <div className='text-3xl mt-2 ml-10'>Admin Dashboard</div>
                    <div className='text-5xl mt-5 ml-10 font-bold'>Welcome, {currentUser ? currentUser.name : "Loading"}👋</div>
                </div>
                <div className='mt-20 mr-20'>
                    <button className='py-2 px-2 bg-[#BF0436] ' onClick={() => handleLogout()}>Log out</button>
                </div>

            </div>
            {/* Form section */}
            <div className='mt-2 w-[95%] ml-10 bg-gray-900 rounded p-4'>
                <form action="" onSubmit={(e) => handleSubmit(e)} className='flex'>
                    <div className='flex flex-col gap-5 mr-[200px] w-[40%]'>
                        <label htmlFor="Title" className='text-lg font-medium ml-5 mt-3'>Task Title</label>
                        <input type="text" id='Title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Make the button smaller' className='ml-5 w-[90%] border-2 p-2 rounded mt-[-20px]' />

                        <label htmlFor="date" className='text-lg font-medium ml-5 mt-3'>Date</label>
                        <input type="date" id='date' value={date} onChange={(e) => setDate(e.target.value)} className='w-[90%] mt-[-20px] ml-5 border-2 p-2 rounded' />

                        <label htmlFor="Assignment" className='text-lg font-medium ml-5 mt-3'>Assign To</label>
                        <input type="text" id='Assignment' value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder='Employee Name' className='w-[90%] mt-[-20px] ml-5 border-2 p-2 rounded' />

                        <label htmlFor="category" className='text-lg font-medium ml-5 mt-3'>Category</label>
                        <input type="text" id='category' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Creative, Dev etc' className='w-[90%] mt-[-20px] ml-5 border-2 p-2 rounded' />
                    </div>

                    <div className='flex flex-col w-[45%]'>
                        <label htmlFor="description" className='text-lg font-medium ml-5 mt-3'>Task Description</label>
                        <textarea
                            id='description'
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            className='h-[70%] border-2 border-red-200 w-full mt-2 p-2 resize-none'
                            placeholder='Enter task description...'
                        ></textarea>
                        <button className='mt-5 bg-[#02733E] hover:bg-[#038C4C]'>Submit</button>
                    </div>
                </form>
            </div>

            {/* Tasks list section */}


            <div className='mt-2 w-[95%] ml-10 bg-gray-900 rounded p-4'>
                <div className='max-h-[60vh] overflow-y-auto'>



                    {tasks.map((task, index) => (
                        <div className='bg-[#8373bf] py-3 px-5 flex justify-between rounded m-3 mt-3 text-lg' key={index}>
                            <div>{task.assignedTo.name}</div>
                            <div className=''>{task.title}</div>
                            <div className='flex gap-5'>
                                <div className={`font-semibold mt-2 ${task.status === "Pending" ? 'text-[#dcce2a]' : 'text-[#3bfd28]'}`}>{task.status}</div>
                                {task.acceptanceStatus === "Rejected" && task.status !== "Completed" ?
                                    <div >
                                        <button className='py-1 px-1 bg-[#BF0436]'
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setIsOpen(true);
                                            }
                                            }>See Details</button>
                                    </div> : <></>}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            {isOpen && <AdminPopup openModal={setIsOpen} selectedTask={selectedTask} />}
        </div>

    )
}

export default AdminDashboard