export const saveLocalStorage = (chave, valor) =>{
    localStorage.setItem(chave, JSON.stringify(valor));
}

export const resgatarLocalStorage = (item) =>{
    const valor = localStorage.getItem(item);
    return valor ? JSON.parse(valor) : null;
}