const TelegramBot = require('node-telegram-bot-api');

// Ton token ici
const bot = new TelegramBot('7754364382:AAGSI6WoQmn0YV4YUV7rLRFyUcVvBYf4juQ', { polling: true });

// Ton ID admin
const adminId = 5305199760;

// Objet pour stocker la langue choisie par chaque utilisateur (clé = chatId)
const userLanguages = {};

// Liste noire d'IDs bannis (les messages de ces utilisateurs seront ignorés)
const bannedUsers = new Set();
// Exemple : bannir un utilisateur (décommenter la ligne suivante pour bannir l'ID en question)
// bannedUsers.add(5305199760);

// Dictionnaires pour les messages en différentes langues
const messages = {
  fr: {
    selectLanguage: 'Choisissez votre langue :',
    start: 'Bienvenue ! Choisissez une option :',
    preview: '👀 Prévisualiser',
    pay: '💸 Payer',
    settings: '⚙️ Paramètres',
    backToMenu: '🔙 Retour au menu',
    menuAgain: '🔙 Retour au menu principal. Choisissez une option :',
    paymentOptions: '💰 Choisissez votre méthode de paiement en crypto-monnaie :',
    btc: '🪙 Bitcoin (BTC)',
    eth: '⛓️ Ethereum (ETH)',
    usdt: '💵 USDT (TRC20)',
    confirmPayment: '🔒 Veuillez confirmer votre paiement en cliquant sur "Confirmer" ou annuler votre choix.',
    paymentPending: '🎉 Votre paiement est en attente de validation par l\'administrateur.',
    paymentAccepted: '🎉 Votre paiement a été accepté, merci pour votre achat.',
    paymentRefused: '❌ Votre paiement a été refusé.',
    cancelled: '❌ Vous avez annulé le paiement.',
    btcAddress: '🪙 Envoyez votre paiement à cette adresse Bitcoin :\n\n`bc1q9l26qj5ta57as39qkkszrk5q9z4wgr6prjpkzq`',
    ethAddress: '⛓️ Envoyez votre paiement à cette adresse Ethereum :\n\n`0xc590780A7f2b625c67CBc703BdAc981330BC9071`',
    usdtAddress: '💵 Envoyez votre paiement à cette adresse USDT (TRC20) :\n\n`TSjya8vNyvLPvxAeauhbH9gXAsfKeXy2aA`'
  },
  en: {
    selectLanguage: 'Choose your language:',
    start: 'Welcome! Choose an option:',
    preview: '👀 Preview',
    pay: '💸 Pay',
    settings: '⚙️ Settings',
    backToMenu: '🔙 Back to menu',
    menuAgain: '🔙 Back to main menu. Choose an option:',
    paymentOptions: '💰 Choose your cryptocurrency payment method:',
    btc: '🪙 Bitcoin (BTC)',
    eth: '⛓️ Ethereum (ETH)',
    usdt: '💵 USDT (TRC20)',
    confirmPayment: '🔒 Please confirm your payment by clicking "Confirm" or cancel your choice.',
    paymentPending: '🎉 Your payment is awaiting validation by the administrator.',
    paymentAccepted: '🎉 Your payment has been accepted, thank you for your purchase.',
    paymentRefused: '❌ Your payment has been refused.',
    cancelled: '❌ You cancelled the payment.',
    btcAddress: '🪙 Send your payment to this Bitcoin address :\n\n`bc1q9l26qj5ta57as39qkkszrk5q9z4wgr6prjpkzq`',
    ethAddress: '⛓️ Send your payment to this Ethereum address :\n\n`0xc590780A7f2b625c67CBc703BdAc981330BC9071`',
    usdtAddress: '💵 Send your payment to this USDT (TRC20) address :\n\n`TSjya8vNyvLPvxAeauhbH9gXAsfKeXy2aA`'
  },
  ru: {
    selectLanguage: 'Выберите язык:',
    start: 'Добро пожаловать! Выберите опцию:',
    preview: '👀 Просмотр',
    pay: '💸 Оплатить',
    settings: '⚙️ Настройки',
    backToMenu: '🔙 Назад в меню',
    menuAgain: '🔙 Вернуться в главное меню. Выберите опцию:',
    paymentOptions: '💰 Выберите способ оплаты криптовалютой:',
    btc: '🪙 Bitcoin (BTC)',
    eth: '⛓️ Ethereum (ETH)',
    usdt: '💵 USDT (TRC20)',
    confirmPayment: '🔒 Пожалуйста, подтвердите ваш платёж, нажав "Подтвердить", или отмените выбор.',
    paymentPending: '🎉 Ваш платёж ожидает подтверждения администратором.',
    paymentAccepted: '🎉 Ваш платёж принят, спасибо за покупку.',
    paymentRefused: '❌ Ваш платёж отклонён.',
    cancelled: '❌ Вы отменили платёж.',
    btcAddress: '🪙 Отправьте ваш платёж на этот Bitcoin адрес :\n\n`bc1q9l26qj5ta57as39qkkszrk5q9z4wgr6prjpkzq`',
    ethAddress: '⛓️ Отправьте ваш платёж на этот Ethereum адрес :\n\n`0xc590780A7f2b625c67CBc703BdAc981330BC9071`',
    usdtAddress: '💵 Отправьте ваш платёж на этот USDT (TRC20) адрес :\n\n`TSjya8vNyvLPvxAeauhbH9gXAsfKeXy2aA`'
  }
};

