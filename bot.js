const {Telegraf} = require('telegraf');
const botToken = process.env.BOT_TOKEN;
const GREENPILLBR_CHAT_ID= process.env.ATHUS_DEV_CHAT_ID;

const bot = new Telegraf(botToken);


const question = 'Você aprendeu um pouco mais sobre Web3 com a Greenpill Brasil?';
const pollOptions = ['SIM', 'NÃO'];

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
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))