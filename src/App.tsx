import React from "react";
import DragonMap from "./DragonMap";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./App.css"

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <DragonMap />
      </div>
    </Provider>
  );
};

export default App;
