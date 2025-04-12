
import { useTheme } from '../contexts/ThemeContext';
import { Form } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleChange = () => {
    toggleTheme();
  };

  return (
    <div className="theme-toggle-wrapper">
      <span className={`theme-icon moon ${theme === 'dark' ? 'active' : ''}`}>
        <FaMoon />
      </span>
      <Form.Check
        type="switch"
        id="theme-switch"
        checked={theme === 'dark'}
        onChange={handleChange}
        className="mx-2 theme-switch"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      />
      <span className={`theme-icon sun ${theme === 'light' ? 'active' : ''}`}>
        <FaSun />
      </span>
    </div>
  );
};

export default ThemeToggle;
