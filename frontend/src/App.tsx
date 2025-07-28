import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello world! Home</h1>} />
        <Route path="/about" element={<h1>Hello world! About</h1>} />
        <Route path="/contact" element={<h1>Hello world! Contact</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
