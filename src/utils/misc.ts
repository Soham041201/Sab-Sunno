import { Dispatch } from 'react';
import { setNotification } from '../redux/slice/notificationSlice';

export const copy = (dispatch: Dispatch<any>) => {
  const el = document.createElement('input');
  el.value =
    'Join me and my friends having an amazing conversation at ' +
    window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    dispatch(
      setNotification({ type: 'success', message: 'Link copied to clipboard' })
    );
  };