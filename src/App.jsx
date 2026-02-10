import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PokeList from './components/pokelist';
import PokeDetail from './components/pokeDetail';
import AddPokemon from './components/addPokemon';
import EditPokemon from './components/editPokemon';

function App() {
  return (
    <Router>
      <div className="app-root-wrapper">
        <Routes>
          <Route path="/" element={<PokeList />} />
          <Route path="/pokemon/:id" element={<PokeDetail />} />
          <Route path="/add" element={<AddPokemon />} />
          <Route path="/edit/:id" element={<EditPokemon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
