export class Planificador {
    constructor(procesos, algoritmoPlanificador) {
        this.procesos = procesos;
        this.colaEspera = [];
        this.colaBloqueo = [];
        this.procesosTerminados = [];
        this.procesoEjecucion = null;
        this.algoritmoPlanificador = algoritmoPlanificador;
    }

    iniciar() {
        this.procesos.forEach(proceso => {
            proceso.iniciar();
        });
    }

    ejecutarInstruccion(tick) {
        this.procesos.forEach((proceso) => {
            proceso.señal(tick);
            this.encolarProceso(proceso);
        });

        if(this.procesoEjecucion === null)
        { 
            let procesoEjecutar = this.algoritmoPlanificador(this.procesos);

            if(!(procesoEjecutar === null))
            { this.despacharProceso(procesoEjecutar); }
        }

        if(this.procesoEjecucion === null)  { console.log('🟢 Proceso en ejecución: ' ); }
        else                                { console.log('🟢 Proceso en ejecución: ' + this.procesoEjecucion.nombre); }
        console.log('🔴 Cola de bloqueo: '); console.log(this.colaBloqueo.map(proceso => proceso.nombre));
        console.log('🟡 Cola de espera: '); console.log(this.colaEspera.map(proceso => proceso.nombre));
        console.log('✅ Procesos finalizados: '); console.log(this.procesosTerminados.map(proceso => proceso.nombre));
    }

    encolarProceso(proceso) {
        if (proceso.estado === '🔴 Bloqueado' && !this.colaBloqueo.includes(proceso)) { 
            this.procesoEjecucion = null;
            this.colaBloqueo.push(proceso); 
        }
        else if (!(proceso.estado === '🔴 Bloqueado') && this.colaBloqueo.includes(proceso))
        { this.colaBloqueo.shift(proceso); }

        if (proceso.estado === '🟡 Esperando' && !this.colaEspera.includes(proceso))
        { this.colaEspera.push(proceso); }

        if (proceso.estado === '✅ Finalizado' && !this.procesosTerminados.includes(proceso)) { 
            this.procesoEjecucion = null;
            this.procesosTerminados.push(proceso); 
        }
    }

    despacharProceso(proceso) {
        proceso.ejecutar();
        this.colaEspera.shift(proceso);
        this.procesoEjecucion = proceso;
    }

    terminacion() {
        return this.procesos.every(proceso => proceso.estado === '✅ Finalizado');
    }
}
