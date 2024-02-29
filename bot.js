const { Telegraf } = require('telegraf');
const { EAS, SchemaEncoder } = require('@ethereum-attestation-service/eas-sdk');
const ethers = require('ethers');


// Seedphrase da carteira
const seedPhrase = process.env.SEED_PHRASE;

// Conecte-se à rede Sepolia
const provider = new ethers.getDefaultProvider('sepolia');
// Crie um provedor de carteira
const wallet = ethers.Wallet.fromPhrase(seedPhrase);

const signer = wallet.connect(provider);

const botToken = process.env.BOT_TOKEN;
const GREENPILLBR_CHAT_ID = process.env.ATHUS_DEV_CHAT_ID;

// Endereço do contrato EAS na rede Sepolia
const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Função para inicializar o EAS SDK
async function initEAS() {
 try {
    const eas = new EAS(EASContractAddress);
    await eas.connect(signer); // Supondo que eas.connect seja uma função assíncrona
    console.log("EAS SDK conectado com sucesso.");
    return eas;
 } catch (error) {
    console.error("Falha ao conectar ao EAS:", error);
 }
}

const bot = new Telegraf(botToken);

const question = 'Você aprendeu um pouco mais sobre Web3 com a Greenpill Brasil?';
const pollOptions = ['SIM', 'NÃO'];

// Schema UID e dados da atestação
const uid = "0xf2012b79c4f9458b1507ada34ea55f8687fbd85d044121abee5ab357b18995ad";

// Função para atestar as respostas
async function attest(eas, data) {
  try {
     // Inicialize o SchemaEncoder com a string do schema
     const schemaEncoder = new SchemaEncoder("string telegramChatID, string question, string answer, string telegramUsername, string telegramFirstname, string telegramUserID");
 
     // Codifique os dados de acordo com o schema
     const encodedData = schemaEncoder.encodeData([
       { name: "telegramChatID", value: toString(data.telegramChatI), type: "string" },
       { name: "question", value: data.question, type: "string" },
       { name: "answer", value: data.answer, type: "string" },
       { name: "telegramUsername", value: data.telegramUsername, type: "string" },
       { name: "telegramFirstname", value: data.telegramFirstname, type: "string" },
       { name: "telegramUserID", value: toString(data.telegramUserID), type: "string" },
     ]);
 
     // Dados da atestação
     const attestationData = {
       schema: uid, // O UID do schema para o qual a atestação está sendo criada
       data: {
         recipient: "0xA9645f4CF0aD4d218595C9E5182aD273df2375DF", // O endereço Ethereum do destinatário da atestação
         expirationTime: 0, // Use 0 para sem expiração
         revocable: false, // Indica se a atestação é revocável ou não
         refUID: "0x0000000000000000000000000000000000000000000000000000000000000000", // Use ZERO_BYTES32 se não houver referência
         data: encodedData,
       },
     };
 
     const tx = await eas.attest(attestationData);
     console.log("Transaction Hash EAS: ", tx.hash);
     return;
  } catch (error) {
     console.error("Failed to create attestation:", error);
  }
 };

// Inicialização do bot
bot.start(async (ctx) => {
 ctx.reply('Bem-vindo! Vou criar uma enquete agora.');
 ctx.telegram.sendPoll(GREENPILLBR_CHAT_ID, question, pollOptions, { is_anonymous: false });
})

bot.on('poll_answer', async (ctx) => {
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
 const eas = await initEAS();
 attest(eas, data); // Passando o endereço do recipiente como 'recipient'
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
