import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonListBy } from "../api/pokemon/pokemonApi";
import { NamedAPIResourceList } from "../models/pokemon/common/resource";
import PokemonList from "../components/PokeMonList";
import { getSearchParamsValue } from "../utils/url";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

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
    threshold: 0, // 요소가 0%라도 뷰포트에 보이면 트리거
    triggerOnce: false, // 매번 트리거되도록 설정
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); // 다음 페이지 로드
    }
  }, [inView]);

  // const [fetchTrigger]

  // = useIntersectionObserver<HTMLDivElement>(() => {
  //   if (hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage(); // 다음 페이지 로드
  //   }
  // });

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  const pokemonList = data?.pages.flatMap(page => page.results) || [];
  return (
    <div>
      <h1>Pokemon List</h1>

      <PokemonList pokemonList={pokemonList} />

      <div
        ref={ref}
        className="flex h-20 w-20 items-center justify-center bg-gray-300"
      ></div>
    </div>
  );
}
