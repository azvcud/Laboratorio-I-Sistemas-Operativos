import { gestionProcesos, configurarAlgoritmoProcesos } from "./Procesador.js";

document.addEventListener("DOMContentLoaded", function () {
    const bt_iniciar            = document.getElementById('ejecutar');
    const bt_agregarProceso     = document.getElementById('agregarProceso');
    const bt_agregarBloqueo     = document.getElementById('agregarBloqueo');
    const div_terminal          = document.getElementById('terminal1');
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

    /*----------------------------------------------------------------------*/
    const iniciarProcesador = (interfaz, ip_tiempoCiclos, sel_algPlanificacion, ip_quantum) => {
        const tiempoCiclos              = parseInt(ip_tiempoCiclos.value, 10);
        const algoritmoPlanificacion    = sel_algPlanificacion.value;

        if(sel_algPlanificacion.value != "RR")
        { quantum = 0; }
        else
        { quantum = parseInt(ip_quantum.value, 10); }

        interfaz(algoritmoPlanificacion);
        
        configurarAlgoritmoProcesos(algoritmoPlanificacion, quantum);
        gestionProcesos(interfaz, tiempoCiclos);
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


    const agregarProceso = (table_procesos) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
        <tbody>
            <td>ARP</td>
            <td>ISP</td>
            <td>EIGRP</td>
            <td>STP</td>
        </tbody>
        `;

        table_procesos.appendChild(fila);
    };

    const agregarBloqueo = (table_bloqueos) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
        <tbody>
            <td>ARP</td>
            <td>ISP</td>
            <td>EIGRP</td>
        </tbody>
        `;

        table_bloqueos.appendChild(fila);
    };

    /*-----------------------------------------------------------------------*/
    bt_iniciar.addEventListener('click',  () => iniciarProcesador(
        interfazWeb, 
        ip_tiempoCiclos,
        sel_algPlanificacion,
        ip_quantum,
    ));

    bt_agregarProceso.addEventListener('click', () => agregarProceso(table_procesos));
    bt_agregarBloqueo.addEventListener('click', () => agregarBloqueo(table_bloqueos));
    sel_algPlanificacion.addEventListener('change', () => autorizacionCampo_quantum(sel_algPlanificacion, ip_quantum));
});