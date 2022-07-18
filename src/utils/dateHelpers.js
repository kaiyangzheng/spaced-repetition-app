const convertUtcToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString();
}

export default convertUtcToLocal;