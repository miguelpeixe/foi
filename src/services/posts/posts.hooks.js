const errors = require('feathers-errors');
const { authenticate } = require('feathers-authentication').hooks;
const { iff, populate } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be created internally');
        return hook;
      },
      // Assign to story
      hook => {
        const storyService = hook.app.service('stories');
        return storyService.find({
          query: {
            userId: hook.data.userId,
            status: 'active'
          }
        }).then(res => {
          if(res.data.length) {
            hook.data.storyId = res.data[0].id;
          }
          return hook;
        }).catch(res => {
          return hook;
        });
      }
    ],
    update: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be updated internally');
        return hook;
      }
    ],
    patch: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be patched internally');
        return hook;
      }
    ],
    remove: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be removed internally');
        return hook;
      }
    ]
  },

  after: {
    all: [
      populate('media', {field: 'mediaId', service: 'media'}),
      populate('user', {field: 'userId', service: 'users'}),
      populate('creator', {field: 'creatorId', service: 'users'})
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
