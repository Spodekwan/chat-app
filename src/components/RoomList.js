import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link, useHistory } from 'react-router-dom';
import Heading from './Heading';

const RoomList = () => {
  const { user, handleSignOut } = useAuth();
  const [ rooms, setRooms ] = useState([]);
  const history = useHistory();

  const handleClick = async () => {
    await handleSignOut();
    history.push("/");
  }

  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'Rooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const newDataArray = [];
      for (let key in data) {
        newDataArray.push({
          key,
          name: data[key].name,
          description: data[key].description,
          totalMessages: data[key].totalMessages,
          latestMessage: data[key].latestMessage,
        })
      }
      setRooms(newDataArray);
    });
  }, [])

  return (
    <>
      <Heading />
      <button onClick={handleClick}>Sign Out</button>
      <p>Sup {user.displayName} here's the room list:</p>
      <ul>
        {
          rooms.map((room) => {
            return (
              <li key={room.key}>
                <Link to={`rooms/${room.key}`}>{room.name}</Link>
                <p>{room.description}</p>
                <p>total messages: {room.totalMessages ? room.totalMessages : 0}</p>
                <p>latest message: {room.latestMessage ? room.latestMessage : 'no messages yet'}</p>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default RoomList;