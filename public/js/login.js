/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/users/login',
      { 'email': email, 'password': password });
    if (res.data.status === 'sucess') {
      console.log('scucessfully here')
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/v1/users/logout')
    if ((res.data.status = 'sucess')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
