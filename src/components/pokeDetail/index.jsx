import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Save, X, Shield, Sword, Zap, Heart, Activity, Wind, Sparkles } from "lucide-react";

const PokeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                setFormData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const updated = await response.json();
                setPokemon(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    if (loading) return <div className="loading" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem', fontWeight: '900', color: '#ef4444'}}>INITIALISATION DU POKEDEX...</div>;
    if (!pokemon) return <div className="detail-page">Spécimen non répertorié</div>;

    const statsColors = {
        HP: '#ef4444', Attack: '#f97316', Defense: '#eab308',
        SpecialAttack: '#3b82f6', SpecialDefense: '#10b981', Speed: '#ec4899'
    };

    const statIcons = {
        HP: <Heart size={18} />, Attack: <Sword size={18} />, Defense: <Shield size={18} />,
        SpecialAttack: <Zap size={18} />, SpecialDefense: <Activity size={18} />, Speed: <Wind size={18} />
    };

    const statLabels = {
        HP: "POINTS DE VIE", Attack: "FORCE D'ATTAQUE", Defense: "CAPACITÉ DÉFENSIVE",
        SpecialAttack: "ATTAQUE SPÉCIALE", SpecialDefense: "DÉFENSE SPÉCIALE", Speed: "VITESSE DE RÉACTION"
    };

    const typeColorMap = {
        Grass: '#10b981', Poison: '#a855f7', Fire: '#f97316', Water: '#3b82f6',
        Bug: '#84cc16', Normal: '#94a3b8', Electric: '#eab308', Ground: '#d97706',
        Fairy: '#f472b6', Fighting: '#ef4444', Psychic: '#ec4899', Rock: '#78350f',
        Ghost: '#6366f1', Ice: '#06b6d4', Dragon: '#4f46e5', Steel: '#64748b', Flying: '#38bdf8'
    };

    const mainTypeColor = typeColorMap[pokemon.type[0]] || '#3b82f6';

    return (
        <div className="detail-page" style={{'--type-color': mainTypeColor, background: `radial-gradient(circle at center, ${mainTypeColor}11 0%, transparent 70%)`}}>
            <Link to="/" className="back-link"><ArrowLeft size={20} /> SCANNER PRÉCÉDENT</Link>
            
            <div className="glass-card pokedex-interface" style={{borderLeft: `8px solid ${mainTypeColor}`}}>
                <div className="pokedex-glitch-bg" />

                <div className="detail-grid">
                    <div className="image-column pokedex-view">
                        <div className="scan-line" style={{background: `linear-gradient(to bottom, transparent, ${mainTypeColor}44, transparent)`}} />
                        <img src={pokemon.image} alt={pokemon.name.french} className="pokedex-sprite" />
                        <div className="pokedex-id-badge" style={{background: mainTypeColor}}>
                            SPECIES #{String(pokemon.id).padStart(3, '0')}
                        </div>
                    </div>

                    <div className="info-column">
                        <div className="pokedex-header">
                            {isEditing ? (
                                <div className="edit-fields">
                                    <input 
                                        type="text" 
                                        className="edit-title-input"
                                        value={formData.name.french} 
                                        onChange={e => setFormData({...formData, name: {...formData.name, french: e.target.value}})}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                        <h1 className="pokedex-name">{pokemon.name.french}</h1>
                                        <Sparkles size={24} color={mainTypeColor} className="pulse-icon" />
                                    </div>
                                    <div className="pokedex-subnames">
                                        <span className="lang-tag">EN</span> {pokemon.name.english} 
                                        <span className="separator">/</span> 
                                        <span className="lang-tag">JP</span> {pokemon.name.japanese}
                                    </div>
                                    <div className="types-row">
                                        {pokemon.type.map(t => (
                                            <span key={t} className={`type-badge-modern ${t.toLowerCase()}`} style={{background: typeColorMap[t]}}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="stats-analysis">
                            <h3 className="section-title">ANALYSE DES CAPACITÉS</h3>
                            <div className="stats-grid-modern">
                                {Object.entries(isEditing ? formData.base : pokemon.base).map(([key, value]) => (
                                    <div key={key} className="stat-card-modern">
                                        <div className="stat-header-modern">
                                            <span className="stat-icon-wrapper" style={{color: statsColors[key]}}>{statIcons[key]}</span>
                                            <span className="stat-label-modern">{statLabels[key]}</span>
                                            <span className="stat-value-modern" style={{color: statsColors[key]}}>{value}</span>
                                        </div>
                                        <div className="progress-bar-modern">
                                            <div 
                                                className="progress-fill-modern" 
                                                style={{ 
                                                    width: `${Math.min(100, (value / 180) * 100)}%`,
                                                    background: statsColors[key],
                                                    boxShadow: `0 0 15px ${statsColors[key]}66`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pokedex-actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="pokedex-btn btn-save"><Save size={18} /> CONFIRMER</button>
                                    <button onClick={() => setIsEditing(false)} className="pokedex-btn btn-cancel"><X size={18} /> ANNULER</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="pokedex-btn btn-modify"><Edit size={18} /> MODIFIER DATA</button>
                                    <button onClick={() => setShowDeleteModal(true)} className="pokedex-btn btn-purge"><Trash2 size={18} /> PURGER ENTRÉE</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay-pokedex">
                    <div className="modal-content-pokedex" style={{border: `2px solid ${mainTypeColor}`}}>
                        <h2>SUPPRESSION CRITIQUE</h2>
                        <p>Voulez-vous supprimer définitivement <strong>{pokemon.name.french}</strong> de la base de données ?</p>
                        <div className="modal-buttons">
                            <button onClick={handleDelete} className="pokedex-btn btn-purge">CONFIRMER</button>
                            <button onClick={() => setShowDeleteModal(false)} className="pokedex-btn">ANNULER</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .pokedex-interface {
                    position: relative;
                    background: rgba(15, 23, 42, 0.9) !important;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 0 50px rgba(0,0,0,0.8);
                }
                .pokedex-view {
                    position: relative;
                    background: #000 !important;
                    border: 2px solid #334155 !important;
                    overflow: hidden;
                    box-shadow: inset 0 0 30px rgba(0,255,0,0.05) !important;
                }
                .scan-line {
                    position: absolute;
                    width: 100%;
                    height: 100px;
                    z-index: 2;
                    animation: scan 3s linear infinite;
                    pointer-events: none;
                }
                @keyframes scan {
                    0% { top: -100px; }
                    100% { top: 100%; }
                }
                .pokedex-sprite {
                    filter: drop-shadow(0 0 20px var(--type-color)) brightness(1.1);
                    z-index: 1;
                }
                .pokedex-id-badge {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 8px;
                    font-weight: 900;
                    font-size: 0.8rem;
                    text-align: center;
                    letter-spacing: 2px;
                }
                .pokedex-name {
                    font-size: 4rem;
                    font-weight: 900;
                    margin: 0;
                    letter-spacing: -2px;
                    text-transform: uppercase;
                }
                .pokedex-subnames {
                    font-size: 1.2rem;
                    color: #64748b;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .lang-tag {
                    font-size: 0.7rem;
                    background: #334155;
                    color: #fff;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-right: 5px;
                }
                .type-badge-modern {
                    padding: 6px 20px;
                    border-radius: 4px;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                }
                .section-title {
                    font-size: 1rem;
                    color: var(--type-color);
                    border-bottom: 1px solid #334155;
                    padding-bottom: 10px;
                    margin: 40px 0 25px 0;
                    letter-spacing: 2px;
                }
                .stats-grid-modern {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                .stat-card-modern {
                    background: rgba(255,255,255,0.03);
                    padding: 15px;
                    border-radius: 8px;
                }
                .stat-header-modern {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 10px;
                }
                .stat-label-modern {
                    flex: 1;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #94a3b8;
                }
                .stat-value-modern {
                    font-size: 1.2rem;
                    font-weight: 900;
                }
                .progress-bar-modern {
                    height: 6px;
                    background: #1e293b;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .progress-fill-modern {
                    height: 100%;
                    border-radius: 10px;
                    transition: width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1);
                }
                .pokedex-actions {
                    margin-top: 50px;
                    display: flex;
                    gap: 15px;
                }
                .pokedex-btn {
                    padding: 15px 25px;
                    border-radius: 4px;
                    font-weight: 900;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                    background: #334155;
                    color: #fff;
                }
                .pokedex-btn:hover {
                    filter: brightness(1.2);
                    transform: translateY(-2px);
                }
                .btn-purge { background: #ef4444; }
                .btn-modify { background: var(--type-color); }
                .pulse-icon {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .modal-overlay-pokedex {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }
                .modal-content-pokedex {
                    background: #0f172a;
                    padding: 50px;
                    max-width: 500px;
                    text-align: center;
                    border-radius: 8px;
                }
                .modal-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                }
                .edit-title-input {
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid var(--type-color);
                    color: #fff;
                    font-size: 3rem;
                    font-weight: 900;
                    width: 100%;
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default PokeDetail;