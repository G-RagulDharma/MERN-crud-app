import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchusers();
  }, []);

  const fetchusers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { name, email };
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/users/${editingId}`, submitData);
      } else {
        await axios.post('http://localhost:3000/api/users/add', submitData);
      }
      fetchusers();
      setName('');
      setEmail('');
      setEditingId(null);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchusers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Update' : 'Add'} User
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <div key={user._id}>
            <li>
              {user.name} - {user.email}
            </li>
            <button onClick={() => handleEdit(user)} disabled={loading}>
              Edit
            </button>
            <button onClick={() => handleDelete(user._id)} disabled={loading}>
              Delete
            </button>
          </div>
        ))}
      </ul>
    </>
  );
}

export default App;