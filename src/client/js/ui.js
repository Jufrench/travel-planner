export const createElement = (options) => {

    const el = document.createElement(options.elType);
    if (options.id !== undefined) {
        el.id = options.id;
    }
    if (options.id !== undefined) {
        el.id = options.id;
    }
    if (options.classes.length > 0) {
        el.className = options.classes;
    }
    if (options.text !== undefined) {
        el.innerHTML = options.text;
    }
    if (options.attribute !== undefined) {
        el.setAttribute(options.attribute.name, options.attribute.value);
    }

    return el;
};

export const updateUI = arrParam => {
    document.querySelector('.trips-section').innerHTML = '';

    arrParam.forEach(trip => {
        document.querySelector('.trips-section').appendChild(trip);
    });
};
