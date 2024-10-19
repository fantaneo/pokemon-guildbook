import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";
import { useSearchContext } from "../contexts/SearchContext";

export default function Favorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const [pokemons, setPokemons] = useState([]);
  const { selectedTypes } = useTypeContext();
  const { filterText } = useSearchContext();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setPokemons(storedFavorites);
  }, []);

  const { filteredPokemons } = useTypeFiltering(pokemons, selectedTypes);

  const finalFilteredPokemons = useMemo(() => {
    return filteredPokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (pokemon.japaneseName && pokemon.japaneseName.includes(filterText))
    );
  }, [filteredPokemons, filterText]);

  const checkIsFavorite = useCallback(
    (pokemon) => {
      return isFavorite(favorites, pokemon);
    },
    [favorites]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">お気に入りリスト</h2>
            <div className="grid grid-cols-3 gap-4">
              {finalFilteredPokemons.map((pokemon, index) => (
                <PokemonCard
                  key={`${pokemon.name}-${index}`}
                  pokemon={pokemon}
                  isFavorite={checkIsFavorite(pokemon)}
                  toggleFavorite={() => {
                    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
