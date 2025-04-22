import { Proceso } from './Proceso.js';
import { algoritmosPlanificacion } from './AlgoritmosPlanificacion.js';
import { Planificador } from './Planificador.js';

const reloj = {
    tiempo  : (ms)   => new Promise(resolve => setTimeout(resolve, ms)),
    ciclo   : (tick) => tick.contador++
};

const bloqueoA = [
    { empiezaEn: 3, duracion: 9 },
];

const bloqueoB = [
    { empiezaEn: 4, duracion: 10 },
    { empiezaEn: 11, duracion: 13 },
];

const bloqueoC = [
    { empiezaEn: 7, duracion: 5 },
    { empiezaEn: 11, duracion: 12 },
];

const bloqueoD = [
    { empiezaEn: 9, duracion: 11 },
    { empiezaEn: 12, duracion: 14 },
    { empiezaEn: 20, duracion: 8 },
];

const bloqueoE = [
    { empiezaEn: 2, duracion: 6 },
    { empiezaEn: 4, duracion: 8 },
];

const bloqueoF = [
    { empiezaEn: 3, duracion: 5 },
    { empiezaEn: 8, duracion: 9 },
    { empiezaEn: 13, duracion: 2 },
]

const bloqueoG = [
    { empiezaEn: 4, duracion: 6 },
];

const procesos = [
    new Proceso('A', 0, 8, bloqueoA),
    new Proceso('B', 2, 16, bloqueoB),
    new Proceso('C', 3, 12, bloqueoC),
    new Proceso('D', 5, 22, bloqueoD),
    new Proceso('E', 13, 6, bloqueoE),
    new Proceso('F', 14, 15, bloqueoF),
    new Proceso('G', 18, 7, bloqueoG),
];

const procesos2 = [];

//algoritmosPlanificacion.primeroEntrar_primeroSalir
//algoritmosPlanificacion.trabajoMas_corto
//algoritmosPlanificacion.tiempoRestante_masCorto

let tick = { contador: 0 };
let roundRobin_activado = false;
let planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.primeroEntrar_primeroSalir);

export function asignarProcesos(nombre, inicio, duracion, bloqueo) {
    
}


export function configurarAlgoritmoProcesos(algoritmoPlanificacion, quantum) {
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

export async function gestionProcesos(interfaz, tiempoCiclos) { 
    while(!planificadorCPU.terminacion()) {
        await reloj.tiempo(tiempoCiclos);
        interfaz('');
        interfaz('Ciclo no. ' + (tick.contador + 1) + ' entre tick ' + tick.contador + ' y ' + (tick.contador + 1));
        planificadorCPU.ejecutarInstruccion(tick.contador);
        planificadorCPU.visualizarDatosConsola(interfaz);
        reloj.ciclo(tick);
    }

    let tiempoPlanificando = planificadorCPU.getTiempoPlanificacion();
    imprimirEstadisticas(interfaz, tiempoPlanificando);
}

function imprimirEstadisticas(interfaz, tiempoPlanificando) {
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