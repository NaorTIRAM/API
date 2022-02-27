
export function isUnique(array, value, arg_name){
    for (let i =0; i<array.length; i++) {
        if (array[i][arg_name] == value) {
            return Promise.reject('ID taken')
        }
    }
    return true;
}

export function isDateSmaller(date1,date2){
    //this funciton receives two dates and returns true if date1<=date2, else false
    date1 = new Date(date1)
    date2 = new Date(date2)
    if(date1<=date2)
        return true;
    return false;
}

export function getAllByID(arr, id, arg_name){
    let tmp = [];
    for (let i =0; i<arr.length; i++)
        if (arr[i][arg_name] == id)
            tmp.push(arr[i]);
    return tmp;
}

export function getSingleByID(arr, id, arg_name){
    let tmp;
    for (let i =0; i<arr.length; i++)
        if (arr[i][arg_name] == id){
            tmp = arr[i];
            break;
        }
    return tmp;
}