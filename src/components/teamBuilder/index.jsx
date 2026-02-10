import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Sword, Shield, Heart, Zap, Activity, Wind, 
    Trash2, Save, Sparkles, Trophy, Plus, Search, Info
} from "lucide-react";

const TeamBuilder = () => {
    const navigate = useNavigate();
    const [allPokemons, setAllPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTeam, setCurrentTeam] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetching a large sample for the selector
                const response = await fetch('http://localhost:3000/pokemons?limit=151');
                const data = await response.json();
                setAllPokemons(data.data);
            } catch (error) {
                console.error("Error fetching pokemons:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const addToTeam = (pokemon) => {
        if (currentTeam.length >= 6) {
            alert("Équipe complète ! (Maximum 6)");
            return;
        }
        if (currentTeam.find(p => p.id === pokemon.id)) {
            alert("Ce Pokémon est déjà dans l'équipe !");
            return;
        }
        setCurrentTeam([...currentTeam, pokemon]);
    };

    const removeFromTeam = (id) => {
        setCurrentTeam(currentTeam.filter(p => p.id !== id));
    };

    const saveTeam = async () => {
        if (!teamName) {
            alert("Donnez un nom à votre équipe !");
            return;
        }
        if (currentTeam.length === 0) {
            alert("Ajoutez au moins un Pokémon à l'équipe !");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: teamName,
                    description: teamDescription,
                    members: currentTeam.map(p => p._id) // Using Mongo _id
                })
            });
            if (response.ok) {
                alert("Équipe sauvegardée avec succès !");
                navigate('/');
            }
        } catch (error) {
            console.error("Error saving team:", error);
        }
    };

    // Global Stats Calculation
    const stats = currentTeam.reduce((acc, p) => ({
        HP: acc.HP + p.base.HP,
        Attack: acc.Attack + p.base.Attack,
        Defense: acc.Defense + p.base.Defense,
        SpecialAttack: acc.SpecialAttack + p.base.SpecialAttack,
        SpecialDefense: acc.SpecialDefense + p.base.SpecialDefense,
        Speed: acc.Speed + p.base.Speed
    }), { HP: 0, Attack: 0, Defense: 0, SpecialAttack: 0, SpecialDefense: 0, Speed: 0 });

    const avgStats = currentTeam.length > 0 ? {
        Attack: (stats.Attack + stats.SpecialAttack) / (currentTeam.length * 2),
        Defense: (stats.Defense + stats.SpecialDefense) / (currentTeam.length * 2),
        Speed: stats.Speed / currentTeam.length
    } : { Attack: 0, Defense: 0, Speed: 0 };

    const filteredPokemons = allPokemons.filter(p => 
        p.name.french.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.english.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="team-builder-page">
            <Link to="/" className="back-link"><ArrowLeft size={20} /> Retour au Pokedex</Link>
            
            <header className="tb-header">
                <h1><Trophy size={48} color="#facc15" /> Team Builder</h1>
                <p>Assemblez l'équipe ultime pour conquérir la ligue.</p>
            </header>

            {/* SECTION 1: L'ARÈNE */}
            <section className="arena-section">
                <div className="team-info-inputs">
                    <input 
                        type="text" 
                        placeholder="NOM DE L'ÉQUIPE..." 
                        className="team-name-input"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                    />
                    <button className="save-team-btn" onClick={saveTeam}>
                        <Save size={20} /> SAUVEGARDER L'ÉQUIPE
                    </button>
                </div>

                <div className="slots-grid">
                    {[0, 1, 2, 3, 4, 5].map(index => {
                        const p = currentTeam[index];
                        return (
                            <div key={index} className={`team-slot ${p ? 'filled' : 'empty'}`}>
                                {p ? (
                                    <>
                                        <button className="remove-member" onClick={() => removeFromTeam(p.id)}><Trash2 size={16} /></button>
                                        <img src={p.image} alt={p.name.french} className="slot-img" />
                                        <div className="slot-name">{p.name.french}</div>
                                        <div className="slot-type-dots">
                                            {p.type.map(t => <span key={t} className={`type-dot ${t.toLowerCase()}`}></span>)}
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-placeholder">
                                        <Plus size={32} opacity={0.2} />
                                        <span>SLOT {index + 1}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* SECTION 2: ANALYSE TACTIQUE */}
            <section className="analysis-section">
                <div className="glass-card analysis-card">
                    <h3><Activity size={20} /> ANALYSE TACTIQUE DE L'ÉQUIPE</h3>
                    <div className="analysis-grid">
                        <div className="total-stats">
                            <div className="stat-sum">
                                <Heart color="#ef4444" size={24} />
                                <div>
                                    <label>PV TOTAUX</label>
                                    <div className="value">{stats.HP}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="balance-bars">
                            <div className="balance-item">
                                <label>OFFENSE</label>
                                <div className="p-bar"><div className="p-fill offense" style={{width: `${Math.min(100, avgStats.Attack)}%`}}></div></div>
                            </div>
                            <div className="balance-item">
                                <label>DÉFENSE</label>
                                <div className="p-bar"><div className="p-fill defense" style={{width: `${Math.min(100, avgStats.Defense)}%`}}></div></div>
                            </div>
                            <div className="balance-item">
                                <label>VITESSE</label>
                                <div className="p-bar"><div className="p-fill speed" style={{width: `${Math.min(100, avgStats.Speed)}%`}}></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: LE VIVIER */}
            <section className="pool-section">
                <div className="pool-header">
                    <h3><Search size={20} /> LE VIVIER DES POKÉMON</h3>
                    <div className="pool-search">
                        <input 
                            type="text" 
                            placeholder="Filtrer les candidats..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pool-grid">
                    {loading ? (
                        <div className="mini-loader">SCAN EN COURS...</div>
                    ) : (
                        filteredPokemons.map(p => (
                            <div 
                                key={p.id} 
                                className={`mini-poke-card ${currentTeam.find(tp => tp.id === p.id) ? 'in-team' : ''}`}
                                onClick={() => addToTeam(p)}
                            >
                                <img src={p.image} alt={p.name.french} />
                                <div className="mini-info">
                                    <span className="m-name">{p.name.french}</span>
                                    <div className="m-stats">
                                        <Sword size={10} /> {p.base.Attack} <Shield size={10} /> {p.base.Defense}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default TeamBuilder;
