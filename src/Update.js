import * as R from 'ramda';
const apiAdress = "4ddbbad2edee055efb90f6765e32f0ae";

const massages = {
  SHOW_FORM: 'SHOW_FORM',
  weather_INPUT: 'weather_INPUT',
  SAVE_weather: 'SAVE_weather',
  DELETE_weather: 'DELETE_weather',
  DATA_LOAD: 'DATA_LOAD',
  UPDATE_DATA: 'UPDATE_DATA'
};

export function showFormMassage(showForm) {
  return {
    type: massages.SHOW_FORM,
    showForm,
  };
}

export function weatherInputMassage(description) {
  return {
    type: massages.weather_INPUT,
    description,
  };
}

export const loadData = { type: massages.DATA_LOAD };
export const updateWeatherMassage = (currentWeather) => ({ type: massages.UPDATE_DATA, currentWeather });
export const saveWeatherMassage = { type: massages.SAVE_weather };

export function deleteWeatherMassage(id) {
  return {
    type: massages.DELETE_weather,
    id,
  };
}

function update(massage, model) {
  switch (massage.type) {
    case massages.SHOW_FORM: {
      const { showForm } = massage;
      return { ...model, showForm, description: '' };
    }
    case massages.DATA_LOAD: {
      return {
        model,
        command: {
          url: "https://api.openweathermap.org/data/2.5/weather?q="+ model.description +"&units=metric&appid=" + apiAdress,
        },
      };
    }

    case massages.UPDATE_DATA: {
      const { currentWeather } = massage;
      return { ...model, temp: currentWeather.temp, low: currentWeather.temp_min, high: currentWeather.temp_max };
    }
    case massages.weather_INPUT: {
      const { description } = massage;
      return { ...model, description };
    }
    case massages.SAVE_weather: {
        const updatedModel = add(massage, model);
        return updatedModel;
    }
    case massages.DELETE_weather: {
      const { id } = massage;
      const weathers = R.filter(
        weather => weather.id !== id,
        model.weathers);
      return { ...model, weathers };
    }
  }
  return model;
}

function add(massage, model) {
    const { nextId, description, temp, low, high } = model;
    const weather = { id: nextId, description, temp, low, high};
    const weathers = [...model.weathers, weather]
    return {...model, weathers, nextId: nextId + 1, description: '', showForm: false};
}

export default update;