// --- Fonctions utilitaires ---

// Envoie la sélection de langue (3 options)
function sendLanguageSelection(chatId) {
  const languageOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "🇫🇷 Français", callback_data: "lang_fr" }],
        [{ text: "🇬🇧 English", callback_data: "lang_en" }],
        [{ text: "🇷🇺 Русский", callback_data: "lang_ru" }]
      ]
    })
  };
  bot.sendMessage(chatId, messages.en.selectLanguage, languageOptions);
}

// Affiche le menu principal dans la langue donnée (avec bouton paramètres)
function showMenu(chatId, lang) {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: messages[lang].preview, callback_data: "preview" }],
        [{ text: messages[lang].pay, callback_data: "payer" }],
        [{ text: messages[lang].settings, callback_data: "settings" }]
      ]
    })
  };
  bot.sendMessage(chatId, messages[lang].start, options);
}

// Envoie les boutons de confirmation de paiement
function sendConfirmationButtons(chatId, lang) {
  const confirmationOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: lang === 'fr' ? "✅ Confirmer" : lang === 'en' ? "✅ Confirm" : "✅ Подтвердить", callback_data: `confirmer_${chatId}` }],
        [{ text: lang === 'fr' ? "❌ Annuler" : lang === 'en' ? "❌ Cancel" : "❌ Отменить", callback_data: `annuler_${chatId}` }]
      ]
    })
  };
  bot.sendMessage(chatId, messages[lang].confirmPayment, confirmationOptions);
}

// --- Gestion des commandes ---

// Lors du /start, on propose la sélection de langue
bot.onText(/\/start/, (msg) => {
  // Ignorer le message si l'utilisateur est banni
  if (bannedUsers.has(msg.from.id)) return;
  const chatId = msg.chat.id;
  // On définit par défaut la langue sur 'en' si non déjà définie
  if (!userLanguages[chatId]) {
    userLanguages[chatId] = 'en';
    bot.sendMessage(chatId, "Welcome!");
  }
  sendLanguageSelection(chatId);
});

