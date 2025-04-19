import { Proceso } from './Proceso.js';
import { algoritmosPlanificacion } from './AlgoritmosPlanificacion.js';
import { Planificador } from './Planificador.js';

const reloj = {
    tiempo  : (ms)   => new Promise(resolve => setTimeout(resolve, ms)),
    ciclo   : (tick) => tick.contador++
};

const bloqueoA = [
    { empiezaEn: 2, duracion: 3 },
    { empiezaEn: 9, duracion: 1 },
];

const bloqueoB = [
    { empiezaEn: 1, duracion: 4 },
    { empiezaEn: 11, duracion: 2 },
];

const procesos = [
    new Proceso('A', 10, bloqueoA),
    new Proceso('B', 13, bloqueoB),
];

const planificadorCPU = new Planificador(
    procesos, 
    algoritmosPlanificacion.primeroEntrar_primeroSalir
);

let tick = { contador: 0 };
async function gestionProcesos() { 
    while(!planificadorCPU.terminacion()) {
        await reloj.tiempo(1000);
        console.log('Ciclo no. ' + tick.contador);
        planificadorCPU.ejecutarInstruccion(tick.contador);
        reloj.ciclo(tick);
    }
}

gestionProcesos();