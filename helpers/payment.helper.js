const axios = require("axios");
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const crypto = require('crypto');
module.exports.paymentMoMo = async (res, totalPrice, idOrder) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  var redirectUrl = `https://30e1-171-242-233-122.ngrok-free.app/checkout/success/${idOrder}`;
  var ipnUrl = 'https://30e1-171-242-233-122.ngrok-free.app/callback';
  var requestType = "payWithMethod";
  var amount = totalPrice;
  var orderId = idOrder;
  var requestId = orderId;
  var extraData = '';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  //puts raw signature
  //signature
  var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: totalPrice,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  // option for axios
  const option = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }
  let result;
  try {
    result = await axios(option);
    console.log(result.data);
    return result.data;
  } catch (error) {
    return "Lỗi";
  }
}
