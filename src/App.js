import { h, diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import axios from 'axios';
import { updateWeatherMassage, saveWeatherMassage } from "./Update";

function app(initModel, update, view, node) {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);
    function dispatch(massage){
      if (massage.type === "DATA_LOAD") {
        const { model: updatedModel, command } = update(massage, model);
        model = updatedModel;
        if (command) {
          httpEffect(dispatch, command);
        }
      } 
      else if (massage.type === "UPDATE_DATA") {
        model = update(massage, model);
        dispatch(saveWeatherMassage);
      }
      else {
        model = update(massage, model);
      }
      const updatedView = view(dispatch, model);
      const patches = diff(currentView, updatedView);
      rootNode = patch(rootNode, patches);
      currentView = updatedView;
    }
  }

  const httpEffect = (dispatch, command) => {
    const { url } = command;
    axios.get(url).then((response) => {
      dispatch(updateWeatherMassage(response.data.main));
    });
  };
  
export default app;