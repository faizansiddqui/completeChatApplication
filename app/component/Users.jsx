import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import { firestore, app } from '@/lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';



const Users = ({ userData, setSelectedChatroom,  }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatroom, setUserChatroom] = useState([]);
  const auth = getAuth(app);
  const router = useRouter();


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Get All Users
  useEffect(() => {
    setLoading(true);
    const taskQuery = query(collection(firestore, 'users'));

    const unSubscribe = onSnapshot(taskQuery, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const handleLogout = () => {
    const confirmation = window.confirm('Are you sure you want to logout?');
    if (confirmation) {
      signOut(auth)
        .then(() => {
          toast.success('Logout Successful');
          router.push('/login');
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  // Fetch chatrooms associated with the current user
  useEffect(() => {
    if (!userData?.id) return;

    setLoading2(true);
    const chatroomQuery = query(collection(firestore, 'chatrooms'), where('users', 'array-contains', userData?.id));

    const unsubscribe = onSnapshot(chatroomQuery, (querySnapshot) => {
      const chatrooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserChatroom(chatrooms);
      setLoading2(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const createChat = async (user) => {
    if (!userData?.id) {
      toast.error('User not logged in');
      return;
    }

    const existingChatroom = query(
      collection(firestore, 'chatrooms'),
      where('users', '==', [user.id, userData.id])
    );

    try {
      const existingChatroomSnapshot = await getDocs(existingChatroom);

      if (existingChatroomSnapshot.docs.length > 0) {
        toast.error('Chatroom already exists');
        return;
      }

      // Chatroom does not exist, create one
      const chatUserData = {
        [userData.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [user.id, userData.id],
        userData: chatUserData, 
        serverTimestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatroomRef = await addDoc(collection(firestore, 'chatrooms'), chatroomData);
      console.log('Chatroom created with ID', chatroomRef.id);
      setActiveTab('chatroom');
    } catch (err) {
      toast.error(err.message);
    } 
  };

  const openChat = (chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData: chatroom.userData[chatroom.users.find((id) => id !== userData?.id)]
    };
    setSelectedChatroom(data);
  };
  



  return (
    <div className="shadow-lg h-screen overflow-auto mt-4 mb-20">
      <div className="flex justify-between p-4">
        <button onClick={() => handleTabClick('users')} className={`btn btn-outline ${activeTab === 'users' ? 'btn-primary' : ''}`}>
          Users
        </button>
        <button onClick={() => handleTabClick('chatroom')} className={`btn btn-outline ${activeTab === 'chatroom' ? 'btn-primary' : ''}`}>
          Chatroom
        </button>
        <button onClick={handleLogout} className="btn btn-outline">
          Logout
        </button>
      </div>

      {/* Chatroom Section */}
      {activeTab === 'chatroom' && (
        <>
          <h1 className="px-4 text-base font-semibold">Chatroom</h1>
          {userChatroom.map((chatroom) => (
            <div key={chatroom.id} onClick={()=>{openChat(chatroom)}}>
              <UserCard
                name={chatroom.userData[chatroom.users.find((id) => id !== userData?.id)].name}
                avatarUrl={chatroom.userData[chatroom.users.find((id) => id !== userData?.id)].avatarUrl}
                latestMessageText={chatroom.lastMessage}
                time="2h ago"
                type="chat"
              />
            </div>
          ))}
        </>
      )}

      {/* Users Section */}
      {activeTab === 'users' && (
        <>
          <h1 className="px-4 text-base font-semibold">Users</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            users.map((user) => (
              user.id !== userData?.id && (
                <div key={user.id} onClick={() => createChat(user)}>
                  <UserCard
                    key={user.id}
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    time="2h ago"
                    type="users" />
                </div>
              )
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Users;
