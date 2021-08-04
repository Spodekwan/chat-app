import './App.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from'react-router-dom';
import LogIn from './components/LogIn';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/authContext';

const Heading = styled.h1`
  color: red;
`;

function App() {
  const { user } = useAuth();

  return (
    <>
      <Heading>Chat App</Heading>
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
