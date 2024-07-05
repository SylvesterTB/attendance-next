// components/SaveChanges.js
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SaveChanges = () => {
  const [data, setData] = useState('');
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    // Fetch saved data on mount
    const fetchData = async () => {
      const docRef = doc(firestore, 'users', 'user1');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSavedData(docSnap.data().content);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const docRef = doc(firestore, 'users', 'user1');
    await setDoc(docRef, { content: data });
    setSavedData(data);
  };

  return (
    <div>
      <h1>Save Changes Example</h1>
      <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Type something..."
      />
      <button onClick={handleSave}>Save</button>
      {savedData && (
        <div>
          <h2>Saved Data</h2>
          <p>{savedData}</p>
        </div>
      )}
    </div>
  );
};

export default SaveChanges;
