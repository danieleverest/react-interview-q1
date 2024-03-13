import "./App.css";
import { useState, useEffect } from "react";
import { getLocations, isNameValid } from "./mock-api/apis";
import { debounce } from "lodash";

function App() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getLocations();
        setCountryOptions(countries);
        setCountry(countries[0]); // Set default country value
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const validateName = async (value) => {
    try {
      const isValid = await isNameValid(value);
      setError(isValid ? null : "The name is already taken");
    } catch (error) {
      console.error("Error validating name:", error);
      setError("Error validating name");
    }
  };

  const debouncedValidateName = debounce(validateName, 500);

  const handleChangeName = (e) => {
    const value = e.target.value;
    setName(value);
    debouncedValidateName(value);
  };

  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
  };

  const handleClearInputs = () => {
    setName("");
    setCountry(countryOptions[0]);
    setError(null);
  };

  const handleAdd = () => {
    const newItem = { name, country };
    const isDuplicate = tableData.some(
      (item) => item.name === newItem.name && item.country === newItem.country
    );

    if (isDuplicate) {
      setError("This entry already exists in the table");
    } else {
      setTableData([...tableData, newItem]);
      handleClearInputs();
    }
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-3 input-label">Name</div>
        <div className="col-md-9">
          <input
            className="form-control"
            value={name}
            onChange={handleChangeName}
          />
          {!!error && <div className="text-danger">{error}</div>}
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-3 input-label">Country</div>
        <div className="col-md-9">
          <select
            className="form-control"
            value={country}
            onChange={handleChangeCountry}
          >
            {countryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row my-4 justify-content-end">
        <div className="col-md-3">
          <button
            className="btn btn-secondary btn-block"
            onClick={handleClearInputs}
          >
            Clear
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary btn-block"
            onClick={handleAdd}
            disabled={!!error || name === ""}
          >
            Add
          </button>
        </div>
      </div>
      <div className="row my-4">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, i) => (
                <tr key={i} className="table-light">
                  <td>{item.name}</td>
                  <td>{item.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
