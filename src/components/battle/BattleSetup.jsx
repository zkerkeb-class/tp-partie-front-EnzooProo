import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sword, Globe, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const arenas = [
    { id: 'stadium', name: 'Stade de la Ligue', color: '#3b82f6', bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop)' },
    { id: 'forest', name: 'Forêt de Jade', color: '#10b981', bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop)' },
    { id: 'volcano', name: 'Mont Braise', color: '#ef4444', bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1461339841210-184c821f27ad?q=80&w=1974&auto=format&fit=crop)' },
    { id: 'ocean', name: 'Îles Écume', color: '#06b6d4', bg: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?q=80&w=2000&auto=format&fit=crop)' }
];

const BattleSetup = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [selectedMemberIdx, setSelectedMemberIdx] = useState(0);
    const [selectedArenaIdx, setSelectedArenaIdx] = useState(0);
    const [cpuPokemon, setCpuPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get player teams
                const tRes = await fetch('http://localhost:3000/teams');
                const tData = await tRes.json();
                setTeams(tData);
                
                // Flatten all unique members from all teams
                const members = [];
                const ids = new Set();
                tData.forEach(t => {
                    t.members.forEach(m => {
                        if (!ids.has(m.id)) {
                            members.push(m);
                            ids.add(m.id);
                        }
                    });
                });
                setAllMembers(members);

                // Get a random CPU opponent
                const pRes = await fetch('http://localhost:3000/pokemons?limit=151');
                const pData = await pRes.json();
                const randomPoke = pData.data[Math.floor(Math.random() * pData.data.length)];
                setCpuPokemon(randomPoke);
            } catch (error) {
                console.error("Error fetching battle data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFight = () => {
        if (!allMembers[selectedMemberIdx] || !cpuPokemon) return;
        navigate('/battle', {
            state: {
                playerPokemon: allMembers[selectedMemberIdx],
                cpuPokemon: cpuPokemon,
                arena: arenas[selectedArenaIdx]
            }
        });
    };

    if (loading) return <div className="mini-loader">PRÉPARATION DE L'ARÈNE...</div>;

    return (
        <div className="battle-setup-page">
            <Link to="/" className="back-link"><ArrowLeft size={20} /> Annuler le défi</Link>

            <header className="tb-header">
                <h1><Sword size={48} color="#ef4444" /> Battle Center</h1>
                <p>Configurez votre match et entrez dans la légende.</p>
            </header>

            <div className="setup-grid">
                {/* PLAYER SELECTION */}
                <div className="setup-card">
                    <h3><Users size={20} /> VOTRE CHAMPION</h3>
                    {allMembers.length > 0 ? (
                        <div className="champion-carousel">
                            <button 
                                onClick={() => setSelectedMemberIdx(prev => (prev > 0 ? prev - 1 : allMembers.length - 1))}
                                className="nav-arrow"
                            ><ChevronLeft /></button>
                            <div className="champion-view">
                                <img src={allMembers[selectedMemberIdx].image} alt="Champion" />
                                <div className="champ-name">{allMembers[selectedMemberIdx].name.french}</div>
                            </div>
                            <button 
                                onClick={() => setSelectedMemberIdx(prev => (prev < allMembers.length - 1 ? prev + 1 : 0))}
                                className="nav-arrow"
                            ><ChevronRight /></button>
                        </div>
                    ) : (
                        <div className="no-teams">
                            Vous devez d'abord créer une équipe !
                            <Link to="/team-builder" className="inline-link">Aller au Team Builder</Link>
                        </div>
                    )}
                </div>

                {/* VS ICON */}
                <div className="vs-divider">VS</div>

                {/* CPU SELECTION */}
                <div className="setup-card">
                    <h3><Globe size={20} /> ADVERSAIRE ALÉATOIRE</h3>
                    <div className="champion-view cpu">
                        {cpuPokemon && (
                            <>
                                <img src={cpuPokemon.image} alt="CPU Opponent" />
                                <div className="champ-name">{cpuPokemon.name.french}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ARENA SELECTION */}
            <div className="arena-setup-section">
                <h3>CHOISIR L'ARÈNE</h3>
                <div className="arena-grid">
                    {arenas.map((arena, idx) => (
                        <div 
                            key={arena.id}
                            className={`arena-option ${selectedArenaIdx === idx ? 'selected' : ''}`}
                            onClick={() => setSelectedArenaIdx(idx)}
                            style={{ '--arena-color': arena.color }}
                        >
                            <div className="arena-preview" style={{ background: arena.bg, backgroundSize: 'cover' }}></div>
                            <span>{arena.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                className="fight-btn" 
                onClick={handleFight}
                disabled={allMembers.length === 0}
            >
                <Sparkles size={24} /> FIGHT !
            </button>
        </div>
    );
};

export default BattleSetup;
