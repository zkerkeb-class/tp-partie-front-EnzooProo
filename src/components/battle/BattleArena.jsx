import { useLocation, useNavigate } from "react-router-dom";
import useBattleLogic from "./useBattleLogic";
import { Heart, Sword, Shield, Zap, RefreshCcw, Home, Sparkles } from "lucide-react";

const HealthBar = ({ hp, maxHp, label, color = "#10b981" }) => {
    const percentage = (hp / maxHp) * 100;
    const barColor = percentage > 50 ? "#10b981" : percentage > 20 ? "#f97316" : "#ef4444";
    
    return (
        <div className="battle-hp-container">
            <div className="hp-header">
                <span className="hp-label">{label}</span>
                <span className="hp-numeric">{hp} / {maxHp}</span>
            </div>
            <div className="hp-bar-bg">
                <div 
                    className="hp-bar-fill" 
                    style={{ width: `${percentage}%`, background: barColor }}
                ></div>
            </div>
        </div>
    );
};

const BattleArena = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playerPokemon, cpuPokemon, arena } = location.state || {};

    const {
        playerHP,
        cpuHP,
        maxPlayerHP,
        maxCpuHP,
        isPlayerTurn,
        battleLog,
        isFinished,
        winner,
        animating,
        playerAction
    } = useBattleLogic(playerPokemon, cpuPokemon);

    if (!playerPokemon || !cpuPokemon) {
        return <div className="mini-loader">ERREUR DE CHARGEMENT DU COMBAT...</div>;
    }

    return (
        <div className="battle-arena-page" style={{ backgroundImage: arena.bg, backgroundSize: 'cover' }}>
            {animating.flash && <div className="battle-flash" />}
            
            <div className="battle-stage">
                {/* OPPONENT (Top Right) */}
                <div className={`pokemon-platform cpu-platform ${animating.cpu === 'shake' ? 'shake' : ''} ${animating.cpu === 'thrust' ? 'attack-thrust-reverse' : ''}`}>
                    <div className="battle-info-card opponent-info">
                        <h3>{cpuPokemon.name.french} <span className="lvl">Lvl 50</span></h3>
                        <HealthBar hp={cpuHP} maxHp={maxCpuHP} label="HP" />
                    </div>
                    <img src={cpuPokemon.image} alt="Opponent" className="battle-sprite cpu-sprite" />
                    <div className="platform-base"></div>
                </div>

                {/* PLAYER (Bottom Left) */}
                <div className={`pokemon-platform player-platform ${animating.player === 'shake' ? 'shake' : ''} ${animating.player === 'thrust' ? 'attack-thrust' : ''}`}>
                    <img src={playerPokemon.image} alt="Player" className="battle-sprite player-sprite" />
                    <div className="platform-base"></div>
                    <div className="battle-info-card player-info">
                        <h3>{playerPokemon.name.french} <span className="lvl">Lvl 50</span></h3>
                        <HealthBar hp={playerHP} maxHp={maxPlayerHP} label="HP" />
                    </div>
                </div>
            </div>

            {/* BATTLE CONTROLS & LOG */}
            <div className="battle-interface">
                <div className="battle-log-box">
                    <p key={battleLog}>{battleLog}</p>
                </div>

                <div className="battle-menu">
                    {!isFinished ? (
                        <div className="action-grid">
                            <button 
                                className="action-btn" 
                                disabled={!isPlayerTurn}
                                onClick={() => playerAction('QUICK')}
                            >
                                <Zap size={18} /> VIVE-ATTAQUE
                            </button>
                            <button 
                                className="action-btn heavy" 
                                disabled={!isPlayerTurn}
                                onClick={() => playerAction('HEAVY')}
                            >
                                <Sword size={18} /> ATTAQUE LOURDE
                            </button>
                            <button 
                                className="action-btn heal" 
                                disabled={!isPlayerTurn}
                                onClick={() => playerAction('HEAL')}
                            >
                                <Heart size={18} /> SOIN (MAX 30%)
                            </button>
                            <button 
                                className="action-btn special" 
                                disabled={!isPlayerTurn}
                                onClick={() => playerAction('SPECIAL')}
                            >
                                <Sparkles size={18} /> SPÉCIAL
                            </button>
                        </div>
                    ) : (
                        <div className="end-game-menu">
                            <div className={`victory-banner ${winner === 'PLAYER' ? 'win' : 'lose'}`}>
                                {winner === 'PLAYER' ? 'VICTOIRE !' : 'DÉFAITE...'}
                            </div>
                            <div style={{display: 'flex', gap: '20px'}}>
                                <button className="pokedex-btn" onClick={() => navigate('/battle-setup')}><RefreshCcw /> REJOUER</button>
                                <button className="pokedex-btn" onClick={() => navigate('/')}><Home /> QUITTER</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Victory/Defeat */}
            {isFinished && (
                <div className="modal-overlay-pokedex">
                    <div className="modal-content-pokedex" style={{border: `2px solid ${winner === 'PLAYER' ? '#10b981' : '#ef4444'}`}}>
                        <h2 style={{color: winner === 'PLAYER' ? '#10b981' : '#ef4444', fontSize: '3rem'}}>
                            {winner === 'PLAYER' ? 'FÉLICITATIONS !' : 'DOMMAGE...'}
                        </h2>
                        <p style={{fontSize: '1.2rem', marginBottom: '30px'}}>
                            {winner === 'PLAYER' 
                                ? `Votre ${playerPokemon.name.french} a terrassé l'adversaire !` 
                                : `Votre ${playerPokemon.name.french} a succombé au combat.`}
                        </p>
                        <div className="modal-buttons">
                            <button className="pokedex-btn" onClick={() => navigate('/battle-setup')}>RECOMMENCER</button>
                            <button className="pokedex-btn btn-purge" onClick={() => navigate('/')}>QUITTER</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattleArena;
