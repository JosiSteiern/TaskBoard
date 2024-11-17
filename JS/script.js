var pessoa = [];

document.getElementById("login").addEventListener("submit", async (event)=>{
    event.preventDefault();
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("msg-login");
    const emailExiste = await verificaEmail(email);

    console.log(emailExiste)
    console.log(pessoa);
    
    if(emailExiste){
        document.getElementById("login").reset();
        window.location.href = "/Telas/Boards.html"
    }
    else {
        
    }

})

async function verificaEmail(email){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };


    try {
        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/GetPersonByEmail?Email=${email}`, requestOptions);
        if (response.status !== 200){
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
