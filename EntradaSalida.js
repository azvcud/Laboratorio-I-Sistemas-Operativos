import { gestionProcesos, configurarAlgoritmoProcesos } from "./Procesador.js";

document.addEventListener("DOMContentLoaded", function () {
    const bt_iniciar            = document.getElementById('ejecutar');
    const bt_agregarProceso     = document.getElementById('agregarProceso');
    const bt_agregarBloqueo     = document.getElementById('agregarBloqueo');
    const bt_crearTabla         = document.getElementById('crearTabla');
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

    function actualizarGrafica(tablaProcesos, estadosProcesos, filas) {
        const fragmento = document.createDocumentFragment();

        contador++;
        coloresGrafica.push(estadosProcesos);
    
        for(let i = 0; i <= filas; i++) {
            const fila = document.createElement("tr");
            
            for(let j = 0; j < contador; j++) {
                const celda = document.createElement("td");
                if(i == filas)
                {
                    celda.style.backgroundColor = "white";
                    celda.style.color = "black";
                    celda.textContent = j + 1;
                    celda.style.fontWeight = "bold";
                }
                else
                { celda.style.backgroundColor = criterioColor(coloresGrafica[j][i]); }
                fila.appendChild(celda);
            }
            fragmento.appendChild(fila);
        }

        tablaProcesos.innerHTML = "";
        tablaProcesos.appendChild(fragmento);
        window.scrollTo({left: document.body.scrollWidth});
    }

    function actualizarGrafica_curry(tablaProcesos) {
        return function(estadosProcesos, filas) {
            actualizarGrafica(tablaProcesos, estadosProcesos, filas);
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

    const crearTabla = (filas, columnas, div_contenedorTabla) => {
        div_contenedorTabla.innerHTML = "";

        const tabla = document.createElement("table");

        for(let i = 0; i < filas; i++) {
            const fila = document.createElement("tr");
            for(let j = 0; j < columnas; j++) {
                const celda = document.createElement("td");
                fila.appendChild(celda);
            }
            tabla.appendChild(fila); 
        }

        div_contenedorTabla.appendChild(tabla);
    }

    /*-----------------------------------------------------------------------*/
    bt_iniciar.addEventListener('click',  () => iniciarProcesador(
        interfazWeb, 
        ip_tiempoCiclos,
        sel_algPlanificacion,
        ip_quantum,
        div_contenedorTabla
    ));

    bt_agregarProceso.addEventListener('click', () => agregarProceso(table_procesos));
    bt_agregarBloqueo.addEventListener('click', () => agregarBloqueo(table_bloqueos));
    bt_crearTabla.addEventListener('click', () => crearTabla(7, 124, div_contenedorTabla));
    sel_algPlanificacion.addEventListener('change', () => autorizacionCampo_quantum(sel_algPlanificacion, ip_quantum));
});