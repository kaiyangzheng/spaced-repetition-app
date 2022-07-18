const convertUtcToLocal = (utcDate) => {
    if (!utcDate){
        return "None";
    }
    const date = new Date(utcDate);
    return date.toLocaleDateString();
}

export default convertUtcToLocal;