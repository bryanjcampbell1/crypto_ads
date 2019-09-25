import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Page1 from "./Page1";
import Page2 from "./Page2";


function App() {
    return (
      <Router>
        <div className="App">

          <Route path="/" exact component={Page1} />
          <Route path="/page2/" component={Page2} />

        </div>
      </Router>
    );
}

export default App;
