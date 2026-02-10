import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    ArrowLeft, Trophy, Activity, Zap, Shield, Sword, Heart, Wind,
    LayoutGrid, ChevronRight, BarChart3, Sparkles
} from "lucide-react";
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

const TeamGallery = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:3000/teams');
                const data = await response.json();
                setTeams(data);
                if (data.length > 0) setSelectedTeam(data[0]);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const calculateTeamPower = (team) => {
        return team.members.reduce((acc, p) => (
            acc + p.base.HP + p.base.Attack + p.base.Defense + 
            p.base.SpecialAttack + p.base.SpecialDefense + p.base.Speed
        ), 0);
    };

    const getRadarData = (team) => {
        if (!team || team.members.length === 0) return [];
        const stats = team.members.reduce((acc, p) => ({
            HP: acc.HP + p.base.HP,
            Attack: acc.Attack + p.base.Attack,
            Defense: acc.Defense + p.base.Defense,
            SpecialAttack: acc.SpecialAttack + p.base.SpecialAttack,
            SpecialDefense: acc.SpecialDefense + p.base.SpecialDefense,
            Speed: acc.Speed + p.base.Speed
        }), { HP: 0, Attack: 0, Defense: 0, SpecialAttack: 0, SpecialDefense: 0, Speed: 0 });

        const count = team.members.length;
        return [
            { subject: 'HP', A: stats.HP / count, fullMark: 255 },
            { subject: 'Atk', A: stats.Attack / count, fullMark: 255 },
            { subject: 'Def', A: stats.Defense / count, fullMark: 255 },
            { subject: 'SpA', A: stats.SpecialAttack / count, fullMark: 255 },
            { subject: 'SpD', A: stats.SpecialDefense / count, fullMark: 255 },
            { subject: 'Vit', A: stats.Speed / count, fullMark: 255 },
        ];
    };

    const getTypeCounts = (team) => {
        const counts = {};
        team.members.forEach(p => {
            p.type.forEach(t => {
                counts[t] = (counts[t] || 0) + 1;
            });
        });
        return counts;
    };

    if (loading) return <div className="mini-loader">CHARGEMENT DES ARCHIVES...</div>;

    return (
        <div className="team-gallery-page">
            <Link to="/" className="back-link"><ArrowLeft size={20} /> Retour au Pokedex</Link>
            
            <header className="tb-header">
                <h1><LayoutGrid size={48} color="#06b6d4" /> Archives des Équipes</h1>
                <p>Consultez les formations stratégiques enregistrées.</p>
            </header>

            <div className="gallery-layout">
                {/* LEFT: TEAM CARDS */}
                <div className="teams-list">
                    {teams.map(team => (
                        <div 
                            key={team._id} 
                            className={`holo-team-card ${selectedTeam?._id === team._id ? 'active' : ''}`}
                            onClick={() => setSelectedTeam(team)}
                        >
                            <div className="card-glimmer" />
                            <div className="team-card-header">
                                <h3>{team.name}</h3>
                                <div className="power-badge">
                                    <Sparkles size={12} /> {calculateTeamPower(team)} PWR
                                </div>
                            </div>
                            <div className="mini-sprites-row">
                                {team.members.map((p, i) => (
                                    <img key={p._id + i} src={p.image} alt={p.name.french} className="mini-sprite" />
                                ))}
                            </div>
                            <div className="card-footer-info">
                                <span>{team.members.length} MEMBRES</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && <div className="empty-gallery">Aucune équipe enregistrée.</div>}
                </div>

                {/* RIGHT: DETAILED SPECS */}
                {selectedTeam && (
                    <div className="team-specs-view">
                        <div className="glass-card specs-card">
                            <div className="specs-header">
                                <h2>{selectedTeam.name} - ANALYSE GLOBALE</h2>
                                <p>{selectedTeam.description || "Formation tactique optimisée pour le combat de haut niveau."}</p>
                            </div>

                            <div className="specs-grid">
                                <div className="radar-section">
                                    <h3>ÉQUILIBRE STATISTIQUE</h3>
                                    <div style={{width: '100%', height: '300px'}}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(selectedTeam)}>
                                                <PolarGrid stroke="#334155" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <Radar
                                                    name="Equipe"
                                                    dataKey="A"
                                                    stroke="#06b6d4"
                                                    fill="#06b6d4"
                                                    fillOpacity={0.5}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="type-analysis-section">
                                    <h3>DISTRIBUTION DES TYPES</h3>
                                    <div className="type-stats-grid">
                                        {Object.entries(getTypeCounts(selectedTeam)).map(([type, count]) => (
                                            <div key={type} className="type-stat-pill">
                                                <span className={`type-dot ${type.toLowerCase()}`}></span>
                                                <span className="t-name">{type}</span>
                                                <span className="t-count">x{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="members-detail-list">
                                <h3>MEMBRES DE L'UNITÉ</h3>
                                <div className="members-mini-grid">
                                    {selectedTeam.members.map(p => (
                                        <div key={p._id} className="member-mini-card">
                                            <img src={p.image} alt={p.name.french} />
                                            <div className="m-info">
                                                <div className="m-name">{p.name.french}</div>
                                                <div className="m-types">
                                                    {p.type.map(t => <span key={t} className={`m-type-tag ${t.toLowerCase()}`}>{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamGallery;
