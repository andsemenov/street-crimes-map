import { createContext, useContext, useEffect, useState } from "react";

const MapContext = createContext();

// eslint-disable-next-line react/prop-types
function MapProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [lastAvailableDate, setLastAvailableDate] = useState("");
  const [dataCrimes, setDataCrimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState([]);

  useEffect(() => {
    async function fetchLastAvailableDate() {
      try {
        const resp = await fetch(
          "https://data.police.uk/api/crime-last-updated"
        );
        if (resp.ok) {
          const json = await resp.json();
          setLastAvailableDate(json.date.slice(0, 7));
          setSelectedDate(json.date.slice(0, 7));
        } else {
          throw new Error(
            `Error fetching last available date: ${resp.statusText}`
          );
        }
      } catch (e) {
        console.error("Failed to fetch last available date:", e);
        setIsError(
          "Failed to fetch last available date. Please try again later."
        );
      }
    }
    fetchLastAvailableDate();
  }, []);

  useEffect(() => {
    async function fetchData(lat, lon, date) {
      try {
        setLoading(true);
        const resp = await fetch(
          `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=${date}`
        );

        if (!resp.ok) {
          throw new Error(`Error fetching data: ${resp.statusText}`);
        }

        const json = await resp.json();
        setDataCrimes(json);
        setIsError("");
      } catch (e) {
        console.error("Failed to fetch crime data:", e);
        setIsError(`Failed to fetch crime data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (currentCoordinates.length === 2) {
      fetchData(currentCoordinates[0], currentCoordinates[1], selectedDate);
    }
  }, [currentCoordinates, selectedDate]);

  return (
    <MapContext.Provider
      value={{
        lastAvailableDate,
        selectedDate,
        setSelectedDate,
        dataCrimes,
        setDataCrimes,
        loading,
        setLoading,
        isError,
        setIsError,
        currentCoordinates,
        setCurrentCoordinates,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}

export { MapProvider, useMap };
