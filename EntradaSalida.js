import { gestionProcesos, configurarAlgoritmoProcesos } from "./Procesador.js";

document.addEventListener("DOMContentLoaded", function () {
    const bt_iniciar            = document.getElementById('ejecutar');
    const bt_agregarProceso     = document.getElementById('agregarProceso');
    const bt_agregarBloqueo     = document.getElementById('agregarBloqueo');
    const bt_actualizarProcesos = document.getElementById('actualizarProcesos');
    const bt_actualizarBloqueos = document.getElementById('actualizarBloqueos');
    const bt_eliminarProceso    = document.getElementById('eliminarProceso');
    const bt_eliminarBloqueo    = document.getElementById('eliminarBloqueo');
    const div_terminal          = document.getElementById('terminal1');
    const div_contenedorTabla   = document.getElementById('contenedorTabla');
    const ip_tiempoCiclos       = document.getElementById('tiempociclo');
    const ip_quantum            = document.getElementById('quantum');
    const sel_algPlanificacion  = document.getElementById('algoritmoPlanificacion');
    const table_procesos        = document.getElementById('tablaProcesos');
    const table_bloqueos        = document.getElementById('tablaBloqueos');
    /*----------------------------------------------------------------------*/
    function interfazWeb(message) {
        const output = div_terminal;
        const line = document.createElement("p");
        line.className = "line";

        let formattedMessage;

        if (typeof message === "string") {
            formattedMessage = message;
        } else if (message instanceof Set) {
            formattedMessage = `Set(${message.size}) { ${Array.from(message).join(", ")} }`;
        } else if (Array.isArray(message)) {
            formattedMessage = `[${message.join(", ")}]`;
        } else if (typeof message === "object") {
            formattedMessage = JSON.stringify(message, null, 2);
        } else {
            formattedMessage = String(message);
        }

        line.textContent = "> " + formattedMessage;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    };

    let contador = 0;
    let coloresGrafica = [];

    const criterioColor = (estadoProceso) => {
        switch(estadoProceso) {
            case '🟢 Ejecutando':   return "green";
            case '🔴 Bloqueado':    return "red";
            case '🟡 Esperando':    return "grey";
            case '🧊 Quantum':      return "#00FFFF";
            default:                return "black";
        }
    };

    function actualizarGrafica(tablaProcesos, estadosProcesos, filas, nombreProcesos) {
        const fragmentoCiclo    = document.createDocumentFragment();

        contador++;
        coloresGrafica.push(estadosProcesos);
    
        for(let i = 0; i <= filas; i++) {
            const fila = document.createElement("tr");

            for(let j = 0; j < contador; j++) {
                const celdaCiclo    = document.createElement("td");
            
                if(i == filas)
                {
                    celdaCiclo.style.backgroundColor = "white";
                    celdaCiclo.style.color = "black";
                    celdaCiclo.textContent = j + 1;
                    celdaCiclo.style.fontWeight = "bold";
                }
                else
                { celdaCiclo.style.backgroundColor = criterioColor(coloresGrafica[j][i]); }
                
                if(j === 0) {
                    const celdaNombre   = document.createElement("td");

                    celdaNombre.style.backgroundColor = "yellow";
                    celdaNombre.style.color = "black";
                    celdaNombre.textContent = nombreProcesos[i];
                    celdaNombre.style.fontWeight = "bold";

                    fila.appendChild(celdaNombre);
                }

                fila.appendChild(celdaCiclo);
            }
            fragmentoCiclo.appendChild(fila);
        }

        tablaProcesos.innerHTML = "";
        tablaProcesos.appendChild(fragmentoCiclo);
      window.scrollTo({left: document.body.scrollWidth});
    }

    function actualizarGrafica_curry(tablaProcesos) {
        return function(estadosProcesos, filas, nombreProcesos) {
            actualizarGrafica(tablaProcesos, estadosProcesos, filas, nombreProcesos);
        };
    }

    /*----------------------------------------------------------------------*/
    const iniciarProcesador = (interfaz, ip_tiempoCiclos, sel_algPlanificacion, ip_quantum, div_contenedorTabla) => {
        const tiempoCiclos              = parseInt(ip_tiempoCiclos.value, 10);
        const algoritmoPlanificacion    = sel_algPlanificacion.value;
        const tablaProcesos             = document.createElement("table");
        div_contenedorTabla.appendChild(tablaProcesos);

        if(sel_algPlanificacion.value != "RR")
        { quantum = 0; }
        else
        { quantum = parseInt(ip_quantum.value, 10); }

        interfaz(algoritmoPlanificacion);
        
        configurarAlgoritmoProcesos(algoritmoPlanificacion, quantum);
        gestionProcesos(interfaz, actualizarGrafica_curry(tablaProcesos), tiempoCiclos);
    };


    const autorizacionCampo_quantum = (sel_algPlanificacion, ip_quantum) => {
        if(sel_algPlanificacion.value === "RR")
        { ip_quantum.disabled = false; }
        else 
        { 
            ip_quantum.disabled = true; 
            ip_quantum.value = ''; 
        }
    };

    let procesosEnTabla = 0;
    let nombresEnTabla  = 0;
    const agregarProceso = (table_procesos) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td id="nombreProceso${nombresEnTabla}" contenteditable="true">Proceso Z</td>
            <td contenteditable="true">1</td>
            <td contenteditable="true">10</td>
            <td><select id="bloqueoAsignar${procesosEnTabla}">
            </select></td>
        `;

        procesosEnTabla++;
        nombresEnTabla++;
        table_procesos.appendChild(fila);
    };

    let bloqueosEnTabla = 0;
    const agregarBloqueo = (table_bloqueos) => {
        const fila   = document.createElement("tr"); 

        fila.innerHTML = `
        <tbody>
            <td contenteditable="true">5</td>
            <td contenteditable="true">6</td>
            <td id="procesoAsignado${bloqueosEnTabla}"></td>
        </tbody>
        `;

        bloqueosEnTabla++;
        table_bloqueos.appendChild(fila);
    };

    const actualizarProcesos = (table_bloqueos) => {
        const totalFilasBloqueo = table_bloqueos.querySelectorAll('tr').length - 1;
        console.log(totalFilasBloqueo);
        console.log(procesosEnTabla);

        for(let i = 0; i < procesosEnTabla; i++) {
            const selector = document.getElementById(`bloqueoAsignar${i}`);
            selector.innerHTML = '';

            console.log(selector);

            for(let j = 0; j < totalFilasBloqueo; j++) {
                selector.innerHTML += `<option value="nuevo">Bloqueo ${j + 1}</option>`;
            }
            selector.innerHTML += `<option value="nuevo">Ninguno</option>`
        }
    };

    const actualizarBloqueos = (table_procesos) => {
        const totalFilasProceso = table_procesos.querySelectorAll('tr').length - 1; 

        for(let i = 0; i < bloqueosEnTabla; i++) {
            const td_asignacion = document.getElementById(`procesoAsignado${i}`);
            td_asignacion.textContent = '';

            for(let j = 0; j < totalFilasProceso; j++) {
                const selector      = document.getElementById(`bloqueoAsignar${j}`);
                const nombreProceso = document.getElementById(`nombreProceso${j}`);                
                const textoSelector = selector.options[selector.selectedIndex].text;
                const numeroBloqueo = textoSelector.match(/\d+/)?.[0] || null;

                if(i == (numeroBloqueo - 1) && !(numeroBloqueo === null))
                { td_asignacion.textContent += nombreProceso.textContent + ' '; }
            }
        }
    };

    const eliminarProceso = (table_procesos) => {
        const filas = table_procesos.getElementsByTagName('tr');

        if (filas.length > 1) { //1 por la cabecera de la tabla
            const ultimaFila = filas[filas.length - 1];
            ultimaFila.remove();
        }

        procesosEnTabla--;
        nombresEnTabla--;
    }

    const eliminarBloqueo = (table_bloqueos) => {
        const filas = table_bloqueos.getElementsByTagName('tr');

        if (filas.length > 1) { //1 por la cabecera de la tabla
            const ultimaFila = filas[filas.length - 1];
            ultimaFila.remove();
        }

        bloqueosEnTabla--;
    }

    /*-----------------------------------------------------------------------*/
    bt_iniciar.addEventListener('click',  () => iniciarProcesador(
        interfazWeb, 
        ip_tiempoCiclos,
        sel_algPlanificacion,
        ip_quantum,
        div_contenedorTabla
    ));

    bt_agregarProceso.addEventListener('click', () => agregarProceso(table_procesos, table_bloqueos));
    bt_agregarBloqueo.addEventListener('click', () => agregarBloqueo(table_bloqueos, table_procesos));
    bt_actualizarProcesos.addEventListener('click', () => actualizarProcesos(table_bloqueos));
    bt_actualizarBloqueos.addEventListener('click', () => actualizarBloqueos(table_procesos));
    bt_eliminarProceso.addEventListener('click', () => eliminarProceso(table_procesos));
    bt_eliminarBloqueo.addEventListener('click', () => eliminarBloqueo(table_bloqueos));
    sel_algPlanificacion.addEventListener('change', () => autorizacionCampo_quantum(sel_algPlanificacion, ip_quantum));
});