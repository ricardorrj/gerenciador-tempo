let counter = 0;

function saveTime() {    
    const inicio = document.querySelector('#hrInicio').textContent;
    const tempo = timeDifference(inicio, getHoraAtual());

    geraLinhaParaTableHistory(inicio, tempo)
    
    let atualTime = document.getElementById("total-time");
    atualTime.textContent = somaIntervalos(atualTime.textContent, tempo);

    showTemporaryAlert();
}

function geraLinhaParaTableHistory(inicio, tempo) {
    let tabela = document.getElementById("history").getElementsByTagName('tbody')[0];
    let novaLinha = tabela.insertRow(tabela.rows.length);
    let descricao = novaLinha.insertCell(0);
    let hrInicial = novaLinha.insertCell(1);
    let hrFinal = novaLinha.insertCell(2);
    let total = novaLinha.insertCell(3);

    hrInicial.innerHTML = inicio;
    hrFinal.innerHTML = somaIntervalos(inicio, tempo);
    total.innerHTML = tempo;
    descricao.innerHTML = document.querySelector('#description').value;
}

function showTemporaryAlert() {
    var alertElement = document.getElementById("alert");
    alertElement.style.display = "block";
    setTimeout(function() {
      alertElement.style.display = "none";
    }, 2200);
}
 
function updateCounter(tempoInit) {
    document.querySelector('.timer').textContent = tempoInit;

    if (tempoInit == "00:00:00") {
        counter = 0;
    } else {
        const [horasAtual, minutosAtual, segundosAtual] = tempoInit.split(":").map(Number);
        counter = (((horasAtual * 60) * 60) + (minutosAtual * 60) + segundosAtual)
    }

    timer = setInterval(function() {
        counter++;
        let hours = Math.floor(counter / 3600);
        let minutes = Math.floor((counter % 3600) / 60);
        let seconds = Math.floor(counter % 60);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        document.querySelector('.timer').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000); 
}

function startCount() {   
    let description = document.querySelector('#description');
    if (description?.value.length <= 1) {
        var alertElement = document.getElementById("alert-descricao");
        alertElement.style.display = "block";
        setTimeout(function() {
          alertElement.style.display = "none";
        }, 2200);

        return;
    }
    
    document.getElementById("hrInicio").innerHTML = getHoraAtual();
    document.querySelector('.start').disabled = true;
    document.querySelector('.stop').disabled = false;
    description.disabled = true;
	updateCounter("00:00:00");
}

function getHoraAtual() {
    const agora = new Date();
    const horas = agora.getHours();
    const minutos = agora.getMinutes();
    const segundos = agora.getSeconds();

    return horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
}

function getDataAtual() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro 0!
    let yyyy = today.getFullYear();
    
    return dd + '/' + mm + '/' + yyyy; 
}

function somaIntervalos(atualTime, time) {
    const [horasAtual, minutosAtual, segundosAtual] = time.split(":").map(Number);
    const [horasTotalTime, minutosTotalTime, segundosTotalTime] = atualTime.split(":").map(Number);

    let totalSegundos = segundosAtual + segundosTotalTime;
    let totalMinutos = minutosAtual + minutosTotalTime + Math.floor(totalSegundos / 60);
    let totalHoras = horasAtual + horasTotalTime + Math.floor(totalMinutos / 60);

    const segundos = totalSegundos % 60;
    const minutos = totalMinutos % 60;
    const horas = totalHoras % 24;
    const totalTimeString = `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
    
    return totalTimeString;
}

function timeDifference(start, end) {
    var startTime = start.split(":");
    var endTime = end.split(":");
    var startSeconds = (+startTime[0]) * 60 * 60 + (+startTime[1]) * 60 + (+startTime[2]);
    var endSeconds = (+endTime[0]) * 60 * 60 + (+endTime[1]) * 60 + (+endTime[2]);
    var diffSeconds = endSeconds - startSeconds;
    var hours = Math.floor(diffSeconds / 3600);
    var minutes = Math.floor((diffSeconds - (hours * 3600)) / 60);
    var seconds = diffSeconds - (hours * 3600) - (minutes * 60);
  
    return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

function stopCount() {
    if (document.querySelector('.timer').textContent == "00:00:00") {
        return;
    }

    clearInterval(timer);
	saveTime();

    document.querySelector('.timer').textContent = "00:00:00";
    document.getElementById("description").disabled = false;
    document.querySelector('.start').disabled = false;
    document.querySelector('.stop').disabled = true;
    document.getElementById("description").value = '';
    document.getElementById("hrInicio").innerHTML = null;
}

function exportToExcel() {
    const table = document.getElementById("history");
    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });

    XLSX.writeFile(wb, 'registros_'+getDataAtual()+' - '+getHoraAtual()+'.xlsx');

    const confirmReload = confirm("Deseja limpar os dados e Recomeçar?");
    if (confirmReload) {
        location.reload();
    }
}

window.addEventListener('focus', function() {
    let time = document.querySelector('.timer').textContent;
    const inicio = document.querySelector('#hrInicio').textContent;
    const dif = timeDifference(inicio, getHoraAtual());

    if (time == "00:00:00" || time == dif) {
        return;
    }

    clearInterval(timer);
    updateCounter(dif)
});
  
document.querySelector('.start').addEventListener('click', startCount);
document.querySelector('.stop').addEventListener('click', stopCount);

