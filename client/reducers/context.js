import {
  CONTEXT_UPDATE
} from 'actions/context';

import {
  CHAT_LOAD,
  CHAT_GET_REQUEST,
  CHAT_GET_SUCCESS,
  CHAT_STORIES_REQUEST,
  CHAT_STORIES_SUCCESS,
  CHAT_STORIES_EXPAND,
  CHAT_GALLERY_REQUEST,
  CHAT_GALLERY_SUCCESS,
  CHAT_GALLERY_EXPAND
} from 'actions/chats';

import {
  USER_CHATS_SUCCESS
} from 'actions/users';

import {
  STORY_NEW
} from 'actions/stories';

import {
  LOCATION_CHANGE
} from 'react-router-redux';

import {
  REHYDRATE
} from 'redux-persist/constants';

const initialState = {
  chats: {},
  key: undefined,
  scrollHistory: {
    lastKey: undefined
  }
};

const initialChat = {
  stories: { new: 0, unread: 0, skip: 0, loaded: 0 },
  gallery: { new: 0, unread: 0, loaded: 0 }
};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case CONTEXT_UPDATE : {
      state = Object.assign({}, initialState, state, {
        [action.context]:
          (typeof action.data == 'object' ? {
            ...state[action.context],
            ...action.data
          } : action.data)
      });
      return state;
    }
    case CHAT_GET_REQUEST :
    case CHAT_STORIES_REQUEST :
    case CHAT_GALLERY_REQUEST : {
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...state.chats[action.id],
            loading: {
              ...state.chats[action.id].loading,
              [action.name]: true
            }
          }
        }
      }
    }
    case CHAT_GET_SUCCESS : {
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...state.chats[action.id],
            loading: {
              ...state.chats[action.id].loading,
              [action.name]: false
            }
          }
        }
      }
    }
    case CHAT_LOAD : {
      // Quiet does not update/reset context (used when came from history)
      if(!action.quiet) {
        return {
          ...state,
          chats: {
            ...state.chats,
            [action.id]: {
              ...state.chats[action.id],
              stories: {
                ...(state.chats[action.id] ?
                  state.chats[action.id].stories : {}),
                ...initialChat.stories
              },
              gallery: {
                ...(state.chats[action.id] ?
                  state.chats[action.id].gallery : {}),
                ...initialChat.gallery
              }
            }
          }
        };
      }
      return state;
    }
    case USER_CHATS_SUCCESS : {
      const chats = Object.assign(...action.res.data.map(c => ({[c.id]: {
        stories: {
          ...initialChat.stories,
          ...(state.chats[c.id] ? state.chats[c.id].stories : {})
        },
        gallery: {
          ...initialChat.gallery,
          ...(state.chats[c.id] ? state.chats[c.id].gallery : {})
        }
      }})));
      return {
        ...state,
        chats: {
          ...state.chats,
          ...chats
        }
      }
    }
    case CHAT_STORIES_SUCCESS :
    case CHAT_STORIES_EXPAND : {
      const { limit, skip, total } = action.res;
      const chat = state.chats[action.id];
      let loaded = 0;
      if(chat !== undefined) {
        loaded = chat.stories.loaded;
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...chat,
            stories: {
              ...initialChat.stories,
              ...(chat ? chat.stories : {}),
              skip: action.quiet ?
                chat.stories.skip : skip,
              total: total !== undefined ? total : chat.stories.total,
              limit: limit !== undefined ? limit : chat.stories.limit,
              loaded: skip > (loaded || 0) ? skip : loaded
            },
            loading: {
              ...chat.loading,
              stories: false
            }
          }
        }
      };
    }
    case CHAT_GALLERY_SUCCESS :
    case CHAT_GALLERY_EXPAND : {
      const { limit, skip, total } = action.res;
      const chat = state.chats[action.id];
      let loaded = 0;
      if(chat !== undefined) {
        loaded = chat.gallery.loaded;
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...chat,
            gallery: {
              ...initialChat.gallery,
              ...(chat ? chat.gallery : {}),
              skip,
              total,
              limit,
              loaded: skip > (loaded || 0) ? skip : loaded
            },
            loading: {
              ...chat.loading,
              gallery: false
            }
          }
        }
      };
    }
    case STORY_NEW : {
      state = {...state};
      let chat = state.chats[action.data.chatId];
      if(chat !== undefined)
        chat.stories.new++;
      return state;
    }
    case REHYDRATE : {
      const incoming = {...action.payload.context};
      delete incoming.scrollHistory;
      delete incoming.key;
      delete incoming.online;
      // Clean up chats context for skip and loaded data
      if(incoming.chats) {
        Object.keys(incoming.chats).map(id => {
          let chat = incoming.chats[id];
          chat.stories.skip = chat.stories.loaded = 0;
          chat.gallery.skip = chat.gallery.loaded = 0;
        });
      }
      return {
        ...state,
        ...incoming,
        rehydrated: true
      }
    }
    default :
      return state;
  }
}
