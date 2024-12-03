import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonListBy } from "../api/pokemon/pokemonApi";
import { NamedAPIResourceList } from "../models/pokemon/common/resource";

import { getSearchParamsValue } from "../utils/url";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PokemonList from "../components/PokemonList";

export default function MainPage() {
  const limit = 10;
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<NamedAPIResourceList>({
    queryKey: ["pokemonList"],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonListBy(pageParam as number, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage: NamedAPIResourceList) => {
      return Number(getSearchParamsValue(lastPage.next, "offset")) || undefined;
    },
  }); // https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  const pokemonList = data?.pages.flatMap(page => page.results) || [];
  return (
    <div className="">
      <Header />
      <main className="bg-slate-100 pt-16">
        <PokemonList pokemonList={pokemonList} />
      </main>
      <div ref={ref}></div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center bg-white">
      <h1 className="ml-8 text-4xl font-extrabold tracking-wide text-slate-500 drop-shadow-lg">
        포키몬
      </h1>
    </header>
  );
};
