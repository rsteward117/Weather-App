import react, {useState} from "react";
import '../styles/weather.css';
import { FcSearch } from 'react-icons/fc';
import humidityImgae from '../assets/humidity-svgrepo-com.svg'

function WeatherApp(){
//my useStates
    const [searchBar, setSearchBar] = useState('');
    const [weatherData, setWeatherData] = useState();
    const [currentTempUnit, setCurrentTempUnit] = useState('Farenheit');
    const [buttonText, setButtonText] = useState('C');

//function that get the search bar value when the user type something in
    function getSearchBarValue(e){
        setSearchBar(e.target.value.trim());
    }

//  a function that I am currently working that toggle convert the temperature units from Farenheit to Celcius and back.
//  I've got it to console log the correct value, but I have no clue how display the changed value on the page.
//  where you see "<span>{Math.round(weatherData.main.temp)}</span>" the conditionaly rendered jsx below. 
    function convertTemperature(){
        let tempUnit;
        
        if(currentTempUnit === 'Farenheit'){
            setCurrentTempUnit('Celcius');
            tempUnit = ( Math.round(weatherData.main.temp) - 32)/1.8;
            //setWeatherData(tempUnit)
            setButtonText('F');
        }else{
            setCurrentTempUnit('Farenheit');
            setButtonText('C');
        }

        console.log(tempUnit)
    }

//an async function that calls for weather data from an API. get the data then store that data in the weatherData useState to be used later. 
    async function getWeatherFromAPI(e){
        e.preventDefault();
        const apiKey = 'fd7019c29121761f9602268492840876';
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchBar}&&units=imperial&appid=${apiKey}`, {mode: 'cors'})
            const storeWeatherData = await response.json();
            setWeatherData(storeWeatherData);
            console.log(storeWeatherData);
            
        }catch(err){
            err=alert("Im sorry we couldn't get you weather data")
        }
    }
    return(
        <>
            <div className="search-container">
                <form>
                    {/* The search bar  */}
                    <input type="search" placeholder="Enter City Here" className="search-bar"  onChange={getSearchBarValue}/>
                    {/* submit button that gets the data from the API */}
                    <button type="submit" className="search-btn"><FcSearch onClick={getWeatherFromAPI}/></button>
                </form>
            </div>
            <div className="weather-container">
                {/*  conditional rendering the useState weatherdata when asked for and found  */}
                {weatherData && 
                <div className="weather-content-container">

                    <section className="seaction-1">
                        <span>{weatherData.name}</span>
                        <span>{weatherData.sys.country}</span>
                        <img src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weatherData.weather[0]["icon"]}.svg`} />
                        {/* this is where I want to change values from F to C and back */}
                        <span>{Math.round(weatherData.main.temp)}</span>
                        <span>{Math.round(weatherData.main.temp_max)}</span>
                        <span>{Math.round(weatherData.main.temp_min)}</span>
                        {/* this is the button that triggers the temperature conversions */}
                        <button onClick={convertTemperature}>{buttonText}</button>
                    </section>

                    <section className="seaction-2">
                        <span>{weatherData.weather[0].description}</span>
                        <span>{weatherData.weather[0].main}</span>   
                    </section>

                    <section className="seaction-3">
                    <img src={humidityImgae} alt="humidity Icon"/>
                    <span>{weatherData.main.humidity}</span>
                    </section>
                </div>
                }

            </div>
        </>
    )
}

export default WeatherApp;