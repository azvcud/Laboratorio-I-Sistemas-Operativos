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
//algoritmosPlanificacion.primeroEntrar_primeroSalir
//algoritmosPlanificacion.trabajoMas_corto
//algoritmosPlanificacion.tiempoRestante_masCorto
const planificadorCPU = new Planificador(procesos, algoritmosPlanificacion.tiempoRestante_masCorto);
planificadorCPU.iniciar();
//planificadorCPU.setQuantum(3);

let tick = { contador: 0 };
async function gestionProcesos() { 
    while(!planificadorCPU.terminacion()) {
        await reloj.tiempo(50);
        console.log('\nCiclo no. ' + (tick.contador + 1) + ' entre tick ' + tick.contador + ' y ' + (tick.contador + 1));
        planificadorCPU.ejecutarInstruccion(tick.contador);
        reloj.ciclo(tick);
    }
}

gestionProcesos();