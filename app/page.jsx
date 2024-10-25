'use client'
import React, { useState, useEffect } from 'react';
import { app, firestore } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Users from './component/Users';
import ChatRoom from './component/ChatRoom';

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState();
  const router = useRouter();


  const [selectedChatroom, setSelectedChatroom] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = ({id: userSnap.id, ...userSnap.data()})
        setUser(userData);
      } else {
        setUser(null);
        router.push('/login')
      }
    });
    return () => unsubscribe();
  }, [auth, router]);


  console.log(user);
  
  return (
    <div className="flex h-screen">

      {/* Left */}
      <div className="left flex-shrink-0 w-3/12">
        <Users userData={user} setSelectedChatroom={setSelectedChatroom} />
      </div>

      {/* Right */}
      <div className="right flex-grow w-3/12">
        <ChatRoom user={user} selectedChatroom={selectedChatroom}/>
      </div>

    </div>
  );
}
