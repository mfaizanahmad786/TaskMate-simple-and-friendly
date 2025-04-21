import React, { useState } from 'react'
import { taskService } from '../../Apis/taskService';


const Popup = ({deleteTask, onTaskUpdate,openModal, task, setTask }) => {
  const [feedback, setFeedback] = useState('');

  const sendFeedback = async (id, data) => {
    try {
      if (!feedback) {
        window.alert("Please enter feedback")
        return;
      }

      const requestData = {
        response:"Rejected",
        feedback:data
      }
      const response = await taskService.respondToTask(id,requestData)
      console.log(response)

      deleteTask(id)

      if(onTaskUpdate){
        onTaskUpdate()
      }

    } catch (e) {
      console.log(e)
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => openModal(false)}
      ></div>


      <div
        className="relative bg-gray-800 rounded-xl shadow-2xl w-150 h-80 p-6 z-60 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={() => openModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <p className="text-2xl font-bold text-white mb-4 text-center">
          Enter Rejection Feedback
        </p>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Explain why you're rejecting this task..."
          className="w-full h-32 p-3 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />


        <div className="flex justify-between space-x-4">
          <button
            onClick={() => openModal(false)}
            className="flex-1 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              sendFeedback(task._id,feedback)
              openModal(false);
            }}
            disabled={!feedback.trim()}
            className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup