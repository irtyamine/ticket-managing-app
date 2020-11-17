import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { BackendService } from './backend';
import List from './pages/list/list';
import Description from './pages/description/description';
import NotFound from './pages/not-found/not-found';
import Add from './pages/add/add';

const backend = new BackendService();

const Routes = (
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={() => <List backend={backend} />} />
        <Route exact path="/add" component={() => <Add backend={backend} />} />
        <Route
          exact
          path="/details/:id"
          render={({ match }) => {
            return <Description backend={backend} id={match.params.id} />;
          }}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>
);

export default Routes;
