const errors = require('feathers-errors');
const parseDateQuery = require('../../hooks/parse-date-query');
const { when, populate, discard, disallow, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common');
const { restrictToAuthenticated, restrictToOwner } = require('feathers-authentication-hooks');
const { restrictChatContent, restrictChatContentErrors } = require('../../hooks/chat-restrictions');

const restrictToOneRunningStory = () => hook => {
  return hook.service.find({
    query: {
      chatId: hook.data.chatId,
      userId: hook.data.userId,
      status: 'active'
    }
  }).then(res => {
    if(res.data.length) {
      throw new errors.Forbidden('You can only have one running story. Perhaps you\'d like to /endstory before starting a new one?');
    } else {
      return hook;
    }
  });
};

const removePosts = () => hook => {
  const postService = hook.app.service('posts');
  const promises = [];
  return postService.find({
    paginate: false,
    query: {
      storyId: hook.id
    }
  }).then(data => {
    data.forEach(post => {
      promises.push(postService.remove(post.id).catch(() => hook));
    });
    return Promise.all(promises).then(() => hook);
  })
};

module.exports = {
  before: {
    all: [
      // Parse int
      hook => {
        if(hook.params.query && hook.params.query.chatId) {
          hook.params.query.chatId = parseInt(hook.params.query.chatId);
        }
        if(hook.params.query && hook.params.query.userId) {
          hook.params.query.userId = parseInt(hook.params.query.userId);
        }
        return hook;
      }
    ],
    find: [
      parseDateQuery('createdAt'),
      parseDateQuery('updatedAt')
    ],
    get: [
      // Fix integer ID
      hook => {
        hook.id = parseInt(hook.id);
        return hook;
      }
    ],
    create: [
      disallow('rest', 'socketio'),
      ...restrictChatContent,
      restrictToOneRunningStory(),
      setCreatedAt()
    ],
    update: [
      disallow('rest', 'socketio'),
      setUpdatedAt()
    ],
    patch: [
      disallow('rest', 'socketio'),
      setUpdatedAt()
    ],
    remove: [
      restrictToAuthenticated(),
      restrictToOwner({
        idField: 'id',
        ownerField: 'userId'
      }),
      removePosts()
    ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('_id')
      ),
      populate({
        schema: {
          include: [
            {
              nameAs: 'user',
              service: 'users',
              parentField: 'userId',
              childField: 'id',
              useInnerPopulate: true
            },
            {
              nameAs: 'posts',
              service: 'posts',
              parentField: 'id',
              childField: 'storyId',
              asArray: true,
              paginate: false,
              useInnerPopulate: true,
              query: {
                $sort: {
                  sentAt: 1
                }
              }
            }
          ]
        }
      })
    ],
    find: [],
    get: [
      populate({
        schema: {
          include: [
            {
              nameAs: 'chat',
              service: 'chats',
              parentField: 'chatId',
              childField: 'id',
              useInnerPopulate: true
            }
          ]
        }
      })
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      ...restrictChatContentErrors,
      hook => {
        if(hook.error.message == 'You do not have valid permissions to access this.') {
          hook.error = new errors.Forbidden(`You do not have valid permissions to create a story.`);
        }
        return hook;
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
