import { useState } from 'react';
import styles from "./page.module.css";
import axios from 'axios';

export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/items', {
        name,
        subject,
      });
      setTutors([...tutors, response.data]);
      setName('');
      setSubject('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      setTutors(tutors.filter((tutor) => tutor.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await axios.get('/api/items');
      setTutors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Campus Tutoring Marketplace</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Subject:
            <input type="text" value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>
          <button type="submit">Post Listing</button>
        </form>
        <ul>
          {tutors.map((tutor) => (
            <li key={tutor.id}>
              {tutor.name} - {tutor.subject}
              <button onClick={() => handleDelete(tutor.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={fetchTutors}>Fetch Tutors</button>
      </main>
    </div>
  );
}
