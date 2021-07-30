import { useAuth } from '../context/authContext';

const RoomList = () => {
  const { user } = useAuth();

  return (
    <>
      <p>Sup {user.displayName} here's the room list:</p>
      <ul>
        <li>Room 1</li>
        <li>Room 2</li>
        <li>Room 3</li>
        <li>Mystery Room</li>
      </ul>
    </>
  )
}

export default RoomList;