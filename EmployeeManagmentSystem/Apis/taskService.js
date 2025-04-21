import api from "./api";

export const taskService = {

    getAllTasks : async () =>{
        try{
            const response = await api.get('/tasks');
            return response.data
        }catch(e){
            console.log(e)
        }
    },

    getOneTask : async (id) => {
        try{
            const response = await api.get(`/tasks/${id}`)
            return response.data
        }catch(e){
            console.log(e)
        }
    },

    createTask : async (taskData) =>{
        try{
            const response = api.post('/tasks',taskData);
            return response.data
        }catch(e){
            console.log(e)
        }
    },

    updateTask : async (id,status) =>{
        try{
            const response = api.put(`/tasks/${id}`,status)
            return response.data;
        }catch(e){
            console.log(e)
        }
    },

    deleteTask : async (id) =>{
        try{
            const response = api.delete(`/tasks/${id}`)
            return response.data;
        }catch(e){
            console.log(e)
        }
    },

    getTaskResponses : async () =>{
        try{
            const response = api.get('/tasks/responses')
            return response.data;
        }catch(e){
            console.log(e)
        }
    },

    respondToTask : async (id,data) =>{
        try{
            const response = await api.post(`/tasks/${id}/respond`,data)
            return response.data
        }catch(e){
            console.log(e)
        }
    },

    getTaskStats : async () =>{
        try{
            const response = await api.get('tasks/taskStats');
            return response.data
        }catch(e){
            console.log(e)
        }
    }




}