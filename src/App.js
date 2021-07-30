import './App.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from'react-router-dom';
import LogIn from './components/LogIn';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';

const Heading = styled.h1`
  color: red;
`;

function App() {
  return (
    <>
      <Heading>Chat App</Heading>
      <Router>
        <Switch>
          <Route exact path="/" component={LogIn}/>
          <Route exact path="/rooms" component={RoomList}/>
          <Route path="/rooms/:roomId" component={ChatRoom}/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
