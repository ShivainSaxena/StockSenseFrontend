import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import toast from "react-hot-toast";
import InsightProfile from "./InsightProfile";
import { useStockContext } from "../hooks/useStockContext";
import MediaQuery from "react-responsive";

const InsightContent = () => {
  const { state } = useStockContext();
  const { AuthFetch } = useFetch();
  const { user } = useAuthContext();
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["Symbol", "Name", "Industry"]);

  const [clicked, setClicked] = useState("");
  const [searching, setSearching] = useState(true);

  function search(items) {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  const handleValue = () => {
    if (!clicked) {
      return q;
    } else {
      return clicked;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearching(false);
    const symbol = clicked.split(" ")[0];
    const response = await AuthFetch(`/api/predict/${symbol}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Failed to fetch stock insights");
      setSearching(true);
      setQ("");
      setClicked("");
      setLoading(false);
    } else {
      setLoading(false);
      setInsightData(data);
    }
  };

  return (
    <div className="content">
      <section className="searchbar">
        <h1 className="insight-head">
          Enter a Stock Symbol for Trend Predictions and Insights:
        </h1>
        {/* <div
          style={{
            pointerEvents: clicked ? "none" : "auto",
          }}
        >
          <input
            type="search"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <button
            disabled={!symbol || clicked}
            onClick={handleSearch}
            style={{
              pointerEvents: !symbol ? "none" : "auto",
              background: !symbol ? "#3d2fb6" : "#5542f6",
            }}
          >
            Search
          </button>
        </div> */}
        <div
          className="search-area"
          style={{ pointerEvents: !searching ? "none" : "auto" }}
        >
          <input
            type="search"
            value={handleValue()}
            onChange={(e) => {
              setQ(e.target.value);
              setSearching(true);
              setClicked("");
            }}
          />

          <MediaQuery maxWidth={650}>
            <br />
          </MediaQuery>

          <button
            style={{
              pointerEvents: !clicked ? "none" : "auto",
              background: !clicked ? "#3d2fb6" : "#5542f6",
            }}
            onClick={handleSearch}
            disabled={!searching}
          >
            Search
          </button>

          <div
            className="all-results"
            style={{ display: !searching ? "none" : "block" }}
          >
            <table>
              {q ? (
                <tbody>
                  <tr
                    style={{
                      display: search(state).length > 0 ? "table-row" : "none",
                    }}
                  >
                    <td>Symbol</td>
                    <td>Company Name</td>
                    <td>Industry</td>
                  </tr>
                  {search(state)
                    .slice(0, 100)
                    .map((item) => (
                      <tr
                        onClick={() => {
                          setClicked(
                            `${item.Symbol} - ${item.Name} - ${item.Industry}`
                          );
                        }}
                        key={item._id}
                      >
                        <td>{item.Symbol}</td>
                        <td>{item.Name}</td>
                        <td>{item.Industry}</td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                <></>
              )}
            </table>
            {q && (
              <div
                className="no-results"
                style={{
                  display: search(state).length === 0 ? "block" : "none",
                }}
              >
                No results found
              </div>
            )}
          </div>
        </div>
      </section>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="loader"></div>
        </div>
      )}
      {insightData && (
        <>
          <InsightProfile data={insightData} />
          <div className="search-actions">
            <button
              onClick={() => {
                setInsightData(null);
                setSearching(true);
                setQ("");
                setClicked("");
              }}
            >
              Search New stock
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InsightContent;
