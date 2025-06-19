import React, {useEffect, useState } from "react";

//my API key: e59edaa7355ce7655533af75a66af53b
function LansdaleWeather() {
    //state to hold the weather data
    //saves data and status 
    const [weather, setWeather] = useState(null);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState("");

    //useEffect runs the fetch when component shows up
    useEffect(() => {
        fetch (
            'https://api.openweathermap.org/data/2.5/weather?q=Lansdale,US&units=imperial&appid=e59edaa7355ce7655533af75a66af53b'
        )
        .then((res) => {
            if(!res.ok) throw new Error("Failed to fetch weather. Try Again");
            //if response is not OK, throw error
            return res.json(); //parse json data 
        })
        .then((data) => {
            setWeather(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading = false;


        })
    }, []);  //react hook. tells you run this code once, right after component mounts
    if (loading) return <p>Loading weather...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div>
            <h2>{weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p>Temperature: {weather.main.temp}°F </p>
            <p>Humidity: {weather.main.humidity}</p>
            <p> Wind: {weather.wind.speed}</p>





        </div>
    )
}
export default LansdaleWeather;