const primeroEntrar_primeroSalir = (procesos) => {
    const procesosEspera = procesos.filter(proceso => proceso.estado === '🟡 Esperando');
    const proceso_tiempoInicio_menor = procesosEspera.length > 0 
        ? procesosEspera.reduce((proceso_tiempoInicio_menor, proceso) => proceso.tiempoInicio < proceso_tiempoInicio_menor.tiempoInicio 
            ? proceso 
            : proceso_tiempoInicio_menor)
        : null;

    return proceso_tiempoInicio_menor;
};

const trabajoMas_corto = (procesos) => {
    const procesosEspera = procesos.filter(proceso => proceso.estado === '🟡 Esperando');
    const proceso_duracionMenor = procesosEspera.length > 0 
        ? procesosEspera.reduce((proceso_duracionMenor, proceso) => proceso.duracion < proceso_duracionMenor.duracion
            ? proceso 
            : proceso_duracionMenor)
        : null;

    return proceso_duracionMenor;
};

const tiempoRestante_masCorto = (procesos) => {
    const procesosEspera = procesos.filter(proceso => proceso.estado === '🟡 Esperando');
    const proceso_tiempoRestante_menor = procesosEspera.length > 0 
        ? procesosEspera.reduce((proceso_tiempoRestante_menor, proceso) => {
            const tiempoRestante        = proceso.duracion - proceso.tiempoEjecutado;
            const minimo_tiempoRestante = proceso_tiempoRestante_menor.duracion - proceso_tiempoRestante_menor.tiempoEjecutado;

            return tiempoRestante < minimo_tiempoRestante ? proceso : proceso_tiempoRestante_menor})
        : null;

    return proceso_tiempoRestante_menor;
};

const roundRobin = (procesos) => {
    const procesosEspera = procesos.filter(proceso => proceso.estado === '🟡 Esperando');
    console.log(procesosEspera.map(proceso => proceso.nombre));

    return null;
};

export const algoritmosPlanificacion = {
    primeroEntrar_primeroSalir  : primeroEntrar_primeroSalir,
    trabajoMas_corto            : trabajoMas_corto,
    tiempoRestante_masCorto     : tiempoRestante_masCorto,
    roundRobin                  : roundRobin
};