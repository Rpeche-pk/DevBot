const {timeoutFlow} = require('../app/flows/exit_flow/exit.flow');
const chalk = require("chalk");
let timers = {};

/**
 * Inicia el tiempo de inactividad
 * @param ctx
 * @param gotoFlow
 * @param time
 */
function idleStart(ctx, gotoFlow, time) {
    console.log(chalk.green.bold(`[INICIAMOS] cuenta atrás para el usuario ${ctx.from}!`));
    timers[ctx.from] = setTimeout(() => {
        console.log(chalk.yellow(`¡Tiempo agotado para el usuario ${ctx.from}!`));
        return gotoFlow(timeoutFlow);
    }, time);
}

/**
 * Reinicia el tiempo de inactividad
 * @param ctx
 * @param gotoFlow
 * @param time
 */
function idleReset(ctx, gotoFlow, time) {
    if (timers[ctx.from]) {
        console.log(chalk.cyan.bold(`[REINICIAMOS] cuenta atrás para el usuario ${ctx.from}!`));
        clearTimeout(timers[ctx.from]);
        //delete timers[ctx.from];
    }
    idleStart(ctx, gotoFlow, time);
}

/**
 * Detiene el tiempo de inactividad
 * @param ctx
 */
function idleStop(ctx) {
    console.log(chalk.red.bold(`[DETENEMOS] cuenta atrás para el usuario ${ctx.from}!`));
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
        //delete timers[ctx.from];
    }
}

module.exports = {idleStart, idleStop,idleReset};
