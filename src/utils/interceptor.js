import { STORAGE_KEY } from '../constants';

export default {
  responseError: (response) => {
    if (response && response.error && response.error.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "#!/login";
    }
  }
};