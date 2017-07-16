module.exports = function () {

  const app = this;
  const { bot, user } = app.telegram;
  const { isPublisher } = user;
  const service = app.service('chats');
  const userService = app.service('users');

  function updateChat (chat) {
    return service.find({ query: { id: chat.id } }).then(res => {
      if(res.data.length) {
        return service.patch(chat.id, chat);
      } else {
        return service.create(chat);
      }
    });
  }

  function createMessageChats (message) {
    let promises = [];
    if(message.chat)
      promises.push(updateChat(message.chat));
    if(message.forwarded_from_chat)
      promises.push(updateChat(message.forwarded_from_chat));
    return Promise.all(promises).then(() => {
      return message;
    });
  }

  function validatePrivateChat (message) {
    const user = message.from;
    return new Promise((resolve, reject) => {
      if(message.chat.type == 'private') {
        userService.find({ query: { id: user.id } }).then(res => {
          if(!res.data.length || !isPublisher(res.data[0])) {
            reject('User not authorized.');
          } else {
            resolve(message);
          }
        });
      } else {
        resolve(message);
      }
    });
  }

  function isGroupInvite (message) {
    if(message.group_chat_created) {
      return true;
    } else if(message.new_chat_members) {
      let isBotInvite = false;
      message.new_chat_members.forEach(member => {
        if(member.username == app.get('telegram').botName) {
          isBotInvite = true;
        }
      });
      return isBotInvite;
    } else {
      return false;
    }
  }

  function unauthorizedLeave (message) {
    const chatId = message.chat.id;
    bot.sendMessage(chatId, 'I\'m not authorized to publish content from this group! I must be invited by a publisher.').then(() => {
      bot.leaveChat(chatId);
    });
  }

  function validateGroupInvite (message) {
    return new Promise((resolve, reject) => {
      if(isGroupInvite(message)) {
        const chatId = message.chat.id;
        const { isPublisher } = user;
        userService.find({
          query: {
            id: message.from.id
          }
        }).then(res => {
          if(res.data.length) {
            const user = res.data[0];
            if(isPublisher(user)) {
              bot.sendMessage(chatId, 'I\'m ready to start publishing content from this group!');
              resolve(message);
            } else {
              unauthorizedLeave(message);
              reject();
            }
          } else {
            unauthorizedLeave(message);
            reject();
          }
        });
      } else {
        resolve(message);
      }
    });
  }

  return Object.assign(app.telegram || {}, {
    chat: {
      validatePrivateChat,
      isGroupInvite,
      validateGroupInvite,
      createMessageChats
    }
  });

};
