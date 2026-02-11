const lblPending = document.getElementById("lbl-pending");
const deskHeader = document.querySelector("h1");
const noMoreAlert = document.querySelector(".alert");

const btnDraw = document.getElementById("btn-draw");
const btnDone = document.getElementById("btn-done");
const lblCurrentTicket = document.getElementById("lbl-current-ticket");

const searchParams = new URLSearchParams(location.search);
// console.log(searchParams)
if(!searchParams.has('escritorio')){
  location = 'index.html';
  throw new Error('Desk is required')
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null;

deskHeader.innerText = deskNumber;


function checkTicketCount(currentCount = 0){
  if(currentCount === 0){
    noMoreAlert.classList.remove('d-none');
  }else{
    noMoreAlert.classList.add('d-none')
  }
  lblPending.innerText = currentCount;
}

async function loadInitialCount(){
  const pendingTickets = await fetch("/api/ticket/pending").then((res)=>res.json());
  checkTicketCount(pendingTickets.length)
}

async function getTicket(){
  await finishTicket();
  const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`).then((res)=>res.json());
  if(status === 'error'){
    lblCurrentTicket.innerText = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicket.innerText = ticket.number;
}

async function finishTicket(){
  if(!workingTicket) return;

  const {status, message} = await fetch(`/api/ticket/done/${workingTicket.id}`,{method: 'PUT'})
    .then((res)=>res.json())

  console.log({status, message})

  if(status === 'ok'){
    workingTicket = null;
    lblCurrentTicket.innerText = "Nadie";
  }
}

function connectToWebSockets() {
  const socket = new WebSocket( 'ws://localhost:9000/ws' );

  socket.onmessage = ( event ) => {
    const {type, payload} = JSON.parse(event.data);
    if(type !== 'on-ticket-count-changed') return;
    checkTicketCount(payload);
  };

  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };

}

btnDraw.addEventListener("click", getTicket);
btnDone.addEventListener("click", finishTicket);

loadInitialCount();
connectToWebSockets();