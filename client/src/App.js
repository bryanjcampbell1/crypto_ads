import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import NewCampaign from "./NewCampaign";

import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";

function App() {
    return (
      <Router>
        <div className="App">

          <Route path="/" exact component={NewCampaign} />

          <Route path="/page1/" component={Page1} />
          <Route path="/page2/" component={Page2} />
          <Route path="/page3/" component={Page3} />

        </div>
      </Router>
    );
}

export default App;
