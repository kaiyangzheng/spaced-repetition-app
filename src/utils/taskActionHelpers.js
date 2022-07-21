import axiosInstance from './../axiosApi';

export function deleteTask(id){
    axiosInstance.delete(`/tasks/api/${id}/`)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

export async function updateTask(id, data){
    await axiosInstance.put(`/tasks/api/${id}/`, data)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.log(err);
    })
}
