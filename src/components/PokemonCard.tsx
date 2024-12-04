import { useQuery } from "@tanstack/react-query";
import { NamedAPIResource } from "../models/pokemon/common/resource";
import {
  getPokemonById,
  getPokemonSpeciesById,
} from "../api/pokemon/pokemonApi";
import {
  Pokemon,
  PokemonSpecies,
  PokemonSprites,
  PokemonType,
} from "../models/pokemon/pokemon";
import { useState } from "react";
import cn from "classnames";
import {
  PokemonTypeToKor,
  PokemonTypeToSvg,
  PokemonTypeToTailwindColor,
} from "../models/pokemon/pokemonType";

interface PokemonCardProps {
  pokemonUrl: NamedAPIResource;
}

const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/pokemon\/(\d+)\//);
  return match ? match[1] : null;
};

export default function PokemonCard({ pokemonUrl }: PokemonCardProps) {
  const { name, url } = pokemonUrl;

  const id = extractIdFromUrl(url);

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery<Pokemon>({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid ID");
      return getPokemonById(id);
    },
    enabled: !!id, // ID가 있을 때만 쿼리 실행
  });

  const { data: pokemonSpecies } = useQuery<PokemonSpecies>({
    queryKey: ["pokemon-species", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid ID");
      return getPokemonSpeciesById(id);
    },
    enabled: !!id, // ID가 있을 때만 쿼리 실행
  });

  const officialArtworkUrl =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default;

  const sprites: PokemonSprites | undefined = pokemon?.sprites;

  const krName = pokemonSpecies?.names.find(
    name => name.language.name === "ko"
  )?.name;
  return (
    <div className="relative flex flex-col gap-2 rounded-lg border-slate-500 bg-white p-2 shadow dark:bg-slate-700">
      <div className="flex justify-between border-b p-2 dark:border-slate-500 dark:text-slate-200">
        <h1 className="text-xl font-bold">{`# ${id}`}</h1>
        <h2 className="text-xl font-bold">{krName}</h2>
      </div>
      {officialArtworkUrl && <BackGroundImage url={officialArtworkUrl} />}

      {sprites && (
        <PokemonAnimatedCard pokemonName={name} pokemonSprites={sprites} />
      )}

      <PokemonTypePlatter types={pokemon?.types || []} />
    </div>
  );
}

const PokemonAnimatedCard = ({
  pokemonName,
  pokemonSprites,
}: {
  pokemonName: string;
  pokemonSprites: PokemonSprites;
}) => {
  const [isFront, setIsFront] = useState(true);

  const frontImage =
    pokemonSprites.other?.showdown?.front_default ||
    pokemonSprites.front_default;
  const backImage =
    pokemonSprites.other?.showdown?.back_default || pokemonSprites.back_default;

  return (
    <button
      className="flex h-32 items-end justify-center border-b md:h-48 dark:border-slate-500 dark:text-slate-200"
      onClick={() => setIsFront(!isFront)}
    >
      {frontImage && (
        <PokemonImage
          className="relative z-10 mb-4"
          show={isFront}
          url={frontImage}
          alt={`${pokemonName} front`}
        />
      )}
      {backImage && (
        <PokemonImage
          className="absolute z-10 mb-4"
          show={!isFront}
          url={backImage}
          alt={`${pokemonName} back`}
        />
      )}
    </button>
  );
};

const PokemonImage = ({
  className,
  show,
  url,
  alt,
}: {
  className?: string;
  show: boolean;
  url: string;
  alt: string;
}) => {
  return (
    <div
      className={cn(
        `cursor-pointer transition-opacity duration-500`,
        { "opacity-100": show },
        { "opacity-0": !show },
        className
      )}
    >
      <img src={url} alt={alt} className="object-contain" />
    </div>
  );
};

const BackGroundImage = ({ url }: { url: string }) => {
  return (
    <div
      className="absolute inset-0 z-0 opacity-20"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

const PokemonTypePlatter = ({ types }: { types: PokemonType[] }) => {
  return (
    <div className="z-10 flex gap-2">
      {types.map((pokemonType: PokemonType, idx: number) => (
        <span
          key={idx}
          className={cn(
            `flex w-full items-center justify-center gap-2 rounded-md border-2 px-2 py-1 text-sm font-medium text-white dark:border-slate-500`,
            PokemonTypeToTailwindColor[pokemonType.type.name]
          )}
        >
          <img
            src={PokemonTypeToSvg[pokemonType.type.name]}
            alt={pokemonType.type.name}
            width={20}
            height={20}
          />

          {PokemonTypeToKor[pokemonType.type.name]}
        </span>
      ))}
    </div>
  );
};
