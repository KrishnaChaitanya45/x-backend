import { useEffect, useState } from 'react';
import './App.css';
import { Router } from './routes/Routes';
import { Route } from './routes/Route';
import Signup from './components/SignUp';
import Course from './components/Course';

function App() {
  return (
    <Router initialPath="/">
      <Route path="/">
        <Course />
      </Route>
      <Route path="/register">
        <Signup />
      </Route>
    </Router>
  );
}

export default App;
