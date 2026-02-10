import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PokeList from './components/pokelist';
import PokeDetail from './components/pokeDetail';
import AddPokemon from './components/addPokemon';
import EditPokemon from './components/editPokemon';
import TeamBuilder from './components/teamBuilder';
import TeamGallery from './components/teamGallery';
import BattleSetup from './components/battle/BattleSetup';
import BattleArena from './components/battle/BattleArena';

function App() {
  return (
    <Router>
      <div className="app-root-wrapper">
        <Routes>
          <Route path="/" element={<PokeList />} />
          <Route path="/pokemon/:id" element={<PokeDetail />} />
          <Route path="/add" element={<AddPokemon />} />
          <Route path="/edit/:id" element={<EditPokemon />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/teams" element={<TeamGallery />} />
          <Route path="/battle-setup" element={<BattleSetup />} />
          <Route path="/battle" element={<BattleArena />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
