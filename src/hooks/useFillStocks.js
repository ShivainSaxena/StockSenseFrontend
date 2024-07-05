import { useStockContext } from "./useStockContext";

export const useFillStocks = () => {
  const { dispatch } = useStockContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const fillstocks = async (token) => {
    const response = await fetch(`${apiUrl}/api/stock/all-symbols`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: "FILL", payload: data });
    }
    if (response.status === 401) {
      localStorage.removeItem("user");
      return true;
    }
  };

  return { fillstocks };
};
