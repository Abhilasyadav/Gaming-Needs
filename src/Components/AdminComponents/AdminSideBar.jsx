import { useNavigate, Link } from "react-router-dom";
import logo from '../../assets/logo.png';

export default function AdminSidebar({ activeItem, onMenuItemClick, onLogout }) {
  const navigate = useNavigate();

  const sidebarStyles = {
    width: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  };

  const logoContainerStyles = {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  };

  const logoStyles = {
    width: '120px',
    height: 'auto',
  };

  const menuContainerStyles = {
    flexGrow: 1,
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const menuItemStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    marginBottom: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    color: '#555',
    fontWeight: '500',
  };

  const activeMenuItemStyles = {
    ...menuItemStyles,
    backgroundColor: '#e0e0e0',
    color: '#333',
  };

  const iconStyles = {
    marginRight: '15px',
    fontSize: '1.2em',
  };

  const subMenuContainerStyles = {
    listStyle: 'none',
    padding: '0 0 0 20px',
    margin: '5px 0 15px 0',
    borderLeft: '2px solid #f0f0f0',
  };

  const subMenuItemStyles = {
    padding: '8px 15px',
    marginBottom: '5px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    color: '#666',
    fontSize: '0.9em',
  };

  const activeSubMenuItemStyles = {
    ...subMenuItemStyles,
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontWeight: 'bold',
  };

  const bottomSectionStyles = {
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
    color: '#777',
    fontSize: '0.9em',
  };

  const actionButtonStyles = {
    padding: '8px 15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '0.9em',
    color: '#555',
  };

  const logoStyle = {
    width: '140px',
    height: '65px',
    objectFit: 'cover', 
  }

  const getIcon = (itemName) => {
    switch (itemName.toLowerCase()) {
      case 'dashboard': return '📊';
      case 'products': return '📦';
      case 'categories': return '🏷️';
      case 'customers': return '👥';
      case 'orders': return '🛒';
      case 'analytics': return '📈';
      case 'notifications': return '🔔';
      case 'settings': return '⚙️';
      case 'logout': return '🚪';
      default: return '➡️';
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');

      if (onLogout) {
        onLogout();
        return;
      }

      window.location.href = '/signin';

    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/';
    }
  };

  return (
    <div style={sidebarStyles}>
      <div>
        <Link to="/" style={logoContainerStyles}>
          <img src={logo} alt="Logo" style={logoStyle} />
        </Link>
      </div>

      <ul style={menuContainerStyles}>
        <li
          style={activeItem === 'dashboard' ? activeMenuItemStyles : menuItemStyles}
          onClick={() => onMenuItemClick('dashboard')}
        >
          <span style={iconStyles}>{getIcon('dashboard')}</span> Dashboard
        </li>

        <li
          style={activeItem === 'products' ? activeMenuItemStyles : menuItemStyles}
          onClick={() => onMenuItemClick('products')}
        >
          <span style={iconStyles}>{getIcon('products')}</span> Products
        </li>

        <li
          style={activeItem === 'customers' ? activeMenuItemStyles : menuItemStyles}
          onClick={() => onMenuItemClick('customers')}
        >
          <span style={iconStyles}>{getIcon('customers')}</span> Customers
        </li>

        <li
          style={activeItem === 'orders' ? activeMenuItemStyles : menuItemStyles}
          onClick={() => onMenuItemClick('orders')}
        >
          <span style={iconStyles}>{getIcon('orders')}</span> Orders
        </li>

        <li
          style={activeItem === 'notifications' ? activeMenuItemStyles : menuItemStyles}
          onClick={() => onMenuItemClick('notifications')}
        >
          <span style={iconStyles}>{getIcon('notifications')}</span> Notifications
        </li>

      </ul>

      <div style={bottomSectionStyles}>
        <p>Admin User</p>
        <button
          type="button"
          style={{
            ...actionButtonStyles,
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            marginTop: '10px',
            width: '80%',
            padding: '10px 15px',
            fontSize: '0.9em',
          }}
          onClick={handleLogout}
        >
          <span style={{ marginRight: '8px' }}>{getIcon('logout')}</span> Logout
        </button>
      </div>
    </div>
  );
}