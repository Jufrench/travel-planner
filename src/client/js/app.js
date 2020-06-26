import { updateUI } from './ui';
import { createTripElement } from './trip';

let the_TripArray = [];
let tripsArray = [];

// ==== getCity_str function ====
const getCity_str = () => {
    return document.querySelector('#city-input').value;
};

// ==== getDate_arr function ====
const getDate_arr = () => {
    let dateArray = document.querySelector('#date-input').value.split('-');
    dateArray = dateArray.map(date => parseInt(date));
    dateArray[1]--;

    return dateArray;
};

// const clearInputs = () => {
//     document.querySelector('#city-input').value;
//     document.querySelector('#date-input').value = '';
// };

const checkTravelInfo = () => {
    const travelData = {};
    const dateArr = getDate_arr();

    // Add to travelData object the trip city if it's provided
    if (getCity_str().length > 0) {
        travelData['city'] = getCity_str();
    } else {
        return false;
    }

    // Check that all dates are present
    const datesPresent = dateArrParam => {
        // If user didn't fill in all 3 dates, the array length will be less than 3
        return dateArrParam.length < 3 ? false : true;
    };

    // Add to travelData object the departure date if it's provided
    if (datesPresent(dateArr)) {
        // travelData['trip_date'] = getDate_arr();
        travelData['trip_date'] = dateArr;
    } else {
        return false;
    }

    const tripDate = new Date(dateArr[0], dateArr[1], dateArr[2]);
    const dateNow = new Date();
    const dateNowPlus8 = new Date();
    dateNowPlus8.setDate(dateNow.getDate() + 8);

    // if the date of the trip is less than the current day + 8 days, show the current weather
    if (tripDate < dateNowPlus8) {
        travelData['weather_data'] = 'current';
    } else {
        // Otherwise, show the forecasted weather
        travelData['weather_data'] = 'forecast';
    }

    // We need to increase the month value by 1 because the native date methods starts at 
    // 0 for January, not 1;
    travelData.trip_date[1]++;
    return travelData;
};

const postUserInput = async dataParam => {
    let fetchRes;
    fetchRes = await fetch('http://localhost:3000', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataParam),
    });

    return fetchRes;
};

const getTravelData = async () => {
    let data;
    try {
        const fetchRes = await fetch('http://localhost:3000/data').then(res => res.json());
        data = fetchRes;
    } catch (error) {
        console.log(error);
    }

    return data;
};

const getCountdown = tripDateParam => {
    const dateNow = new Date();
    const tripDate = new Date(tripDateParam[0], tripDateParam[1] - 1, tripDateParam[2]);
    let daysAway = Math.ceil((tripDate - dateNow) / 86400000);

    return daysAway;
};

const createTrip = objParam => {
    const daysAway = getCountdown(objParam.date);
    const trip = createTripElement({
        id: objParam.id,
        city: objParam.city,
        country: objParam.country,
        date: objParam.date,
        weather_to_get: objParam.weather_to_get,
        weather: objParam.weather,
        imageURL: objParam.imageURL,
        dataDate: new Date(objParam.date[0], objParam.date[1] - 1, objParam.date[2]).getTime(),
        daysAway
    });

    return trip;
};

const removeTrip = idParam => {
    const filteredArr = the_TripArray.filter(item => item.id !== idParam);
    the_TripArray = filteredArr;
    updateUI(filteredArr);
};

const addTripToArray = tripParam => {
    the_TripArray.push(tripParam);
    return the_TripArray;
};

const sortTrips = arrParam => {
    if (arrParam.length > 1) {
        var temp;
        for (var j = 0; j < arrParam.length - 1; j++) {
            for (var i = 0; i < arrParam.length - 1; i++) {
                if (arrParam[i].dataset.date > arrParam[i + 1].dataset.date) {
                    temp = arrParam[i + 1];
                    arrParam[i + 1] = arrParam[i];
                    arrParam[i] = temp;
                }
            }
        }
        return arrParam;
    } else {
        return arrParam;
    }
};

function initFunc() {
    document.querySelector('.add-trip-button').addEventListener('click', e => {
        e.preventDefault();

        postUserInput(checkTravelInfo())
            .then(() => getTravelData())
            .then(data => createTrip(data))
            .then(data => addTripToArray(data))
            .then(data => sortTrips(data))
            .then(data => updateUI(data));
    });

    document.querySelector('.trips-section').addEventListener('click', e => {
        if (e.target.classList.contains('fa-close')) {
            removeTrip(e.target.closest('.trip').id);
        }
        if (e.target.classList.contains('title')) {
            e.target.parentElement.classList.toggle('open');
        }
    });

}

export {
    initFunc
}