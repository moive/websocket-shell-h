
const currentTicketLbl = document.getElementById("lbl-new-ticket");
const createTicketBtn = document.querySelector("button");


async function getLastTicket(){
  const lastTicket = await fetch("/api/ticket/last").then((res)=>res.json());
  currentTicketLbl.innerText = lastTicket;
}

async function createTicket(){
  const lastTicket = await fetch("/api/ticket",{
    method: 'POST'
  }).then((res)=>res.json());

  currentTicketLbl.innerText = lastTicket.number;
}

createTicketBtn.addEventListener("click", createTicket);

getLastTicket();