class Proceso {
    constructor(duracion, bloqueos = []) {
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
        this.actualizar();
    }

    actualizar() {
    
        if (this.tiempoTranscurrido === this.tiempoInicio)   
        { this.estado = '🟢 Ejecutando'; }

        if(this.bloqueos[this.cabeceraBloqueo].empiezaEn === this.tiempoTranscurrido) 
        { this.estado = '🔴 Bloqueado';}

        if(this.bloqueos[this.cabeceraBloqueo].duracion === this.tiempo_enBloqueo) { 
            this.estado = '🟢 Ejecutando';
            this.tiempo_enBloqueo = 0;
            if(this.bloqueos.length > this.cabeceraBloqueo + 1) { this.cabeceraBloqueo++ };
        }

        if(this.estado === '🔴 Bloqueado')
        { this.tiempo_enBloqueo++; }

        if(this.tiempoEjecutado === this.duracion)
        { this.estado = '✅ Finalizado'; }

        if(this.estado === '🟢 Ejecutando')
        { this.tiempoEjecutado++; }

        console.log(this.estado);
    }
}

function reloj(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const bloqueos = [
    { empiezaEn: 2, duracion: 3 },
    { empiezaEn: 9, duracion: 1 },
];

const bloqueos2 = [
    { empiezaEn: 5, duracion: 4 },
];


const proceso = new Proceso(10, bloqueos);
const proceso2 = new Proceso(13, bloqueos2);
console.log(proceso.estado);
proceso.iniciar(0);

for (let tick = 0; tick < 35; tick++) {
    reloj(tick * 1000).then(() => { 
        console.log('Tick no. ' + tick);
        proceso.pulso(tick);
        proceso2.pulso(tick);
    });
}
  


