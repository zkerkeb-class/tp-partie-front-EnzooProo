import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight, Sparkles, Users, LayoutGrid } from "lucide-react";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPokemons = async (p, search = "") => {
        setLoading(true);
        try {
            let url = `http://localhost:3000/pokemons?page=${p}&limit=20`;
            if (search) {
                const res = await fetch(`http://localhost:3000/pokemons/name/${search}`);
                if (res.ok) {
                    const data = await res.json();
                    setPokemons([data]);
                    setTotalPages(1);
                } else {
                    setPokemons([]);
                }
            } else {
                const response = await fetch(url);
                const data = await response.json();
                setPokemons(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemons(page, searchTerm);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPokemons(1, searchTerm);
    };

    return (
        <div className="main-app-container">
            <div className="poke-list-container">
                <header>
                    <h1>Pokedex <Sparkles size={40} color="#facc15" style={{verticalAlign: 'middle', marginLeft: '10px'}} /></h1>
                    <div className="actions-row">
                        <form onSubmit={handleSearch} className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Rechercher un Pokémon par son nom..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit"><Search size={22} /></button>
                        </form>
                        <div style={{display: 'flex', gap: '15px'}}>
                            <Link to="/teams" className="add-btn" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', boxShadow: '0 10px 25px rgba(6, 182, 212, 0.4)'}}>
                                <LayoutGrid size={22} /> Galerie Équipes
                            </Link>
                            <Link to="/team-builder" className="add-btn" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'}}>
                                <Users size={22} /> Team Builder
                            </Link>
                            <Link to="/add" className="add-btn">
                                <Plus size={22} /> Nouveau Pokémon
                            </Link>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '100px'}}>
                        <div className="loading-spinner" style={{width: '60px', height: '60px', border: '5px solid rgba(255,255,255,0.1)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                        <p style={{fontSize: '1.2rem', fontWeight: '700', color: '#94a3b8'}}>Recherche en cours...</p>
                    </div>
                ) : (
                    <>
                        {pokemons.length > 0 ? (
                            <div className="pokemon-grid">
                                {pokemons.map((pokemon) => (
                                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                                ))}
                            </div>
                        ) : (
                            <div style={{textAlign: 'center', marginTop: '100px'}}>
                                <Search size={60} color="#334155" style={{marginBottom: '20px'}} />
                                <h2 style={{color: '#94a3b8'}}>Aucun Pokémon ne correspond à votre recherche</h2>
                                <button onClick={() => {setSearchTerm(""); fetchPokemons(1, "");}} style={{background: 'none', border: 'none', color: '#ef4444', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem', marginTop: '20px'}}>Réinitialiser la recherche</button>
                            </div>
                        )}
                    </>
                )}

                {!searchTerm && totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            disabled={page === 1} 
                            onClick={() => {setPage(p => p - 1); window.scrollTo(0, 0);}}
                            style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                        >
                            <ChevronLeft size={18} /> Précédent
                        </button>
                        <span>Page {page} / {totalPages}</span>
                        <button 
                            disabled={page === totalPages} 
                            onClick={() => {setPage(p => p + 1); window.scrollTo(0, 0);}}
                            style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                        >
                            Suivant <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PokeList;