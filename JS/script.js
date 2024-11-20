/*
    Reorganizar funções
    Tratativa de erros inesperados
    Botão - abilitar e desabilitar (carregando...)
    finaly
    import e export
    salvar em localStorage as infos do usuário
    dropdown - boards
*/

var pessoa = [];
const mensagem = document.getElementById("msg-login");

document.getElementById("login").addEventListener("submit", async (event)=>{
    event.preventDefault();
    const email = document.getElementById("email").value;
    const emailExiste = await verificaEmail(email);

    console.log(emailExiste)
    console.log(pessoa);
    
    if(emailExiste){
        document.getElementById("login").reset();
        window.location.href = "/Telas/Boards.html"
    }
    else {
        document.getElementById("login").reset();
    }

})

async function verificaEmail(email){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/GetPersonByEmail?Email=${email}`, requestOptions);
        // reorganizar msg de erros
        if(response.status == 422){
            mensagem.innerText = "Email não encontrado";
            return false;
        } 
        else if (response.status !== 200){
            return false;
        }
        const result = await response.json();
        console.log(result);

       if (result.Email === email){
            pessoa = result;
            return true;
        }

    } catch (error) {
        console.error("Erro ao verificar o e-mail", error);
        return false; 
    }
}
