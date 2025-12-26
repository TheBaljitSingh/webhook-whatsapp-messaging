import WhatsappMessage from "./models/WhatsappMessage.js";
import { redisClient,  } from "./redis.js";



export async function handleIncomingMessage(msg) {
  // msg is now the message object directly: entry[0].changes[0].value.messages[0]
  const saved = await WhatsappMessage.create({
    whatsappMessageId: msg.id,
    from: msg.from,
    phone: msg.from,
    customerId: msg.from,
    message: msg.text?.body || msg.type, // Fallback if not text
    context: msg?.context, // context(if any reply message)
    direction: "INBOUND",
    timestamp: new Date(Number(msg.timestamp) * 1000),
  });


  await redisClient.publish(
  "whatsapp.events",
    JSON.stringify({
      type: "MESSAGE_CREATED",
      messageId: saved._id.toString(),
      customerId: saved.customerId.toString(),
      message:msg.text?.body || '',
      context: msg?.context.toString()
    })
  );

}

export async function handleStatusUpdate(status) {
  const msg = await WhatsappMessage.findOneAndUpdate(
    { whatsappMessageId: status.id },
    { status: status.status },
    { new: true }
  );

  if (!msg) return;

  await redisClient.publish(
    "whatsapp.events",
    JSON.stringify({
      type: "MESSAGE_STATUS_UPDATED",
      messageId: msg._id.toString(),
      customerId: msg.customerId.toString(),
      status: msg.status,
    })
  );
}
