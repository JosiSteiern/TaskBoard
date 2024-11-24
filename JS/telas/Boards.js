import {API_BASE_URL} from "../../config/infoAPI.js"
import {resgatarLocalStorage} from "../localStorage/saveLocalSt.js";

const botaoDrop = document.getElementById("mydropdown")

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
            throw new Error ("Erro ao carregar informações");
            return;
        }
        const boards = await (response.json())
        console.log(boards)
        boards.forEach((board) => {
            let lista = document.createElement("li");
            lista.innerHTML = `<a id="${board.Id}">${board.Name}</a>`
            content.appendChild(lista);
            console.log(lista)
        });
    }
    catch(error){

    }
}

function recuperaUserInfo() {
    let greeting = document.getElementById("greetingmsg");
    const infoLS = resgatarLocalStorage("user");

    if(infoLS){
      greeting.innerText = `Olá, ${infoLS.nome.split(" ")[0]}`;
    }
    else{
      greeting.innerText = "Bem-vindo";
    }

}

 
boardsInfo();
recuperaUserInfo();