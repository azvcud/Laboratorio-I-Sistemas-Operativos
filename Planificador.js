export class Planificador {
    constructor(procesos, algoritmoPlanificador) {
        this.procesos = procesos;
        this.colaEspera = [];
        this.colaBloqueo = [];
        this.algoritmoPlanificador = algoritmoPlanificador;
    }

    ejecutarInstruccion(tick) {
        this.procesos.forEach(proceso => {
            proceso.pulso(tick);

            if (proceso.estado === '🔴 Bloqueado' && !this.colaBloqueo.includes(proceso)) 
            { this.colaBloqueo.push(proceso); }
            else if (!(proceso.estado === '🔴 Bloqueado') && this.colaBloqueo.includes(proceso))
            { this.colaBloqueo.pop(proceso); }

            console.log(proceso.estado);
        });

        console.log(this.colaBloqueo.map(proceso => proceso.estado));
    }

    asignarPlanificador(tick) {

    }

    terminacion() {
        return this.procesos.every(proceso => proceso.estado === '✅ Finalizado');
    }
}
