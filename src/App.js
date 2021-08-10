import './App.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from'react-router-dom';
import LogIn from './components/LogIn';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/authContext';
import { colors, Wrapper } from './styles/variables';

const { primary } = colors;



function App() {
  const { user } = useAuth();

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={LogIn}/>
          <PrivateRoute exact path="/rooms" authenticated={user}>
            <RoomList />
          </PrivateRoute>
          <PrivateRoute path="/rooms/:roomId" authenticated={user} component={ChatRoom} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
