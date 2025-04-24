export class Planificador {
    constructor(procesos, algoritmoPlanificador) {
        this.procesos = procesos;
        this.colaEspera = new Set();
        this.colaBloqueo = new Set();
        this.procesosTerminados = [];
        this.procesoEjecucion = null;
        this.quantum = 0;
        this.contadorQuantum = 0;
        this.tiempoPlanificacion = 0;
        this.planificacionFinal = false;
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
            this.encolarProceso(proceso, tick);
        });

        let quantumActivado = (this.quantum > 0) && (this.verificarProcesosExistentes());

        if(quantumActivado)
        {
            if(this.contadorQuantum === this.quantum + 1) { this.contadorQuantum = 0; }
            if(this.colaEspera.size === 0 && this.procesoEjecucion === null) { this.contadorQuantum = 0; }
        }

        if(this.procesoEjecucion === null)
        {
            let procesoEjecutar = null;

            if (!(quantumActivado && this.contadorQuantum === 0))
            { procesoEjecutar = this.algoritmoPlanificador(this.colaEspera); }            

            if(!(procesoEjecutar === null))
            { this.despacharProceso(procesoEjecutar); }
        } 
        else if (quantumActivado && this.contadorQuantum === 0)
        {
            this.procesoEjecucion.pausar();
            this.encolarProceso(this.procesoEjecucion);
            this.procesoEjecucion = null;
        }

        if(quantumActivado) { this.contadorQuantum++; }
        if(this.contadorQuantum === 1) { this.tiempoPlanificacion++; }
    }

    encolarProceso(proceso, tick) {
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
            proceso.setInstanteFinalizacion(tick);
            this.procesosTerminados.push(proceso);
            
            this.contadorQuantum = 0;
        }
    }

    despacharProceso(proceso) {
        proceso.ejecutar();
        proceso.setEstadoEsperaInicial(true);
        this.colaEspera.delete(proceso);
        this.procesoEjecucion = proceso;
    }

    terminacion() {
        return this.procesos.every(proceso => proceso.estado === '✅ Finalizado');
    }

    verificarProcesosExistentes() {
        if(this.tiempoPlanificacion > 0 && this.colaBloqueo.size === 0 && this.procesoEjecucion == null && this.colaEspera.size === 1 && this.planificacionFinal === false)
        { this.contadorQuantum = this.quantum + 1; this.planificacionFinal = true; }

        return (this.colaEspera.size > 0 || this.colaBloqueo.size > 0 || this.procesoEjecucion != null); 
    }

    setQuantum(quantum) {
        if(this.algoritmoPlanificador.name === "roundRobin") 
        { this.quantum = quantum; }
        else
        { console.log('El planificador no tiene asignado el algoritmo Round Robin'); }
    }

    getTiempoPlanificacion() {
        return this.tiempoPlanificacion;
    }

    getCicloActual() {
        const estadoProcesos = this.procesos.map(proceso => proceso.estado);
        
        if(this.contadorQuantum === 1 && !this.terminacion())
        { estadoProcesos.push('🧊 Quantum'); }
        else if(this.quantum > 0)
        { estadoProcesos.push('No quantum :('); }
        
        return estadoProcesos;
    }

    getNombreProcesos() {
        const nombreProcesos = this.procesos.map(proceso => proceso.nombre);

        if(this.quantum > 0)
        { nombreProcesos.push('Planificador'); }

        return nombreProcesos;
    }

    getProcesos() {
        return this.procesos;
    }

    visualizarDatosConsola(interfaz) {
        interfaz('');
        if(this.contadorQuantum === 1) { interfaz('🧊 Quantum'); }
        if(this.procesoEjecucion === null)  { interfaz('🟢 Proceso en ejecución: ' ); }
        else                                { interfaz('🟢 Proceso en ejecución: ' + this.procesoEjecucion.nombre); }
        interfaz('🔴 Cola de bloqueo: ');       interfaz(new Set([...this.colaBloqueo].map(proceso => proceso.nombre)));
        interfaz('🟡 Cola de espera: ');        interfaz(new Set([...this.colaEspera].map(proceso => proceso.nombre)));
        interfaz('✅ Procesos finalizados: ');  interfaz(this.procesosTerminados.map(proceso => proceso.nombre));
    }
}
