import './App.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from'react-router-dom';
import LogIn from './components/LogIn';
import RoomList from './components/RoomList';

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
          <Route path="/rooms" component={RoomList}/>
          {/* <Route path="/chatroom"/> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
