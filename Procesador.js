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

const procesos = [
    new Proceso('A', 0, 8, bloqueoA),
    new Proceso('B', 2, 16, bloqueoB),
    new Proceso('C', 3, 12, bloqueoC),
];

const planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.primeroEntrar_primeroSalir);
planificadorCPU.iniciar();

let tick = { contador: 0 };
async function gestionProcesos() { 
    while(!planificadorCPU.terminacion()) {
        await reloj.tiempo(1000);
        console.log('\nCiclo no. ' + (tick.contador + 1));
        planificadorCPU.ejecutarInstruccion(tick.contador);
        reloj.ciclo(tick);
    }
}

gestionProcesos();