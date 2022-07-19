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