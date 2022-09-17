import react, {useState, useEffect} from "react";
import { FcSearch } from 'react-icons/fc';
import { HiX } from 'react-icons/hi';
import humidityImage from '../assets/humidity-svgrepo-com.svg';
import windSpeedImage from "../assets/wind-speed-icon.svg";
import airImage from "../assets/air.svg"
import GridLoader from "react-spinners/GridLoader";
import '../styles/weather.css';

function WeatherApp(){
    //my api keys
    const weatherApiKey = 'fd7019c29121761f9602268492840876';
    
    //my useStates
    const [searchBar, setSearchBar] = useState('');
    const [weatherData, setWeatherData] = useState();
    const [currentTempUnit, setCurrentTempUnit] = useState('F');
    const [buttonText, setButtonText] = useState('C');
    const [temp, setTemp] = useState();
    const [feelsLikeTemp, setFeelsLikeTemp] = useState();
    const [maxTemp, setMaxTemp] = useState();
    const [minTemp, setMinTemp] = useState();
    const [localDateTime, setLocalDateTime] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [err, seterr] = useState(false);
    const [weatherReport, setweatherReport] = useState(true);
    
    //function that get the search bar value when the user type something in
    function getSearchBarValue(e){
        setSearchBar(e.target.value.trim());
    }

    //checks the current state of the temperature useState 
    function convertTemperature(){
        if(currentTempUnit === 'F'){
            setCurrentTempUnit('C');
            setButtonText('F');
            setTemp((Math.round(weatherData.main.temp) - 32)/1.8);
            setMaxTemp((Math.round(weatherData.main.temp_max) - 32)/1.8);
            setMinTemp((Math.round(weatherData.main.temp_min) - 32)/1.8);
            setFeelsLikeTemp((Math.round(weatherData.main.feels_like) - 32)/1.8);   
        }else{
            setCurrentTempUnit('F');
            setButtonText('C');
            setTemp(Math.round(weatherData.main.temp));
            setMaxTemp(Math.round(weatherData.main.temp_max));
            setMinTemp(Math.round(weatherData.main.temp_min));
            setFeelsLikeTemp(Math.round(weatherData.main.feels_like));
        }
    }

     //a function that makes callouts to get data from APIs
     function fetchApiData(e){
        e.preventDefault();
        setIsLoading(true);
        //openweathermap.org api call
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchBar}&&units=imperial&appid=${weatherApiKey}`, {mode: 'cors'})
        .then(res => res.json())
        .then( data =>{
            setWeatherData(data);
            setTemp(data.main.temp);
            setMaxTemp(data.main.temp_max);
            setMinTemp(data.main.temp_min);
            setFeelsLikeTemp(data.main.feels_like);
            let date = new Date((data.sys.sunrise + data.timezone)* 1000);
            let text = date.toDateString();
            setLocalDateTime(text);
            setweatherReport(true);
            seterr(false);
            console.log(data);
            setIsLoading(false);
        })

        .catch( () => {
            setIsLoading(false);
            setweatherReport(false);
            seterr(true);
        })
    }
    return(
        <>
        
            <div className="search-container">
                <form>
                    {/* The search bar  */}
                    <input type="search" placeholder="Enter City Here" className="search-bar"  onChange={getSearchBarValue}/>
                    {/* submit button that gets the data from the API */}
                    <button type="submit" className="search-btn" onClick={fetchApiData} disabled={isLoading}> <FcSearch /></button>
                </form>
            </div>
            <div className="weather-container">
                {/*  conditionaly renders the spinner div on the page. */}
                {isLoading ? <div className="spinner-container"> <GridLoader color="#7DF9FF" size={30}/> </div> : null}
                {/*  conditional rendering the useState weatherdata when asked for and found  */}
                {weatherReport == true  && weatherData &&
                <div className="weather-content-container">
                    <div className="weather-content-1">
                        <section  className="location-date-section">
                            <span className="WD-location">{weatherData.name}, {weatherData.sys.country}</span>
                            <span className="WD-date">{localDateTime}</span>
                        </section>
                        <div className="weather-info-temp-container">
                            <section className="weather-info-seaction">
                                <img  className="WD-img" src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weatherData.weather[0]["icon"]}.svg`} />
                            </section>
                            <section className="temp-section">
                                <div className="temp-grid-container">
                                    <span className="WD-temp temp-grid-item" >{Math.round(temp)}°{currentTempUnit}</span>
                                    <span className="WD-temp-max temp-grid-item">{Math.round(maxTemp)}°{currentTempUnit}</span>
                                    <span className="WD-temp-min temp-grid-item">{Math.round(minTemp)}°{currentTempUnit}</span>
                                </div>
                                {/* this is the button that triggers the temperature conversions */}
                                <button className="WD-temp-converter" onClick={convertTemperature}>{buttonText}</button>
                            </section>
                        </div>
                        <p className="WD-main">{weatherData.weather[0].description}</p>
                        <p className="WD-feels-like"><span>Feels Like:</span> {Math.round(feelsLikeTemp)}°{currentTempUnit}</p>
                    </div>
                    <div className="weather-content-2">
                        <seaction>
                            <img  className="WD-humidity-image" src={humidityImage} alt="humidity Icon"/>
                            <p className="WD-humidity"><span>Humidity: </span>{weatherData.main.humidity}%</p>
                        </seaction>
                        <seaction>
                            <img  className="WD-windSpeed-image" src={windSpeedImage} alt="wind speed Icon"/>
                            <p className="WD-wind-speed"><span>Wind Speeds: </span>{Math.round(weatherData.wind.speed)}mph</p>
                        </seaction>
                        <seaction>
                            <img  className="WD-air-pressure-image" src={airImage}  alt="Air Pressure Icon" />
                            <p className="WD-air-pressure"><span>Air Pressure: </span>{weatherData.main.pressure}hPa</p>
                        </seaction>
                    </div>
                </div>
                }
                {err ?
                    <div className="error-container">
                        <header>
                            <h1><HiX className="error-x"/>Error!<HiX className="error-x"/></h1>
                        </header>
                        <h2>Hey! sorry we couldn't get the data you requested. Please try entering in another city!</h2>
                    </div>  
                 :null}
            </div>
        </>
    )
}

export default WeatherApp;