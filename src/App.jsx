import { MapProvider } from "./contexts/MapContext";
import MapPackage from "./components/MapPackage";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";

function App() {
  return (
    <MapProvider>
      <Header>
        <Dashboard />
      </Header>
      <MapPackage />
    </MapProvider>
  );
}

export default App;
