import { useLogout } from "./useLogout";

export const useFetch = () => {
  const { logout } = useLogout();
  const apiUrl = process.env.REACT_APP_API_URL;

  const AuthFetch = async (url, options = {}) => {
    const response = await fetch(`${apiUrl}${url}`, options);

    if (response.status === 401) {
      // Handle the unauthorized requests
      logout();
    }

    return response;
  };

  return { AuthFetch };
};
