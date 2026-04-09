const API_URL = 'http://localhost:3001/events'

// elementos
const statusRunning = document.getElementById('b_ativo')
const statusSleep = document.getElementById('b_desativado')

const taxaEl = document.getElementById('server_dd_taxa')     // AGORA: status_robo
const statusEl = document.getElementById('server_dd_status') // status
const logTimeEl = document.getElementById('server_dd_log')   // horário

const vermelhoEl = document.querySelector('#contagem_vermelho div')
const pretoEl = document.querySelector('#contagem_preta div')
const prataEl = document.querySelector('#contagem_prata div')

const logListEl = document.getElementById('mensagem_s')

// conexão SSE
const source = new EventSource(API_URL)

// últimos 3 logs
let lastLogs = []

// horário do último evento
function updateLastLogTime() {
  const time = new Date().toLocaleTimeString()
  logTimeEl.textContent = time
}

// lista de logs
function updateLogList() {
  logListEl.innerHTML = lastLogs
    .map(log => `<div style="border-bottom:1px solid #ccc; padding:4px 0;">${log}</div>`)
    .join('')
}

// conexão aberta
source.onopen = () => {
  const time = new Date().toLocaleTimeString()

  lastLogs.unshift(`[${time}] Conectado`)
  if (lastLogs.length > 3) lastLogs.pop()

  updateLastLogTime()
  updateLogList()
}

// recebendo dados
source.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data)

    console.log('Dados recebidos:', data)

    const time = new Date().toLocaleTimeString()

    // salva log
    lastLogs.unshift(`[${time}] ${JSON.stringify(data)}`)
    if (lastLogs.length > 3) lastLogs.pop()

    updateLastLogTime()
    updateLogList()

    // ✅ STATUS DO ROBÔ (texto)
    const statusValue = data.status || data.machine_status || data.estado

    if (statusValue !== undefined) {
      statusEl.textContent = statusValue

      if (statusValue === 'Running') {
        statusRunning.style.background = 'green'
        statusSleep.style.background = 'gray'
      } else {
        statusRunning.style.background = 'gray'
        statusSleep.style.background = 'red'
      }
    }

    // ✅ NOVA FUNÇÃO → mostrar status_robo na taxa
    if (data.status_robo !== undefined) {
      taxaEl.textContent = data.status_robo
    }

    // contagem
    if (data.vermelho !== undefined) {
      vermelhoEl.textContent = data.vermelho
    }

    if (data.preto !== undefined) {
      pretoEl.textContent = data.preto
    }

    if (data.prata !== undefined) {
      prataEl.textContent = data.prata
    }

  } catch (err) {
    console.error(err)

    const time = new Date().toLocaleTimeString()
    lastLogs.unshift(`[${time}] Erro ao processar`)
    if (lastLogs.length > 3) lastLogs.pop()

    logTimeEl.textContent = 'Erro'
    updateLogList()
  }
}

// erro
source.onerror = () => {
  const time = new Date().toLocaleTimeString()

  lastLogs.unshift(`[${time}] Desconectado`)
  if (lastLogs.length > 3) lastLogs.pop()

  logTimeEl.textContent = 'Erro'
  updateLogList()
}