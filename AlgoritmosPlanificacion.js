const primeroEntrar_primeroSalir = (procesos) => {
    const procesosEspera = procesos.filter(proceso => proceso.estado === '🟡 Esperando');
    const proceso_tiempoInicio_menor = procesosEspera.length > 0 
        ? procesosEspera.reduce((proceso_tiempoInicio_menor, proceso) => proceso.tiempoInicio < proceso_tiempoInicio_menor 
            ? proceso 
            : proceso_tiempoInicio_menor)
        : null;

    return proceso_tiempoInicio_menor;
};

const trabajoMas_corto = (procesos) => {
    console.log("WIP");
};

const tiempoRestante_masCorto = (procesos) => {
    console.log("WIP");
};

const roundRobin = (procesos) => {
    console.log("WIP");
};

export const algoritmosPlanificacion = {
    primeroEntrar_primeroSalir  : primeroEntrar_primeroSalir,
    trabajoMas_corto            : trabajoMas_corto,
    tiempoRestante_masCorto     : tiempoRestante_masCorto,
    roundRobin                  : roundRobin
};