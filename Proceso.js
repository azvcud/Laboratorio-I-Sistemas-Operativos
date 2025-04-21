export class Proceso {
    constructor(nombre, tiempoInicio, duracion, bloqueos = []) {
        this.nombre = nombre;
        this.duracion = duracion;
        this.bloqueos = bloqueos; // [{ empiezaEn: n, duracion: n }, ...]
        this.estado = '⚪ Inactivo';
        this.tiempoEjecutado = 0;
        this.tiempoTranscurrido = 0;
        this.tiempoInicio = tiempoInicio;
        this.tiempo_enBloqueo = 0;
        this.cabeceraBloqueo = 0;
        this.bloqueosFinalizados = false;
    }
  
    iniciar() {
        this.estado = '🔵 Iniciando';
    } 

    señal(tick) {
        this.tiempoTranscurrido = tick;
        this.actualizarProceso();
        this.actualizarContadores();
    }

    actualizarProceso() {
        if (this.tiempoTranscurrido === this.tiempoInicio) 
        { this.estado = '🟡 Esperando'; }

        if(this.bloqueos[this.cabeceraBloqueo].duracion === this.tiempo_enBloqueo && !this.bloqueosFinalizados) {
            this.modificarProceso('Desbloquear');
            this.estado = '🟡 Esperando'; 
        }

        if(this.bloqueos[this.cabeceraBloqueo].empiezaEn === this.tiempoEjecutado && !this.bloqueosFinalizados) 
        { this.estado = '🔴 Bloqueado'; }

        if(this.tiempoEjecutado === this.duracion)
        { this.estado = '✅ Finalizado'; } 
    }

    actualizarContadores() {
        if (this.estado === '🔴 Bloqueado' ) { this.tiempo_enBloqueo++; }
        if (this.estado === '🟢 Ejecutando') { this.tiempoEjecutado++; }
    }

    ejecutar() {
        this.estado = '🟢 Ejecutando';
        this.tiempoEjecutado++;
    }

    pausar() {
        this.estado = '🟡 Esperando';
        this.tiempoEjecutado--;
    }

    modificarProceso(comando) {
        switch(comando) {
            case 'Desbloquear':
                this.tiempo_enBloqueo = 0;
                
                if(this.bloqueos.length > this.cabeceraBloqueo + 1) 
                { this.cabeceraBloqueo++ }
                else 
                { this.bloqueosFinalizados = true; }
                
                break;
            default:
                console.log('Que Dios se apiade...');
                break;
        }
    }
}