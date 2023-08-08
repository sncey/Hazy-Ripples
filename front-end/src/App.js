
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header.jsx'
import MainSection from './components/Main';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router> 
       <Header></Header>
       <MainSection></MainSection>
       <Footer></Footer> 
      </Router>
      
    </div>
  );
}

export default App;
