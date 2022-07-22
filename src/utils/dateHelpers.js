export const convertUtcToLocal = (utcDate) => {
    if (!utcDate){
        return "None";
    }
    const date = new Date(utcDate);
    return date.toLocaleDateString();
}

export const getCurrentDate = (separator='/') => {
    const newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${month}${separator}${date}${separator}${year}`;
}