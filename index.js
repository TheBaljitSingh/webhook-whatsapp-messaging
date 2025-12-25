import express from 'express';
import { connectDb } from "./db.js"
import { handleIncomingMessage } from "./whatsappmessage.js"
import dotenv from 'dotenv'
import { connectRedis } from "./redis.js";

dotenv.config({ path: '.env' })



// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

console.log(process.env.REDIS_URL)


await connectDb();

await connectRedis();

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', async (req, res) => {
  // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  // console.log(`\n\nWebhook received ${timestamp}\n`);
  // console.log(JSON.stringify(req.body, null, 2));

  try {
    // WhatsApp sends status updates and messages to the same webhook
    // We need to differentiate them or handle both
    const body = req.body;

    // Check if this is an event from a page subscription
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        await handleIncomingMessage(value.messages[0]);
      }
    }

    res.status(200).end();
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});