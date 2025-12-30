import './App.css';
import './index.css';
import RoutesList from './Routes/Routes';
import SmoothFollower from './components/SmoothFollower';
import ScrollToTop from './components/ScrollTop';

function App() {

  return (
    <>
      <ScrollToTop />
      <SmoothFollower />
      <RoutesList />
    </>
  )
}

export default App