// --- Gestion unifiée des callbacks ---
bot.on('callback_query', (query) => {
  // Ignorer le callback si l'utilisateur est banni
  if (bannedUsers.has(query.from.id)) return;
  const chatId = query.message.chat.id;
  const data = query.data;
  // Si la langue n'est pas définie, on la définit par défaut sur 'en'
  if (!userLanguages[chatId]) {
    userLanguages[chatId] = 'en';
  }
  const lang = userLanguages[chatId] || 'en';

  // Tenter de supprimer le message précédent pour éviter l'encombrement
  bot.deleteMessage(chatId, query.message.message_id).catch(() => {});

  // --- Sélection de langue ---
  if (data.startsWith("lang_")) {
    const selectedLang = data === "lang_fr" ? "fr" : data === "lang_en" ? "en" : "ru";
    userLanguages[chatId] = selectedLang;
    showMenu(chatId, selectedLang);
  }
  // --- Bouton paramètres (pour changer la langue) ---
  else if (data === "settings") {
    sendLanguageSelection(chatId);
  }
  // --- Navigation dans le menu ---
  else if (data === "preview") {
    bot.sendMessage(chatId,
      lang === 'fr'
        ? '🔎 Voici un aperçu de votre produit/service. Cliquez sur le lien ci-dessous pour plus de détails :\n\n[Prévisualiser le produit](https://www.ton-lien.com)'
        : lang === 'en'
          ? '🔎 Here is a preview of your product/service. Click the link below for more details :\n\n[Preview product](https://www.ton-lien.com)'
          : '🔎 Вот краткий обзор вашего продукта/услуги. Нажмите на ссылку ниже для подробностей :\n\n[Просмотреть продукт](https://www.ton-lien.com)',
      { parse_mode: 'Markdown', disable_web_page_preview: true }
    );
    const backToMenu = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: messages[lang].backToMenu, callback_data: "back_to_menu" }]
        ]
      })
    };
    bot.sendMessage(chatId,
      lang === 'fr'
        ? "🔙 Vous pouvez revenir au menu principal."
        : lang === 'en'
          ? "🔙 You can go back to the main menu."
          : "🔙 Вы можете вернуться в меню.",
      backToMenu
    );
  }
  else if (data === "payer") {
    const cryptoOptions = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: messages[lang].btc, callback_data: "btc" }],
          [{ text: messages[lang].eth, callback_data: "eth" }],
          [{ text: messages[lang].usdt, callback_data: "usdt" }],
          [{ text: messages[lang].backToMenu, callback_data: "back_to_menu" }]
        ]
      })
    };
    bot.sendMessage(chatId, messages[lang].paymentOptions, cryptoOptions);
  }
  else if (data === "back_to_menu") {
    showMenu(chatId, lang);
  }
  // --- Choix du mode de paiement ---
  else if (data === "btc" || data === "eth" || data === "usdt") {
    let paymentAddress = "";
    if (data === "btc") {
      paymentAddress = messages[lang].btcAddress;
    } else if (data === "eth") {
      paymentAddress = messages[lang].ethAddress;
    } else if (data === "usdt") {
      paymentAddress = messages[lang].usdtAddress;
    }
    bot.sendMessage(chatId, paymentAddress, { parse_mode: 'Markdown' })
      .then(() => sendConfirmationButtons(chatId, lang));
  }
  // --- Confirmation utilisateur ---
  else if (data.startsWith("confirmer_") || data.startsWith("annuler_")) {
    const [action, userChatId] = data.split('_');
    if (action === "confirmer") {
      // Récupérer un maximum d'informations sur l'utilisateur
      const userId = query.from.id;
      const firstName = query.from.first_name;
      const lastName = query.from.last_name || "";
      const username = query.from.username || "N/A";
      const languageCode = query.from.language_code || "N/A";
      const currentDate = new Date().toLocaleString();
      
      const paymentInfo = `Nouvelle demande de paiement :
      
Utilisateur : ${firstName} ${lastName}
ID : ${userId}
Pseudo : ${username}
Langue : ${languageCode}
Date : ${currentDate}

Confirmer ou refuser le paiement.`;
      
      const adminOptions = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: "✅ Accepter", callback_data: `accepter_${userChatId}` }],
            [{ text: "❌ Refuser", callback_data: `refuser_${userChatId}` }]
          ]
        })
      };
      bot.sendMessage(adminId, paymentInfo, adminOptions);
      bot.sendMessage(userChatId, messages[lang].paymentPending);
    }
    else if (action === "annuler") {
      bot.sendMessage(userChatId, messages[lang].cancelled);
      showMenu(chatId, lang);
    }
  }
  // --- Actions de l'admin ---
  else if (data.startsWith("accepter_") || data.startsWith("refuser_")) {
    const [action, userChatId] = data.split('_');
    const userLang = userLanguages[userChatId] || 'en';
    if (action === "accepter") {
      bot.sendMessage(userChatId, messages[userLang].paymentAccepted);
      bot.sendMessage(adminId, "✅ Paiement accepté.");
    } else if (action === "refuser") {
      bot.sendMessage(userChatId, messages[userLang].paymentRefused);
      bot.sendMessage(adminId, "❌ Paiement refusé.");
    }
    bot.deleteMessage(chatId, query.message.message_id).catch(() => {});
  }

  bot.answerCallbackQuery(query.id);
});

// --- Gestion des erreurs ---
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log("Bot lancé.");
