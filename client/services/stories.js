import { created, patched, removed } from 'actions/stories';
import Realtime from './realtime';
import { hasUser } from './auth';

export default function init (store) {

  const realtime = new Realtime('stories', {
    bindings: {
      created: data => {
        store.dispatch(created(data));
      },
      patched: data => {
        store.dispatch(patched(data));
      },
      removed: data => {
        store.dispatch(removed(data));
      }
    }
  });

  const batchRemove = (ids) => {
    ids.forEach(id => {
      store.dispatch(removed({id: id}));
    });
  };

  return {
    realtime,
    batchRemove
  }
};

// Utils

export function canRemove (story, auth) {
  return hasUser(auth) && story.userId == auth.user.id;
}
