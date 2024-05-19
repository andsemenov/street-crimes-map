/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useMap } from "../contexts/MapContext";

// eslint-disable-next-line react/prop-types
function Dashboard() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { setSelectedDate, lastAvailableDate } = useMap();

  const lastAvailableYear = lastAvailableDate.slice(0, 4);
  const lastAvailableMonth = lastAvailableDate.slice(5, 7);

  const [options] = useState([
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]);

  useEffect(() => {
    const validDate = (date1, date2) => {
      return new Date(date1).getTime() <= new Date(date2).getTime();
    };
    if (month !== "" && year !== "") {
      if (validDate(`${year}-${month}`, lastAvailableDate)) {
        setSelectedDate(`${year}-${month}`);
      } else {
        alert("Please select a date before last updated");
      }
    }
  }, [month, year, lastAvailableDate, setSelectedDate]);

  return (
    <div className="selects">
      <select
        title="Year"
        name="select-year"
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
        }}
      >
        <option value="">Choose a Year</option>
        <option value={lastAvailableYear}>{lastAvailableYear}</option>
        <option value={lastAvailableYear - 1}>{lastAvailableYear - 1}</option>
        <option value={lastAvailableYear - 2}>{lastAvailableYear - 2}</option>
      </select>
      <select
        title="Month"
        name="select-month"
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
        }}
      >
        <option value="">Choose a Month</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={
              year === lastAvailableYear && option.value > lastAvailableMonth
            }
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dashboard;
