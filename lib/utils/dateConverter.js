export const convertDate = (year, month, day) => {
    const date = new Date(year, month, day).toLocaleDateString();

    return date;
}