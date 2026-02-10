import { useLocation, useNavigate } from "react-router-dom";
import useBattleLogic from "./useBattleLogic";
import { Zap, Sword, Heart, Sparkles, Home, RefreshCcw } from "lucide-react";
import "./BattleArena.css";
import battleBgImage from "../../assets/image_back.png";

const HUD = ({ pokemon, currentHP, maxHP, side }) => {
    const percentage = (currentHP / maxHP) * 100;
    const barColor = percentage > 50 ? "#10b981" : percentage > 20 ? "#f97316" : "#ef4444";
    
    // Style inline pour ajuster le positionnement du HUD joueur
    const hudStyle = side === 'player' ? { bottom: '20px', top: 'auto' } : {};
    
    return (
        <div className={`battle-hud ${side}`} style={hudStyle}>
            <div className="hud-header">
                <span className="hud-name">{pokemon.name.french}</span>
                <span className="hud-level">Lv. 50</span>
            </div>
            <div className="hp-bar-wrapper">
                <div 
                    className="hp-bar-fill-neon" 
                    style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: barColor,
                        boxShadow: `0 0 10px ${barColor}` 
                    }}
                ></div>
            </div>
            <div className="hp-text">{currentHP} / {maxHP} HP</div>
        </div>
    );
};

const BattleArena = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { playerPokemon, cpuPokemon, selectedArenaImage } = location.state || {};
    
    // Utilisation de l'image passée via le state ou fallback
    const bgImage = selectedArenaImage || battleBgImage;

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
        return (
            <div className="battle-arena-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="win-text">CHARGEMENT DU COMBAT...</div>
            </div>
        );
    }

    return (
        <div className="battle-arena-container">
            {animating.flash && <div className="battle-flash-overlay" />}

            {/* --- BATTLE SCENE --- */}
            <div className="battle-scene" style={{ 
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat'
            }}>
                {/* HUDs */}
                <HUD pokemon={cpuPokemon} currentHP={cpuHP} maxHP={maxCpuHP} side="opponent" />
                <HUD pokemon={playerPokemon} currentHP={playerHP} maxHP={maxPlayerHP} side="player" />

                {/* Opponent Platform & Sprite */}
                <div className="holo-platform opponent"></div>
                <div className={`sprite-container opponent ${animating.cpu === 'shake' ? 'shake-anim' : ''} ${animating.cpu === 'thrust' ? 'thrust-reverse-anim' : ''}`}>
                    <img 
                        src={cpuPokemon.image} 
                        alt={cpuPokemon.name.french} 
                        className="battle-pokemon floating" 
                    />
                </div>

                {/* Player Platform & Sprite */}
                <div className="holo-platform player"></div>
                <div className={`sprite-container player ${animating.player === 'shake' ? 'shake-anim' : ''} ${animating.player === 'thrust' ? 'thrust-anim' : ''}`}>
                    <img 
                        src={playerPokemon.image} 
                        alt={playerPokemon.name.french} 
                        className="battle-pokemon floating" 
                        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))' }}
                    />
                </div>
            </div>

            {/* --- COMMAND MENU --- */}
            <div className="battle-menu-container">
                <div className="dialog-box">
                    {battleLog}
                </div>

                <div className="actions-grid-cyber">
                    <button 
                        className="cyber-btn attack" 
                        disabled={!isPlayerTurn || isFinished}
                        onClick={() => playerAction('QUICK')}
                    >
                        <Zap size={16} /> Vive-Attaque
                    </button>
                    <button 
                        className="cyber-btn heavy" 
                        disabled={!isPlayerTurn || isFinished}
                        onClick={() => playerAction('HEAVY')}
                    >
                        <Sword size={16} /> Attaque Lourde
                    </button>
                    <button 
                        className="cyber-btn heal" 
                        disabled={!isPlayerTurn || isFinished}
                        onClick={() => playerAction('HEAL')}
                    >
                        <Heart size={16} /> Récupération
                    </button>
                    <button 
                        className="cyber-btn special" 
                        disabled={!isPlayerTurn || isFinished}
                        onClick={() => playerAction('SPECIAL')}
                    >
                        <Sparkles size={16} /> Ultra-Combo
                    </button>
                </div>
            </div>

            {/* --- END SCREEN OVERLAY --- */}
            {isFinished && (
                <div className="battle-end-overlay">
                    <div className="end-card-cyber">
                        <div className={`end-title ${winner === 'PLAYER' ? 'win-text' : 'lose-text'}`}>
                            {winner === 'PLAYER' ? 'Victory' : 'Defeat'}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                            {winner === 'PLAYER' 
                                ? `${playerPokemon.name.french} a remporté le tournoi Cyber-League !` 
                                : `${playerPokemon.name.french} a été éliminé du tournoi.`}
                        </p>
                        <div className="end-actions">
                            <button className="pokedex-btn-cyber" onClick={() => navigate('/battle-setup')}>
                                <RefreshCcw size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> REJOUER
                            </button>
                            <button className="pokedex-btn-cyber" onClick={() => navigate('/')}>
                                <Home size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> QUITTER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattleArena;