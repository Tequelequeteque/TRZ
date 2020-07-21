import React, { useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import Dashboard from '../pages/Dashboard';
import Create from '../pages/Create';
import UpdateLocation from '../pages/UpdateLocation';
import ReportInfection from '../pages/ReportInfection';
import Exchange from '../pages/Exchange';

const Routes: React.FC = () => {
  const paths = useMemo(
    () => ['dashboard', 'create', 'location', 'report-infection', 'exchange'],
    [],
  );
  return (
    <>
      <Sidebar paths={paths} />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/create" component={Create} />
        <Route path="/location" component={UpdateLocation} />
        <Route path="/report-infection" component={ReportInfection} />
        <Route path="/exchange" component={Exchange} />
      </Switch>
    </>
  );
};
export default Routes;
