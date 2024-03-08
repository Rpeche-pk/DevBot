const {idleStart, idleReset} = require("../utils/idle.util");
const {setRandomDelay} = require("../utils/delay.util");

let intents = 2;
const simulateTypingMiddleware = async (ctx, {provider, gotoFlow, globalState, extensions}) => {
    idleStart(ctx, gotoFlow, globalState.getMyState().timer);
    await extensions.utils.typing(provider, {
        delay1: setRandomDelay(750, 550),
        delay2: setRandomDelay(2980, 2500),
        ctx
    });
    await provider.vendor.sendPresenceUpdate("available", ctx?.key?.remoteJid);
    await extensions.utils.wait(setRandomDelay(950, 750))
    await provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
}

const captureDataMiddleware = async (field, ctx, ctxFn) => {
    idleReset(ctx, ctxFn.gotoFlow, ctxFn.globalState.getMyState().timer)
    const body = ctx?.body.trim();
    const myState = ctxFn.state.getMyState();
    const regexName = new RegExp(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\- ]{2,50}$|^$/);
    await ctxFn.provider.vendor.readMessages([ctx?.key]);

    if (!regexName.test(body)) {
        await ctxFn.extensions.utils.tryAgain(intents, ctxFn, {ctx, state: myState});
        intents--;
        return
    }
    //todo resetear intents
    intents = 2;
    myState[ctx?.from] = {...myState[ctx?.from], data: {...myState[ctx?.from].data,[field]: body}};
    await ctxFn.state.update(myState);
    await ctxFn.provider.vendor.sendMessage(ctx?.key?.remoteJid, {react: {key: ctx?.key, text: "👍"}});
    await ctxFn.extensions.utils.typing(ctxFn.provider, {
        delay1: setRandomDelay(750, 550),
        delay2: setRandomDelay(2500, 1800),
        ctx
    });
    await ctxFn.provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
}

const captureAddressMiddleWare = async (field, ctx, ctxFn) =>{
    idleReset(ctx, ctxFn.gotoFlow, ctxFn.globalState.getMyState().timer)
    await ctxFn.provider.vendor.readMessages([ctx?.key]);
    const myState = ctxFn.state.getMyState();
    const body = ctx?.body.trim();

    myState[ctx?.from] = {...myState[ctx?.from], data: {...myState[ctx?.from].data,[field]: body}};
    await ctxFn.state.update(myState);
    await ctxFn.extensions.utils.typing(ctxFn.provider, {
        delay1: setRandomDelay(650, 500),
        delay2: setRandomDelay(2600, 1850),
        ctx
    });
    await ctxFn.provider.vendor.sendPresenceUpdate("paused", ctx?.key?.remoteJid);
}



module.exports = {simulateTypingMiddleware, captureDataMiddleware,captureAddressMiddleWare}
