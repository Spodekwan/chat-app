import './App.css';
import { BrowserRouter as Router, Switch, Route } from'react-router-dom';
import LogIn from './components/LogIn';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/authContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import Profile from './components/Profile';

library.add(faPaperPlane);

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
          <PrivateRoute path="/profile" authenticated={user} component={Profile} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
