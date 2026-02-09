import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

const PokeCard = ({ pokemon }) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        setRotate({ x: rotateX, y: rotateY });
        
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        setShine({ x: shineX, y: shineY, opacity: 1 });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setShine(prev => ({ ...prev, opacity: 0 }));
    };

    const typeMoves = {
        Grass: { move: "Tranch'Herbe", power: 40, desc: "Lance des feuilles aiguisées." },
        Fire: { move: "Lance-Flammes", power: 90, desc: "Une déferlante de feu intense." },
        Water: { move: "Hydrocanon", power: 110, desc: "Un puissant jet d'eau sous pression." },
        Bug: { move: "Plaie-Croix", power: 80, desc: "Une attaque en forme de croix." },
        Normal: { move: "Vive-Attaque", power: 40, desc: "Attaque avec une rapidité fulgurante." },
        Poison: { move: "Direct Toxik", power: 80, desc: "Un coup empoisonné redoutable." },
        Electric: { move: "Tonnerre", power: 90, desc: "Une foudre tombant du ciel." },
        Ground: { move: "Séisme", power: 100, desc: "Provoque un tremblement de terre." },
        Fairy: { move: "Éclat Magique", power: 80, desc: "Une lumière féerique puissante." },
        Fighting: { move: "Close Combat", power: 120, desc: "Un enchaînement de coups brutaux." },
        Psychic: { move: "Psyko", power: 90, desc: "Une onde psychique destructrice." },
        Rock: { move: "Lame de Roc", power: 100, desc: "Des rochers pointus surgissent." },
        Ghost: { move: "Ball'Ombre", power: 80, desc: "Une sphère d'énergie obscure." },
        Ice: { move: "Laser Glace", power: 90, desc: "Un rayon de glace absolue." },
        Dragon: { move: "Draco-Choc", power: 85, desc: "Une onde de choc draconique." },
        Steel: { move: "Luminocanon", power: 80, desc: "Un rayon de lumière métallique." },
        Flying: { move: "Rapace", power: 120, desc: "Une charge aérienne violente." }
    };

    const mainType = pokemon.type[0];
    const attack = typeMoves[mainType] || typeMoves['Normal'];

    return (
        <Link to={`/pokemon/${pokemon.id}`} className="poke-card-link" style={{textDecoration: 'none', color: 'inherit'}}>
            <div 
                ref={cardRef}
                className={`poke-card type-${mainType.toLowerCase()}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.03, 1.03, 1.03)`,
                    transition: rotate.x === 0 ? 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
                }}
            >
                <div 
                    className="holo-shine" 
                    style={{
                        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.3) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)`,
                        opacity: shine.opacity
                    }}
                />
                
                <div className="card-header">
                    <span className="stage">BASE</span>
                    <span className="name">{pokemon.name.french}</span>
                    <span className="hp"><span>HP</span> {pokemon.base.HP}</span>
                    <div className={`energy-icon ${mainType.toLowerCase()}`}></div>
                </div>

                <div className="image-container">
                    <img src={pokemon.image} alt={pokemon.name.french} />
                </div>

                <div className="card-info-bar">
                    NO. {pokemon.id} Pokémon {mainType} HT: 1.7m WT: 90.5kg
                </div>

                <div className="attacks-container">
                    <div className="attack-row">
                        <div className="energy-cost">
                            <div className="energy-icon mini"></div>
                            <div className="energy-icon mini"></div>
                        </div>
                        <div className="attack-info">
                            <span className="attack-name">{attack.move}</span>
                            <span className="attack-desc">{attack.desc}</span>
                        </div>
                        <span className="attack-damage">{attack.power}</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="footer-stat">
                        <span className="label">faiblesse</span>
                        <div className="energy-icon mini"></div>
                    </div>
                    <div className="footer-stat">
                        <span className="label">résistance</span>
                    </div>
                    <div className="footer-stat">
                        <span className="label">coût de retraite</span>
                        <div className="retreat-icons">
                            <div className="energy-icon mini"></div>
                        </div>
                    </div>
                </div>

                <div className="card-copyright">
                    Illus. Mitsuhiro Arita ©2026 Pokémon/Nintendo
                </div>
            </div>
        </Link>
    );
}

export default PokeCard;