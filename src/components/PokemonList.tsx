import { NamedAPIResource } from "../models/pokemon/common/resource";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
  pokemonList: NamedAPIResource[];
}

export default function PokemonList({ pokemonList }: PokemonListProps) {
  return (
    <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:gap-4 md:p-4 lg:grid-cols-3 2xl:grid-cols-4">
      {pokemonList.map((pokemonUrl, index) => (
        <PokemonCard key={index} pokemonUrl={pokemonUrl} />
      ))}
    </div>
  );
}
