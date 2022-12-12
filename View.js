import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import * as R from "ramda";
import { showFormMsg, weatherInputMsg, getDataMsg, saveweatherMsg, deleteweatherMsg } from "./Update";

const bottonStyle = "bg-gray-500 hover:bg-black text-white font-bold py-2 px-4 rounded";
const cellStyle = "px-1 py-2 min-w-[150px]";

const { div, button, form, label, input, table, thead, tbody, tr, th, td } = hh(h);

function cell(tag, className, value, id = 0) {
  return tag({ className, id}, value);
}

const tableHeader = thead([tr([cell(th, "text-left", "Weather"), cell(th, "text-left", "Temp"), cell(th, "text-left", "Low"), cell(th, "text-left", "High"), cell(th, "", "")])]);

function weatherRow(dispatch, className, weathers) {
    let data = 0;
    const tim = weathers.temp.then(function(value){ data = value});
    setTimeout(function() {    
        document.getElementById("temp"+weathers.id).innerText = data.temp;
        document.getElementById("temp_max"+weathers.id).innerText = data.temp_max;
        document.getElementById("temp_min"+weathers.id).innerText = data.temp_min;
    }, 100);
        return tr({ className }, [
        cell(td, cellStyle, weathers.description),
        cell(td, cellStyle, data, "temp"+weathers.id),
        cell(td, cellStyle, data, "temp_max"+weathers.id),
        cell(td, cellStyle, data, "temp_min"+weathers.id),
        cell(td, cellStyle + "text-right", [
        button(
            {
              className: `${bottonStyle} bg-zinc-500 hover:bg-zinc-700`,
              onclick: () => dispatch(deleteweatherMsg(weathers.id)),
            },
            "Delete"
        ),
        ]),
    ]);
}

function totalRow(weathers) {
  const total = R.pipe(
    R.map((weather) => weather),
    R.sum
  )(weathers);
}

function weathersBody(dispatch, className, weathers) {
  const rows = R.map(R.partial(weatherRow, [dispatch, "odd:bg-white even:bg-gray-100"]), weathers);

  const rowsWithTotal = [...rows, totalRow(weathers)];

  return tbody({ className }, rowsWithTotal);
}

function tableView(dispatch, weathers) {
  if (weathers.length === 0) {
    return div({ className: "pt-8 text-center text-red-900" }, "no data yet...");
  }
  return table({ className: "mt-4" }, [tableHeader, weathersBody(dispatch, "", weathers)]);
}

function fieldSet(labelText, inputValue, placeholder, oninput) {
  return div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({ className: "flex gap-4 justify-center" }, [
    button({className: `${bottonStyle} bg-green-900 hover:bg-green-700`, type: "submit", onclick: () => dispatch(saveweatherMsg)}, "Save"),
    button({className: `${bottonStyle} bg-red-900 hover:bg-red-700`, type: "button", onclick: () => dispatch(showFormMsg(false))},  "Cancel")
  ]);
}

function formView(dispatch, model) {
  const { description, showForm } = model;
  if (showForm) {
    return form({className: "flex flex-col gap-4", onsubmit: (e) => e.preventDefault()}, [ 
        div({ className: "flex gap-4" }, [
          fieldSet("Weather", description, "search a city...", (e) => dispatch(weatherInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
    ]);
  }
  return button(
    {
      className: `${bottonStyle} max-w-xs`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "Add weather"
  );
}

function view(dispatch, model) {
  return div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.weathers)]);
}

export default view;