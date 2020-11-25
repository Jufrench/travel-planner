import { createElement } from './ui';

export const createTripElement = (options) => {
    const strDates = options.date.map((item, index, arr) => {
        arr[index] = arr[index].toString();
    });

    const tripWrap = createElement({
        elType: 'div',
        classes: ['wrap trip-wrap']
    });

    // ===========================================
    // Create header =======================
    const headerEl = createElement({
        elType: 'header',
        // id: options.id,
        classes: ['trip-header']
    });

    // Create close button =======================
    const removeBtn = createElement({
        elType: 'button',
        classes: ['remove-btn'],
        attribute: {
            name: 'type',
            value: 'button'
        }
    });
    // Create span to go inside button
    const span = createElement({
        elType: 'span',
        classes: 'fa fa-close'
    });
    // Append span to button
    removeBtn.appendChild(span);
    headerEl.appendChild(removeBtn);

    // ===========================================
    // Create image section =======================
    const imgWrap = createElement({
        elType: 'div',
        classes: 'image-wrap'
    });
    imgWrap.style.backgroundImage = `url(${options.imageURL})`;

    // ===========================================
    // Create city country section 
    const cityCountryEl = createElement({
        elType: 'div',
        classes: ['city-country']
    });
    const cityEl = createElement({
        elType: 'span',
        classes: ['city'],
        text: options.city
    });
    const countryEl = createElement({
        elType: 'span',
        classes: ['country'],
        text: options.country
    });
    // === Append them to city-country element
    cityCountryEl.appendChild(cityEl);
    cityCountryEl.appendChild(countryEl);
    // ============================================
    // Create dates section
    const tripDatesWrap = createElement({
        elType: 'div',
        classes: ['trip-dates-wrap'],
    });

    const departDate = createElement({
        elType: 'span',
        classes: ['depart-date'],
        text: options.date[1] + '.' + options.date[2] + '.' + options.date[0]
    });

    const dateCountdown = createElement({
        elType: 'span',
        classes: ['date-countdown'],
        text: `${options.daysAway} Days Away`
    });

    tripDatesWrap.appendChild(departDate);
    tripDatesWrap.appendChild(dateCountdown);
    // ============================================
    // Create trip body element
    const tripBody = createElement({
        elType: 'div',
        classes: ['body']
    });

    // 1. Add header to trip div wrapper
    tripWrap.appendChild(headerEl);
    // 2. Add image wrapper to trip div wrapper
    tripWrap.appendChild(imgWrap);
    // 3. Add city-country element to trip body
    tripBody.appendChild(cityCountryEl);
    // 4. Add trip dates element to trip body
    tripBody.appendChild(tripDatesWrap);
    // 5. Add trip body to trip div wrapper
    tripWrap.appendChild(tripBody);

    const manageCurrentWeather = elParam => {
        const weatherEl = createElement({
            elType: 'div',
            classes: ['weather currenrt'],
        });
        const tempSpan = createElement({
            elType: 'span',
            classes: ['temp'],
            text: `${options.weather[0].temp} °F - `
        });
        const descriptionSpan = createElement({
            elType: 'span',
            classes: ['description'],
            text: options.weather[0].description
        });

        weatherEl.appendChild(tempSpan);
        weatherEl.appendChild(descriptionSpan);
        elParam.insertAdjacentElement('afterend', weatherEl);
    };

    const manageForecastedWeather = elParam => {
        const weatherEl = createElement({
            elType: 'div',
            classes: ['weather forecast'],
        });
        const title = createElement({
            elType: 'h3',
            classes: ['title'],
            text: `16 Day ${options.weather_to_get}`
        });
        const caretDown = createElement({
            elType: 'span',
            classes: ['fa fa-caret-down'],
        });
        const caretUp = createElement({
            elType: 'span',
            classes: ['fa fa-caret-up'],
        });
        title.appendChild(caretDown);
        title.appendChild(caretUp);
        weatherEl.appendChild(title);

        // Forecast wrap
        const forecastWrap = createElement({
            elType: 'div',
            classes: ['forecast-wrap'],
        });

        options.weather.forEach(day => {
            const forecastDay = createElement({
                elType: 'div',
                classes: ['forecast-day'],
            });
            const highSpan = createElement({
                elType: 'span',
                classes: ['high'],
            });
            const highUpArrow = createElement({
                elType: 'span',
                classes: ['fa fa-arrow-up'],
            });
            const highTemp = createElement({
                elType: 'span',
                classes: ['temp'],
                text: `${day.high} °F`
            });
            highSpan.appendChild(highUpArrow);
            highSpan.appendChild(highTemp);

            const lowSpan = createElement({
                elType: 'span',
                classes: ['low'],
            });
            const lowDownArrow = createElement({
                elType: 'span',
                classes: ['fa fa-arrow-down'],
            });
            const lowTemp = createElement({
                elType: 'span',
                classes: ['temp'],
                text: `${day.low} °F`
            });
            lowSpan.appendChild(lowDownArrow);
            lowSpan.appendChild(lowTemp);

            const descriptionSpan = createElement({
                elType: 'span',
                classes: ['description'],
                text: day.desc
            });
            forecastDay.appendChild(highSpan);
            forecastDay.appendChild(lowSpan);
            forecastDay.appendChild(descriptionSpan);

            forecastWrap.appendChild(forecastDay);
        });

        weatherEl.appendChild(forecastWrap);

        elParam.insertAdjacentElement('afterend', weatherEl);
    };

    // Manage weather element
    if (options.weather_to_get === 'current') {
        manageCurrentWeather(tripDatesWrap);
    } else {
        manageForecastedWeather(tripDatesWrap);
    }

    const tripEl = createElement({
        elType: 'article',
        id: options.id,
        classes: ['trip col md-is-6 lg-is-6 xl-is-4']
    });
    tripEl.setAttribute('data-date', options.dataDate);

    tripEl.appendChild(tripWrap);
    return tripEl;
};
