import React from 'react'; 
import '../styles/header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Hazy Ripples</div>
      <nav className="nav">
        <a href="/api-docs" className="nav-link">Go to API documentation</a>
        <a href="/user/google" className="nav-link">Sign in with Google</a>
      </nav>
    </header>
  );
};
  
  export default Header;