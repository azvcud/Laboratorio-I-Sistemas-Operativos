export class Planificador {
    constructor(procesos, algoritmoPlanificador) {
        this.procesos = procesos;
        this.colaEspera = new Set();
        this.colaBloqueo = new Set();
        this.procesosTerminados = [];
        this.procesoEjecucion = null;
        this.quantum = 0;
        this.contadorQuantum = 0;
        this.algoritmoPlanificador = algoritmoPlanificador;
    }

    iniciar() {
        this.procesos.forEach(proceso => {
            proceso.iniciar();
        });
    }

    ejecutarInstruccion(tick) {
        let quantumActivado = this.algoritmoPlanificador === "roundRobin";

        this.procesos.forEach((proceso) => {
            proceso.señal(tick);
            this.encolarProceso(proceso);
        });

        if(quantumActivado)
        {
            if(this.contadorQuantum === this.quantum + 1) { this.contadorQuantum = 0; }
            if(this.contadorQuantum === 0) { console.log('🧊 Quantum'); }
            console.log(this.contadorQuantum);
            this.contadorQuantum++; 
        }

        if(this.procesoEjecucion === null)
        { 
            let procesoEjecutar = this.algoritmoPlanificador(this.procesos);

            if(!(procesoEjecutar === null))
            { this.despacharProceso(procesoEjecutar); }
        }

        if(this.procesoEjecucion === null)  { console.log('🟢 Proceso en ejecución: ' ); }
        else                                { console.log('🟢 Proceso en ejecución: ' + this.procesoEjecucion.nombre); }
        console.log('🔴 Cola de bloqueo: '); console.log(new Set([...this.colaBloqueo].map(proceso => proceso.nombre)));
        console.log('🟡 Cola de espera: '); console.log(new Set([...this.colaEspera].map(proceso => proceso.nombre)));
        console.log('✅ Procesos finalizados: '); console.log(this.procesosTerminados.map(proceso => proceso.nombre));
    }

    encolarProceso(proceso) {
        if (proceso.estado === '🔴 Bloqueado' && !this.colaBloqueo.has(proceso)) { 
            this.procesoEjecucion = null;
            this.colaBloqueo.add(proceso);
            
            this.contadorQuantum = 0;
        }
        else if (!(proceso.estado === '🔴 Bloqueado') && this.colaBloqueo.has(proceso))
        { this.colaBloqueo.delete(proceso); }

        if (proceso.estado === '🟡 Esperando' && !this.colaEspera.has(proceso))
        { this.colaEspera.add(proceso); }

        if (proceso.estado === '✅ Finalizado' && !this.procesosTerminados.includes(proceso)) { 
            this.procesoEjecucion = null;
            this.procesosTerminados.push(proceso); 
        }
    }

    despacharProceso(proceso) {
        proceso.ejecutar();
        this.colaEspera.delete(proceso);
        this.procesoEjecucion = proceso;
    }

    terminacion() {
        return this.procesos.every(proceso => proceso.estado === '✅ Finalizado');
    }

    setQuantum(quantum) {
        if(this.algoritmoPlanificador.name === "roundRobin") 
        { this.quantum = quantum; }
        else
        { console.log('El planificador no tiene asignado el algoritmo Round Robin'); }
    }
}
