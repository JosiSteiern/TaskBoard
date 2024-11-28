import {API_BASE_URL} from "../../config/infoAPI.js"
import {resgatarLocalStorage} from "../localStorage/saveLocalSt.js";

const botaoDrop = document.getElementById("mydropdown")
const infoLS = resgatarLocalStorage("user");
const boardContent = document.getElementById("board-content")


document.getElementById("btndrop").addEventListener("click", ()=> {
    botaoDrop.classList.toggle("show");
  })

  window.onclick = function(event) {
    if (!event.target.matches('.botao-dropdown')) {
      var dropdowns = document.getElementsByClassName("content-dropdown");
      
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

async function boardsInfo(){
    let content = document.getElementById("mydropdown");

    try {
        const response = await fetch(`${API_BASE_URL}/Boards`)
        if (!response.ok){
          throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
        }
        const boards = await (response.json())
        
        if (!boards || boards.length === 0) {
          throw new Error("Nenhum dado encontrado nos boards.");
      }

        boards.forEach((board) => {
            let lista = document.createElement("li");
            lista.innerHTML = `<a id="${board.Id}">${board.Name}</a>`
            lista.addEventListener("click", (event)=>{
              console.log(board.Id)
              chamaBoard(board.Id);
            })
            content.appendChild(lista);
        });
    }
    catch(error){
      console.error("Erro ao buscar informações dos boards:", error);
      content.innerHTML = `<li>Erro ao carregar informações. Por favor, tente novamente mais tarde.</li>`;
    }
}

function recuperaUserInfo() {
    let greeting = document.getElementById("greetingmsg");

    if(infoLS){
      greeting.innerText = `Olá, ${infoLS.nome.split(" ")[0]}`;
    }
    else{
      greeting.innerText = "Bem-vindo";
    }

}

document.getElementById("logOut").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../index.html"
})

async function chamaBoard(boardId){

  try{
    const response = await fetch(`${API_BASE_URL}/Board?BoardId=${boardId}`)
    if(!response.ok){
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await (response.json());
    console.log(result);
    if(result){
      carregaColunas(result.Id);
    }
    
  }
  catch(error){
    console.error("Erro ao recuperar tema:", error);
  }

}

async function carregaColunas(boardId){

  try{
    const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`)
    if(!response.ok){
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await (response.json());
    if(result){
      criaColunas(result);
    }
  }
  catch(error){
    console.error("Erro:", error);
  }
}

async function getTasks(columnId) {
  try{
    const response = await fetch(`${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`)
    if(!response.ok){
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    if(result){
      return result;
    }
  }
  catch(error){
    console.error("Erro:", error);
  }
}

function criaColunas(colunas){

  colunas.forEach((coluna)=>{
    let tasks = getTasks(coluna.Id);
    console.log(tasks)

    let elemento = document.createElement('div');
    elemento.className = 'column';
    elemento.innerHTML = `
    <h2 class="colunas-titulo">${coluna.Name}</h2>
    <div>${tasks.Description}</div>
    `
    boardContent.appendChild(elemento);
    
  })
}




const trilho = document.getElementById("trilho")
const body = document.querySelector("body");
const tituloLogo = document.getElementById("titulo-logo");
const cabecalho = document.querySelector(".cabecalho");
const navBar = document.querySelector(".navBar");
const btnLogout = document.getElementById("logOut"); 
const dropButton = document.getElementById("btndrop");
const contentBoard = document.querySelector(".content-boards");

trilho.addEventListener("click", ()=>{
  let temaAtual = modificaTema();
  console.log(temaAtual)
  salvarNovoTema(infoLS.id, temaAtual);
})

function modificaTema(){
  trilho.classList.toggle('dark');
  body.classList.toggle('dark');
  tituloLogo.classList.toggle('dark');
  cabecalho.classList.toggle('dark');
  navBar.classList.toggle('dark');
  btnLogout.classList.toggle('dark');
  dropButton.classList.toggle('dark');
  contentBoard.classList.toggle('dark');

  if(trilho.classList.contains('dark') && body.classList.contains('dark') && tituloLogo.classList.contains('dark') && 
    cabecalho.classList.contains('dark') && navBar.classList.contains('dark') && btnLogout.classList.contains('dark') && dropButton.classList.contains('dark') && contentBoard.classList.contains('dark')){
    return 1;
  }
  else{
    return 2;
  }
}

async function recuperaTema(){
  
  try {
    const response = await fetch (`${API_BASE_URL}/PersonConfigById?PersonId=${infoLS.id}`)
    if (!response.ok){
      throw new Error(`Erro ao carregar informações: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    if(result.DefaultThemeId === 1){
      modificaTema();
    }
  }
  catch (error) {
    console.error("Erro ao recuperar tema:", error);
  }
}

async function salvarNovoTema(id, novoTema) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "ThemeId": novoTema
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/ConfigPersonTheme?PersonId=${id}`, requestOptions);
    if (!response.ok) {
      throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Erro ao salvar informações:", error);
  }
}


window.onload = () =>{
  boardsInfo();
  recuperaUserInfo();
  recuperaTema();
}