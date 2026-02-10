import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Info, BarChart3, Image as ImageIcon, Sparkles } from "lucide-react";

const AddPokemon = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: {
            english: "",
            japanese: "New",
            chinese: "New",
            french: ""
        },
        type: ["Normal"],
        base: {
            HP: 50,
            Attack: 50,
            Defense: 50,
            SpecialAttack: 50,
            SpecialDefense: 50,
            Speed: 50
        },
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/pokemons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.text();
                console.error("Server error:", errorData);
                alert("Erreur lors de la création: " + errorData);
            }
        } catch (error) {
            console.error("Error creating pokemon:", error);
            alert("Erreur réseau");
        }
    };

    const statLabels = {
        HP: "PV (HP)",
        Attack: "Attaque",
        Defense: "Défense",
        SpecialAttack: "Attaque Spé.",
        SpecialDefense: "Défense Spé.",
        Speed: "Vitesse"
    };

    return (
        <div className="add-page">
            <Link to="/" className="back-link"><ArrowLeft size={20} /> Retour au Pokedex</Link>
            
            <div className="glass-card" style={{animation: 'fadeIn 0.6s ease-out'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px'}}>
                    <h1 style={{fontSize: '2.5rem', margin: 0, fontWeight: 900}}>Nouveau Pokémon</h1>
                    <Sparkles size={32} color="#facc15" />
                </div>
                <p style={{color: '#94a3b8', marginBottom: '45px', fontSize: '1.1rem'}}>Enregistrez une nouvelle espèce dans votre base de données holographique.</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '50px'}}>
                        <h3 style={{color: '#ef4444', marginBottom: '25px', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Info size={20} /> Informations d'identité
                        </h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px'}}>
                            <div className="form-group">
                                <label>Nom Français</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="ex: Dracaufeu"
                                    value={formData.name.french} 
                                    onChange={e => setFormData({...formData, name: {...formData.name, french: e.target.value}})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nom Anglais</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="ex: Charizard"
                                    value={formData.name.english} 
                                    onChange={e => setFormData({...formData, name: {...formData.name, english: e.target.value}})}
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{marginTop: '20px'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}><ImageIcon size={16} /> URL de l'Hologramme (Image)</label>
                            <input 
                                type="text" 
                                placeholder="https://raw.githubusercontent.com/..."
                                value={formData.image} 
                                onChange={e => setFormData({...formData, image: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div style={{marginBottom: '40px'}}>
                        <h3 style={{color: '#3b82f6', marginBottom: '25px', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <BarChart3 size={20} /> Capacités de combat
                        </h3>
                        <div className="stats-input-grid">
                            {Object.entries(formData.base).map(([key, value]) => (
                                <div key={key} className="stat-slider-row">
                                    <div className="stat-header">
                                        <label>{statLabels[key] || key}</label>
                                        <span className="stat-value">{value}</span>
                                    </div>
                                    <div className="slider-container">
                                        <input 
                                            type="range" 
                                            min="0"
                                            max="255"
                                            value={value} 
                                            onChange={e => setFormData({
                                                ...formData, 
                                                base: {...formData.base, [key]: parseInt(e.target.value) || 0}
                                            })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="add-btn" style={{width: '100%', justifyContent: 'center', padding: '20px', fontSize: '1.2rem', marginTop: '20px'}}>
                        <Save size={24} /> GÉNÉRER LE POKÉMON
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPokemon;