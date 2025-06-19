import React, {useState} from "react";

// API key for autocomplete: '973a00de27msh125ebff668ef7b6p1f780djsned0a648ac927'
function SearchWeather() {
  // ------------- STATE HOOKS ------------------
    const [city, setCity] = useState(""); 
    const [selectedCity, setSelectedCity] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);


  // ------------- FETCH WEATHER FUNCTION ------------------
const fetchWeather = () => {
    setLoading(true); //show loading spinner 
    setError(""); //
    setWeather(null); //clearing prev wewather so it doesnt linger

    //Prevent unnecessary API calls with no input
    if (!city && !selectedCity) {
        setError("Please enter valid location");
        setLoading(false);
        return;
    }
    //use coordinates if selectedCity is available since a city can be named same across multiple states 
    const url = selectedCity
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.latitude}&lon=${selectedCity.longitude}&units=imperial&appid=e59edaa7355ce7655533af75a66af53b`
    // for if user selects city from suggestions
    : `https://api.openweathermap.org/data/2.5/weather?q=${city},US&units=imperial&appid=e59edaa7355ce7655533af75a66af53b`;
    // if not, just use city name 

    //Catch and handle any errors that still happen during the request
    fetch(url)
        .then(res => {
            if(!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => {
            setWeather(data);
            setLoading(false);
        })
        .catch(err =>  {
            setError(err.message);
            setWeather(null);  

        })
        .finally(() => {
        setLoading(false);
    });
};

  // ------------- FETCH AUTOCOMPLETE SUGGESTIONS FUNCTION ------------------

const fetchSuggestions = (query) => {
    // query is the text user types
    if(!query) {
        setSuggestions([]);
        return;
        // if user hasnt typed anything, clear suggestions list
    }
    
       //  Query API for US cities starting with what the user typed
       fetch(`https://us1.locationiq.com/v1/search?key=pk.d78434be1246c64bf8d39dbca5fcdc6b&q=${query}&countrycodes=us&limit=10&normalizecity=1&dedupe=1&format=json`)
        .then(res => res.json())
        .then(data => {
            //place = variable to hold resulr from lcoationIQ's /v1/search endpoint
            // display name: properly returned by LocationIQ
            //place.display.name.toLowerCase(): converts whole address to lowercase
            ///includes query: converts only user input (like "phila")
            const filtered = data.filter(place => 
                // display_name is the property returned by LocationIQ's API
                place.display_name.toLowerCase().includes(query.toLowerCase())
                );
                setSuggestions(filtered.slice(0, 10));
            })
            .catch(() => setSuggestions([]));

};


return (
    <div>
      <h2>Search Weather by City</h2>

      <div style={{ 
        position: 'relative',
         width: 'fit-content',
         margin: '0 auto',
         textAlign: 'left'
         }}>
       <input 
            type="text" 
            value={city}
            onChange={(e) => {
            const inputValue = e.target.value;
            setCity(inputValue);
            fetchSuggestions(inputValue);
            }}
       />

       {/*autocomplete suggetsions (only runs if there are suggstions in the array*/}
       {/* this is out of list */} 
       {/*<ul = outer list container */}
        {/*<li = inner list container */}
       
       {suggestions.length > 0 && (
        <ul 
         style= {{
            
            position: "absolute",
            // makes box appear right under search button
            top: "100%",
            left: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: 0,
            margin: 0,
            listStyle: "none",
            maxWidth: "200px",
            width: "100%",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
         }}
         >

                 {/* this is inside of list */}
            {suggestions.map((place, index) => (
                <li
                    key={index}
                    style={{padding: "5px", cursor: "pointer"}}
                    onClick={() => {
                        setCity(place.display_name);
                        setSelectedCity({
                            latitude: place.lat,
                            longitude: place.lon,
                            displayName: place.display_name
                        });
                      setSuggestions([]);
                    }}
                 >
                     {place.display_name}
                </li>
            ))}
        </ul>
       )}
       </div>

        {/*button to fetch weather */}
        <button onClick={fetchWeather}>Get Weather</button>

        {/*show status*/}

        {loading && <p>Loading..</p>}
        {error && <p style={{color: "red"}}>{error}</p>}

        {weather && (
            <div>
                <h3>
                    Weather in {selectedCity ? selectedCity.displayName: weather.name}</h3>
                    {/* // If a selected city exists (user clicked a dropdown option), display full address.
                    // Otherwise, just display the basic name returned by the weather API. */}

                    {/* OpenWeatherAPI responses */}
                <p>Temperature: {weather.main.temp}°F</p>
                <p>Description: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind: {weather.wind.speed} mph</p>
        </div>
        )}
    </div> //end of rendered jsx
   ); //end of return
 } // end of function SearchWeather
export default SearchWeather;
