import React from 'react'; 
import '../styles/main.css'; // Import your CSS file for styling
import centerImage from '../assets/Hazy Ocean .png'

const MainSection = () => {
  return (
    <main className="main-section">
       <div className="image-container">
        <img src={centerImage} alt="Hazy Ocean" className="center-image"/>
        <div className='text-on-image'>
            <p>Welcome to <br/>  Hazy Ripples</p>
        </div>
      </div>
      <div className="documentation">
        <p className="documentation-title">A Glimpse into Hazy-Ripples' Ideation</p>
        <p className="documentation-paragraph">
          The essence underlying Hazy-Ripples revolves around fostering an atmosphere of inclusiveness, collaboration, and societal betterment. This online platform serves as a catalyst for individuals from various walks of life to converge, offering their distinct skills and time, synergistically generating a substantial impact across a spectrum of social, environmental, and altruistic initiatives.
        </p>
        <p className="documentation-title">🎯 Nurturing the Ideal Audience</p>
        <p className="documentation-paragraph">
          Hazy-Ripples emerges as a haven for individuals spanning generations and backgrounds, all united by an unwavering zeal to usher in positive transformations through their voluntary endeavors. From the enthusiasm of students to the dedication of professionals in the workforce, and even the seasoned wisdom of retirees, the platform extends a warm invitation to one and all. Together, they fuel a collective pursuit, sculpting a realm of heightened optimism and advancement.
        </p>
        <div className="button-container">
          <button className="main-button"><a className='main-button-link' href="/api-docs">Go to API documentation</a></button>
        </div>
      </div>
    </main>
  );
};

export default MainSection;