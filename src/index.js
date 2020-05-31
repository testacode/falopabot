require('dotenv').config();
const sampleSize = require('lodash/sampleSize');
const uniqueId = require('lodash/uniqueId');
const truncate = require('lodash/truncate');

const chistesDB = require('./db');

const TeleBot = require('telebot');
const bot = new TeleBot(process.env.BOT_TOKEN);

// "edit message" action
bot.on('edit', (msg) => {
  console.log({ msg });
  return msg.reply.text('Te vi! lo editaste!', { asReply: true });
});

// inline query action
bot.on('inlineQuery', (data) => {
  const { id } = data;

  // create a new answer list object
  const answers = bot.answerList(id);

  // get random 5 jokes list
  const chistes = sampleSize(chistesDB, 5);

  // add the list to the answers
  chistes.forEach((chiste) => answers.addArticle({
    id: uniqueId('query_'),
    title: truncate(chiste, {
      'length': 40,
    }),
    message_text: chiste
  }))

  // return collection
  return bot.answerQuery(answers);
});

bot.start();