const {addKeyword} = require('@bot-whatsapp/bot')
const {idleStart} = require("../../../utils/idle.util");
const {setRandomDelay} = require("../../../utils/delay.util");
const {bgRed} = require("chalk");
const {postSlack} = require("../../../http/slack.http");
const REGEX_KEYWORD = "/Recojo en tienda/g";

const localpickupFlow = addKeyword(REGEX_KEYWORD, {regex: true})
    .addAction(async (ctx, {globalState, gotoFlow, provider}) => {
        idleStart(ctx, gotoFlow, globalState.getMyState().timer);
        await provider.vendor.sendMessage(ctx?.key?.remoteJid, {react: {key: ctx?.key, text: "🤩"}});
    })
    .addAnswer("😉 Sirvase pasar a nuestro local, inmediatamente le enviaremos nuestra *dirección*"
        , {delay: setRandomDelay(800, 550)}
        , async (ctx, {provider}) => {
            try {


                await provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                    location: {
                        degreesLatitude: -14.070852320268422,
                        degreesLongitude: -75.73593907828425,
                        url: "https://maps.app.goo.gl/BgARzuqWJ9Wui3b29",
                        comment: "Visitanos en familia con tus amigos, te esperamos!"
                    }
                });
            } catch (error) {
                console.error(bgRed("ERROR FLUJO onFlow"), error);
                await postSlack({text: `[ERROR FLUJO ONFLOW:]` + error})
            }
        }
    );

module.exports = localpickupFlow
