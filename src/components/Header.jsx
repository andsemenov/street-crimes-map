import { useMap } from "../contexts/MapContext";

// eslint-disable-next-line react/prop-types
function Header({ children }) {
  const { selectedDate, lastAvailableDate } = useMap();

  return (
    <div className="header">
      <div className="header-title">
        <h1>Street-level crimes during {selectedDate}</h1>
        <p>{`(last updated ${lastAvailableDate})`}</p>
        {children}
      </div>
    </div>
  );
}

export default Header;
