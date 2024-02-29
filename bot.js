const {Telegraf} = require('telegraf');
const {EAS} = require('@ethereum-attestation-service/eas-sdk');
const ethers = require('ethers');

// Seedphrase da carteira
const seedPhrase = process.env.SEED_PHRASE;

// Conecte-se à rede Sepolia
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/8ee09ed48efc475e8953b95c3feaf1f7');
// Crie um provedor de carteira
const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

const signer = wallet.connect(provider);

const botToken = process.env.BOT_TOKEN;
const GREENPILLBR_CHAT_ID= process.env.ATHUS_DEV_CHAT_ID;

// Endereço do contrato EAS na rede Sepolia
const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Inicialize o EAS SDK
const eas = new EAS(EASContractAddress);
eas.connect(signer).catch(error => console.error("Failed to connect to EAS:", error));

const bot = new Telegraf(botToken);

const question = 'Você aprendeu um pouco mais sobre Web3 com a Greenpill Brasil?';
const pollOptions = ['SIM', 'NÃO'];

// Schema UID e dados da atestação
const uid = "0xf2012b79c4f9458b1507ada34ea55f8687fbd85d044121abee5ab357b18995ad";

async function attest(data) {
  try {
    const tx = await eas.attest(uid, data);
    console.log("Transaction EAS: ", tx);
  } catch (error) {
    console.error("Failed to create attestation:", error);
  }
};

bot.start((ctx) => {
  ctx.reply('Bem-vindo! Vou criar uma enquete agora.');
  ctx.telegram.sendPoll(GREENPILLBR_CHAT_ID, question, pollOptions, { is_anonymous: false });
})

bot.on('poll_answer', (ctx) => {
  const answerText = pollOptions[ctx.pollAnswer.option_ids[0]];
  console.log("================GREENPILL BRASIL TELEGRAM POLL====================");
  console.log("Telegram Chat ID:", GREENPILLBR_CHAT_ID);
  console.log("Pergunta: ", question);
  console.log('Resposta:', answerText);
  console.log("Telegram username: ", ctx.pollAnswer.user.username);
  console.log("First name: ", ctx.pollAnswer.user.first_name);
  console.log("User ID: ", ctx.pollAnswer.user.id);
  console.log("====================IMPACT EAS BOT================================");
  const data = {
    schemaName: "Greenpill Brasil - Test Telegram EAS Metrics",
    telegramChatID: GREENPILLBR_CHAT_ID,
    question: question,
    answer: answerText,
    telegramUsername: ctx.pollAnswer.user.username,
    telegramFirstname: ctx.pollAnswer.user.first_name,
    telegramUserID: ctx.pollAnswer.user.id, 
  };
  attest(data);
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
