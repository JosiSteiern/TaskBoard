/*
    Reorganizar funções
    Tratativa de erros inesperados
    import e export
    salvar em localStorage as infos do usuário
    dropdown - boards
*/
import {API_BASE_URL} from "../../config/infoAPI.js"
import { saveLocalStorage } from "../localStorage/saveLocalSt.js";

const mensagem = document.getElementById("msg-login");
const botaoEnviar = document.getElementById("botao-enviar");

document.getElementById("login").addEventListener("submit", async (event)=>{
    event.preventDefault();
    estadoBotao(true);

    const email = document.getElementById("email").value;
    const emailExiste = await verificaEmail(email);
    
    if(emailExiste){
        document.getElementById("login").reset();
        window.location.href = "/Telas/Boards.html"
    }
    else {
        document.getElementById("login").reset();
        estadoBotao(false);
    }

})

async function verificaEmail(email){
    
    try {
        const response = await fetch(`${API_BASE_URL}/GetPersonByEmail?Email=${email}`);
        if(!response.ok){
            if(response.status == 422){
                const resultado = await(response.json());
                mensagemErro(resultado.Errors[0]);
                return false;
            }  
            else {
                mensagemErro("Erro inesperado ocorreu, tente novamente");
                return false;
            }
        }
       
        const result = await response.json();
        console.log(result);

       if (result.Email === email){
            saveLocalStorage("user", {id: result.Id, nome: result.Name, email: result.Email});
            return true;
        }

    } catch (error) {
        console.error("Erro ao verificar o e-mail", error);
        mensagemErro("Falha ao se comunicar com o servidor, tente novamente mais tarde");
        return false; 
    }
    finally{
        estadoBotao(false);
    }
}

function mensagemErro(texto){
    mensagem.innerText = `${texto}`;
}

function estadoBotao(desabilita){
    botaoEnviar.disabled = desabilita;
    botaoEnviar.textContent = desabilita ? "Carregando..." : "Acessar";
}