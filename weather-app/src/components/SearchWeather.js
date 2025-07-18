import React, {useState} from "react";
import initialBg from "../assets/initial_background.jpg"
import sunnyBg from "../assets/sunny.png"
import cloudyBg from "../assets/cloudy.png"
import rainyBg from "../assets/rainy.png"
import thunderstormsBg from "../assets/thunderstorms.png"
import clearNight from "../assets/clearNight.jpg"
import cloudynight from "../assets/cloudynight.png"
import CurrentWeather from "./CurrentWeather";


import { useEffect } from "react";


// API key for autocomplete: '973a00de27msh125ebff668ef7b6p1f780djsned0a648ac927'

const isNight = (dt, sunrise, sunset) => {
    return dt < sunrise || dt > sunset;
}
const getBackgroundImage = (main, description, isNight) => {
    const descLower = description.toLowerCase();
    const mainLower = main.toLowerCase();
    if(mainLower === "clear") {
        return  isNight ? clearNight : sunnyBg;
    }
    if(mainLower === "clouds") {
        if(descLower.includes("few") || (descLower.includes("scattered") || descLower.includes("broken"))) {

           return isNight ? clearNight: sunnyBg;
        }
        return isNight ? cloudynight: cloudyBg;
    }
    if (mainLower === "haze" || mainLower === "mist" || mainLower === "fog") return cloudyBg;
    if(mainLower === "thunderstorm") return thunderstormsBg;
    if(mainLower === "rain") return rainyBg;
    return initialBg; 

};


function SearchWeather() {
  // ------------- STATE HOOKS ------------------
    const [city, setCity] = useState(""); 
    const [selectedCity, setSelectedCity] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [background, setBackground] = useState(initialBg);

    useEffect(() => {
        // useeffect is used for weather update
        if(weather && weather.weather && weather.weather.length > 0){
            //Only run the code inside if all of this data exists
            const main = weather.weather[0].main;
            const description = weather.weather[0].description;
            const {dt, sys: {sunrise, sunset}} = weather;
            const night = isNight(dt, sunrise, sunset);
            const newBg = getBackgroundImage(main, description, night);
            setBackground(newBg);
        }
        

    }
    , [weather]);
    useEffect(() => {
        if (selectedCity) {
            fetchWeather();
        }
    }, [selectedCity]);


 
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
    : `https://api.openweathermap.org/data/2.5/weather?q=${city.split(",")[0]},US&units=imperial&appid=e59edaa7355ce7655533af75a66af53b`;
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

  //fetch weather
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

//set weather



// display
return (
    <div
     style= {{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px"
     }}
    >
    <h1 style={{
        color: "#f0f0f0",
        textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
        textAlign: "center",
        marginBottom: "20px"

    }}>
        Welcome to my weather app!
    </h1>
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
            setSelectedCity(null);
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
        {error && <p style={{color: "purple"}}>{error}</p>}

        {weather && <CurrentWeather weather={weather} selectedCity={selectedCity} />}

        
    </div> //end of rendered jsx
   ); //end of return
 } // end of function SearchWeather
export default SearchWeather;
