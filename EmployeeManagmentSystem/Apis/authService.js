import api from "./api";

export const authService = {

    login: async (email,password) => {
        try{

            const response = await api.post('/auth/login',{email,password});
            if(response.data.token){
                localStorage.setItem('token',response.data.token);
                localStorage.setItem('currentUser',JSON.stringify(response.data.name))
            }
            return response.data

        }catch(e){
            console.log(e)
        }
    },

    signup: async (name,email,password,role) => {

        try{
            const response = await api.post('/auth/register',{name,email,password,role})
            console.log(response.data)

            return response.data
        }catch(e){
            console.log(e)
        }

    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token')
    },

    getCurrentUser: async () => {
        try{
            const response = await api.get('/auth/getCurrentUser');
            return response.data
        }catch(e){
            console.log("Failed to fetch current User");
            console.log(e)
        }
    }



}