import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useMap } from "../contexts/MapContext";
import { Icon } from "leaflet";
import regionalCenters from "../assets/data/data.json";
import icon1 from "../assets/images/map_pin_blue5.svg";
import PopupInformation from "./PopupInformation";

const crimeIcon = new Icon({
  iconUrl: icon1,
  iconSize: [25, 25],
});

function MapPackage() {
  const {
    dataCrimes,
    setDataCrimes,
    setLoading,
    setIsError,
    currentCoordinates,
    setCurrentCoordinates,
    selectedDate,
  } = useMap();

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
  }, [currentCoordinates, selectedDate, setDataCrimes, setIsError, setLoading]);

  return (
    <MapContainer center={[54.5, -3]} zoom={5.5} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {regionalCenters.map((eachData) => (
        <Marker
          key={eachData.id}
          position={[eachData.Latitude, eachData.Longitude]}
          eventHandlers={{
            click: () => {
              setCurrentCoordinates([eachData.Latitude, eachData.Longitude]);
            },
          }}
          icon={crimeIcon}
        />
      ))}

      {currentCoordinates.length === 2 && dataCrimes && <PopupInformation />}
    </MapContainer>
  );
}

export default MapPackage;
