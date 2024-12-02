import { NamedAPIResource } from "../models/pokemon/common/resource";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
  pokemonList: NamedAPIResource[];
}

export default function PokemonList({ pokemonList }: PokemonListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {pokemonList.map((pokemonUrl, index) => (
        <PokemonCard key={index} pokemonUrl={pokemonUrl} />
      ))}
    </div>
  );
}
