import { Proceso } from './Proceso.js';
import { algoritmosPlanificacion } from './AlgoritmosPlanificacion.js';
import { Planificador } from './Planificador.js';

const reloj = {
    tiempo  : (ms)   => new Promise(resolve => setTimeout(resolve, ms)),
    ciclo   : (tick) => tick.contador++
};

let tick;
let roundRobin_activado = false;
let planificadorCPU;

export function configurarAlgoritmoProcesos(procesos, algoritmoPlanificacion, quantum) {
    tick = { contador: 0 };

    switch(algoritmoPlanificacion) {
        case "FCFS":
            planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.primeroEntrar_primeroSalir);
            break;
        case "SFJ":
            planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.trabajoMas_corto);
            break;
        case "SRFJ":
            planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.tiempoRestante_masCorto);
            break;
        case "RR":
            planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.roundRobin);
            planificadorCPU.setQuantum(quantum);
            roundRobin_activado = true;
            break;
        default:
            interfaz('Dios santo');
            break;
    }

    planificadorCPU.iniciar();
}

export function configurarProcesosYBloqueos(procesos, bloqueos) {
    const normalizar = nombre => nombre.toLowerCase().replace(/s$/, '');

    const listaBloqueos = procesos.map(([nombre]) => {
    const nombreNormalizado = normalizar(nombre);
    return bloqueos
        .filter(([, , nombreBloqueo]) => normalizar(nombreBloqueo) === nombreNormalizado)
        .map(([empiezaEn, duracion]) => ({ empiezaEn, duracion }));
    });

    const instancias = procesos.map(([nombre, prioridad, tiempo], i) =>
        new Proceso(nombre, prioridad, tiempo, listaBloqueos[i])
    );

    console.log(instancias);
    return instancias;
}

export async function gestionProcesos(interfaz, actualizarGrafica, tiempoCiclos) { 
    while(!planificadorCPU.terminacion()) {
        await reloj.tiempo(tiempoCiclos);
        interfaz('');
        interfaz('Ciclo no. ' + (tick.contador + 1) + ' entre tick ' + tick.contador + ' y ' + (tick.contador + 1));
        planificadorCPU.ejecutarInstruccion(tick.contador);
        planificadorCPU.visualizarDatosConsola(interfaz);

        const estadosActuales = planificadorCPU.getCicloActual();
        const nombresProcesos = planificadorCPU.getNombreProcesos();

        nombresProcesos.push('');
        actualizarGrafica(estadosActuales, estadosActuales.length, nombresProcesos);

        reloj.ciclo(tick);
    }

    let tiempoPlanificando      = planificadorCPU.getTiempoPlanificacion();
    let procesosPlanificador    = planificadorCPU.getProcesos();
    imprimirEstadisticas(procesosPlanificador, interfaz, tiempoPlanificando);
}

function imprimirEstadisticas(procesos, interfaz, tiempoPlanificando) {
    let tiempoCPU_encendida = tick.contador - 1;
    let numeroProcesos      = procesos.length;
    let usoTotal_CPU        = procesos.reduce((suma, proceso) => suma + proceso.duracion, 0);
    let sumaEsperas         = procesos.reduce((suma, proceso) => suma + proceso.tiempoEsperado, 0);
    let P_usoTotal_CPU      = (usoTotal_CPU / tiempoCPU_encendida) * 100;
    let P_CPU_desocupada    = ((tiempoCPU_encendida - usoTotal_CPU) / tiempoCPU_encendida ) * 100;

    let sumaRetornos        = procesos.reduce((suma, proceso) => {
        return suma + (proceso.instanteFinalizacion - proceso.tiempoInicio);
    }, 0);

    let sumaTiemposPerdidos = procesos.reduce((suma, proceso) => {
        return suma + ((proceso.instanteFinalizacion - proceso.tiempoInicio) - proceso.duracion);
    }, 0);

    interfaz('EL PROCESO DE PLANIFICACIÓN HA FINALIZADO');
    interfaz('🔋Tiempo de la CPU encendida: ' + tiempoCPU_encendida);
    interfaz('🔌Uso total de la CPU: ' + usoTotal_CPU + ' equivalente al ' + P_usoTotal_CPU + '%');
    interfaz('📴CPU desocupada: ' + (tiempoCPU_encendida - usoTotal_CPU) + ' equivalente al ' + P_CPU_desocupada + '%');
    interfaz('↩️Promedio de retorno: ' + (sumaRetornos / numeroProcesos));
    interfaz('⚙️Promedio de ejecución: ' + (usoTotal_CPU / numeroProcesos));
    interfaz('⏳Promedio de espera: ' + (sumaEsperas / numeroProcesos));
    interfaz('🗑️Promedio de tiempo perdido: ' + (sumaTiemposPerdidos / numeroProcesos));

    if(roundRobin_activado)
    {  interfaz('📅CPU en planificación: ' + tiempoPlanificando); }
}