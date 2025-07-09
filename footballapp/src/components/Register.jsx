import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Email
    firstName: '',
    lastName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, firstName, lastName, password } = formData;
      console.log('Sending registration data:', { username, firstName, lastName, password });
      
      const response = await axios.post('/api/users/register', {
        username, firstName, lastName, password
      });
      
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! Please log in.');
      setFormData({ username: '', firstName: '', lastName: '', password: '' });
      setError('');
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error);
      setError('Registration failed. Please try again.');
    }
  };
  

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="username"
          placeholder="Enter your email"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;