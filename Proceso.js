export class Proceso {
    constructor(nombre, duracion, bloqueos = []) {
        this.nombre = nombre;
        this.duracion = duracion; // en ms
        this.bloqueos = bloqueos; // [{ en: ms, duracion: ms }]
        this.estado = '⚪ Inactivo';
        this.tiempoEjecutado = 0;
        this.tiempoTranscurrido = 0;
        this.tiempoInicio = 0;
        this.tiempo_enBloqueo = 0;
        this.cabeceraBloqueo = 0;
    }
  
    iniciar(s_tiempoInicio) {
        this.tiempoInicio = s_tiempoInicio;
        this.estado = '🔵 Iniciando';
    } 

    pulso(tick) {
        this.tiempoTranscurrido = tick;
        this.actualizarEstado();
        this.aumentarContadores();
    }

    actualizarEstado() {
        if (this.tiempoTranscurrido === this.tiempoInicio)   
        { this.estado = '🟢 Ejecutando'; }

        if(this.bloqueos[this.cabeceraBloqueo].empiezaEn === this.tiempoTranscurrido) 
        { this.estado = '🔴 Bloqueado';}

        if(this.bloqueos[this.cabeceraBloqueo].duracion === this.tiempo_enBloqueo) { 
            this.modificarProceso('Desbloquear');
            this.estado = '🟢 Ejecutando';
        }

        if(this.tiempoEjecutado === this.duracion)
        { this.estado = '✅ Finalizado'; }        
    }

    aumentarContadores() {
        if(this.estado === '🔴 Bloqueado')
        { this.tiempo_enBloqueo++; }

        if(this.estado === '🟢 Ejecutando')
        { this.tiempoEjecutado++; }
    }

    modificarProceso(comando) {
        switch(comando) {
            case 'Desbloquear':
                this.tiempo_enBloqueo = 0;
                if(this.bloqueos.length > this.cabeceraBloqueo + 1) { this.cabeceraBloqueo++ };
                break;

            default:
                console.log('Que Dios se apiade...');
                break;
        }
    }
}