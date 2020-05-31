require('dotenv').config();
const sampleSize = require('lodash/sampleSize');
const uniqueId = require('lodash/uniqueId');
const truncate = require('lodash/truncate');

const chistesDB = require('./db');

const TeleBot = require('telebot');
const bot = new TeleBot({
  token: process.env.BOT_TOKEN,
  usePlugins: ['askUser']
});

bot.on('/start', msg => {
  const { from } = msg;
  const id = from.id;

  // Preguntar nombre
  return bot.sendMessage(id, 'Hola, cuál es tu nombre?', { ask: 'nombre' });
});

// Evento preguntar nombre
bot.on('ask.nombre', msg => {
  const { from, text: nombre } = msg;
  const id = from.id;

  // Preguntar edad
  return bot.sendMessage(id, `Mucho gusto, ${nombre}! Cuántos años tenes?`, { ask: 'edad' });
});

// Evento preguntar edad
bot.on('ask.edad', msg => {
  const { from, text } = msg;
  const id = from.id;
  const edad = Number(text);

  if (!edad) {

    // Si la edad es incorrecta, preguntar de nuevo
    return bot.sendMessage(id, 'Esa edad es falopa, dale! Cuántos años tenes?', { ask: 'edad' });

  } else {

    // Último mensaje
    return bot.sendMessage(id, `Tenes ${edad} años. A la flauta!`);
  }
});

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