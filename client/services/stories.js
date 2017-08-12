import client from 'services/feathers';
import { created, patched, removed } from 'actions/stories';

import { hasUser } from './auth';

const service = client.service('stories');

export default function init (store) {
  const _created = data => {
    store.dispatch(created(data));
  };
  const _patched = data => {
    store.dispatch(patched(data));
  };
  const _removed = data => {
    store.dispatch(removed(data));
  };
  const subscribe = () => {
    service.on('created', _created);
    service.on('patched', _patched);
    service.on('removed', _removed);
  };
  const unsubscribe = () => {
    service.off('created', _created);
    service.off('patched', _patched);
    service.off('removed', _removed);
  };
  subscribe();
  return {
    subscribe,
    unsubscribe
  }
};

// Utils

export function canRemove (story, auth) {
  return hasUser(auth) && story.userId == auth.user.id;
}
