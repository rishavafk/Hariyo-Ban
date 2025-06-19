import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [stats, setStats] = useState({
    totalTrees: 12847,
    totalDonors: 8492,
    totalAmount: 3245000,
    activeSites: 15
  });

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('statsUpdate', (newStats) => {
      setStats(newStats);
    });

    newSocket.on('newDonation', (donation) => {
      console.log('New donation received:', donation);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, stats };
};

export default useSocket;