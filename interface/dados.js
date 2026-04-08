const API_URL = 'http://localhost:3001/events'

const statusEl = document.getElementById('status')
const outputEl = document.getElementById('output')
const info_log = document.getElementById('info_log')

let connected = false
let data = null

const source = new EventSource(API_URL)

// conexão aberta
source.onopen = () => {
  connected = true
  statusEl.textContent = 'Conectado'
  statusEl.classList.remove('offline')
  statusEl.classList.add('online')

  console.log('[SSE] Conectado')
}

// recebendo dados
source.onmessage = (e) => {
  try {
    data = JSON.parse(e.data)

    console.log('[SSE] Dados:', data)

    outputEl.textContent = JSON.stringify(data, null, 2)
    info_log.innerHTML = `<p>${data}</p>`
  } catch (err) {
    console.error('Erro ao parsear JSON:', err);
    
  }

}


// erro / desconexão
source.onerror = () => {
  connected = false
  statusEl.textContent = 'Desconectado'
  statusEl.classList.remove('online')
  statusEl.classList.add('offline')

  console.warn('[SSE] Desconectado')
}