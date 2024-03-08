const ORDEN = require('../utils/constants.util');

const processOrderWA = async (orderId, orderToken, provider, ctx, delivery=false) => {
    //delivery sea un booleano
    try {
        const orderToken = ctx?.message?.orderMessage.token;
        const orderNumber = ctx?.message?.orderMessage.orderId;
        const customerJid = ctx?.key.remoteJid;

        let order = await provider.getOrder(orderId, orderToken);

        const orderTotal = delivery ? order.price.total / 1000 + ORDEN.DELIVERY_COST :order.price.total / 1000;
        const total1000= order.price.total;
        const currency = order.price.currency;
        const orderData = order.products;
        
        let GLOBAL_ORDER = {
            "idOrderWA": orderNumber,
            "itemsProducts": orderData,
            "total": orderTotal,
        };
        
        // Recorrer los elementos en itemsProducts
        for (let i = 0; i < GLOBAL_ORDER.itemsProducts.length; i++) {
            console.log('la lista tiene '+GLOBAL_ORDER.itemsProducts.length+'productos')
            // Asignar el valor de id del producto a idItemWA
            GLOBAL_ORDER.itemsProducts[i].idItemWA = order.products[i].id;
            GLOBAL_ORDER.itemsProducts[i].description = order.products[i].name;
            console.log('producto id '+order.products[i].id )
        }
        
        // Resultado final
        console.log(GLOBAL_ORDER);
        console.log("orden enviada a API"+ JSON.stringify(orderData));

        let nextData = orderData
        //ordernar los puntos entre la modea y el simbolo de $
            .map(({ name, price, quantity }) => `${name} x${quantity} ${currency}  $. ${price / 1000}= ${currency} $. ${quantity*(price/1000)}`)
            .join("\n");

        let orderConfirm = `*Order Number:* ${orderId}\n\n*Order Detalles:* \n${nextData} \n\n*Order Total:* *${currency} $. ${orderTotal}*`;

        return { orderConfirm, orderToken, orderNumber, customerJid, nextData, orderTotal,currency , total1000,GLOBAL_ORDER};
    } catch (error) {
        return 'FAIL: obtener detalles orden';
    }
};

module.exports = { processOrderWA };

/*const orderCount= ctx?.message?.orderMessage.itemCount;
  const totalx1000= ctx?.message?.orderMessage.totalAmount1000;
  const orderTitle= ctx?.message?.orderMessage.orderTitle;
  const orderPrice= order.price.currency //moneda Actual
  //const orderImage= order.products.imageUrl;
  //console.log(orderCount,totalx1000,orderTitle,orderPrice,orderImage[0]);
  PARA SABER SI ME ESCRIBE DESDE ANDROID
  const android = await getDevice(customerJid);
  console.log(android);
  */