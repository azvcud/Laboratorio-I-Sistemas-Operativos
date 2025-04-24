import { gestionProcesos, configurarAlgoritmoProcesos, configurarProcesosYBloqueos } from "./Procesador.js";

document.addEventListener("DOMContentLoaded", function () {
    const bt_iniciar            = document.getElementById('ejecutar');
    const bt_agregarProceso     = document.getElementById('agregarProceso');
    const bt_agregarBloqueo     = document.getElementById('agregarBloqueo');
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
    const table_estadisticas    = document.getElementById('tablaEstadisticas');
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

    let contadorGrafica = 0;
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

        contadorGrafica++;
        coloresGrafica.push(estadosProcesos);
    
        for(let i = 0; i <= filas; i++) {
            const fila = document.createElement("tr");

            for(let j = 0; j < contadorGrafica; j++) {
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

    function limpiarGrafica() {
        contadorGrafica = 0;
        coloresGrafica = [];

    }

    function graficarTabla(table_estadisticas, tablaEstadisticas) {
        const tbody            = table_estadisticas.querySelector('tbody');
        const tablaTranspuesta = tablaEstadisticas[0].map((_, colIndex) =>
            tablaEstadisticas.map(row => {
              const valor = row[colIndex];
              return typeof valor === 'number' ? Number(valor.toFixed(10)) : valor;
            })
          );

        tablaTranspuesta.forEach(fila => {
            const tr = document.createElement('tr');

            fila.forEach(celda => {
                const td = document.createElement('td'); 
                td.textContent = celda; 
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }

    function actualizarGrafica_curry(tablaProcesos) {
        return function(estadosProcesos, filas, nombreProcesos) {
            actualizarGrafica(tablaProcesos, estadosProcesos, filas, nombreProcesos);
        };
    }

    function graficarTabla_curry(table_estadisticas) {
        return function(tablaEstadisticas) {
            graficarTabla(table_estadisticas, tablaEstadisticas);
        }
    }

    const extraerProcesos = (table_procesos) => {
        const filasProcesos = Array.from(table_procesos.querySelectorAll('tr')).slice(1);
        const datosProcesos = [];

        filasProcesos.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const nombre = celdas[0].innerText.trim();
            const inicio = parseInt(celdas[1].innerText.trim());
            const duracion = parseInt(celdas[2].innerText.trim());

            datosProcesos.push([nombre, inicio, duracion]);
        });

        return datosProcesos;
    };

    const extraerBloqueos = (table_bloqueos) => {
        const filasBloqueos = Array.from(table_bloqueos.querySelectorAll('tr')).slice(1);
        const datosBloqueos = [];

        filasBloqueos.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const inicio = parseInt(celdas[0].innerText.trim());
            const duracion = parseInt(celdas[1].innerText.trim());
            const textoProceso = celdas[2].querySelector('select')?.selectedOptions[0].text.trim();

            datosBloqueos.push([inicio, duracion, textoProceso]);
        });

        return datosBloqueos;
    }

    /*----------------------------------------------------------------------*/
    const iniciarProcesador = (
        interfaz, 
        ip_tiempoCiclos, 
        sel_algPlanificacion, 
        ip_quantum, 
        div_contenedorTabla,
        div_terminal,
        table_procesos,
        table_bloqueos,
        table_estadisticas
    ) => {

        const tiempoCiclos              = parseInt(ip_tiempoCiclos.value, 10);
        const algoritmoPlanificacion    = sel_algPlanificacion.value;
        const tablaProcesos             = document.createElement("table");
        const tbody                     = table_estadisticas.querySelector('tbody');

        tbody.innerHTML = '';
        div_terminal.innerHTML = '';
        div_contenedorTabla.innerHTML = '';
        div_contenedorTabla.appendChild(tablaProcesos);
        limpiarGrafica();

        if(sel_algPlanificacion.value != "RR")
        { quantum = 0; }
        else
        { quantum = parseInt(ip_quantum.value, 10); }

        interfaz(algoritmoPlanificacion);
        
        const procesosInterfaz = configurarProcesosYBloqueos(
            extraerProcesos(table_procesos), 
            extraerBloqueos(table_bloqueos)
        );

        configurarAlgoritmoProcesos(procesosInterfaz, algoritmoPlanificacion, quantum);
        gestionProcesos(interfaz, actualizarGrafica_curry(tablaProcesos), tiempoCiclos, graficarTabla_curry(table_estadisticas));
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
            <td id="nombreProceso${nombresEnTabla}" contenteditable="true">ProcesoZ</td>
            <td contenteditable="true">1</td>
            <td contenteditable="true">10</td>
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
            <td><select id="procesoAsignar${bloqueosEnTabla}">
            </select></td>
        </tbody>
        `;

        bloqueosEnTabla++;
        table_bloqueos.appendChild(fila);
    };

    const actualizarBloqueos = (table_bloqueos) => {
        const totalFilasBloqueo = table_bloqueos.querySelectorAll('tr').length - 1; 

        for(let i = 0; i < totalFilasBloqueo; i++) {
            const sel_proceso   = document.getElementById(`procesoAsignar${i}`);
            sel_proceso.innerHTML = '';

            for(let j = 0; j < procesosEnTabla; j++) {
                const nombreProceso = document.getElementById(`nombreProceso${j}`);
                sel_proceso.innerHTML += `<option value="nuevo">${nombreProceso.textContent}</option>`;
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
        div_contenedorTabla,
        div_terminal,
        table_procesos,
        table_bloqueos,
        table_estadisticas,
    ));

    bt_agregarProceso.addEventListener('click', () => agregarProceso(table_procesos, table_bloqueos));
    bt_agregarBloqueo.addEventListener('click', () => agregarBloqueo(table_bloqueos, table_procesos));
    bt_actualizarBloqueos.addEventListener('click', () => actualizarBloqueos(table_bloqueos));
    bt_eliminarProceso.addEventListener('click', () => eliminarProceso(table_procesos));
    bt_eliminarBloqueo.addEventListener('click', () => eliminarBloqueo(table_bloqueos));
    sel_algPlanificacion.addEventListener('change', () => autorizacionCampo_quantum(sel_algPlanificacion, ip_quantum));
});