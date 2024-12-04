import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonListBy } from "../api/pokemon/pokemonApi";
import { NamedAPIResourceList } from "../models/pokemon/common/resource";

import { getSearchParamsValue } from "../utils/url";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import PokemonList from "../components/PokemonList";
import { IoMoon, IoSunny } from "react-icons/io5";

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
      <main className="bg-slate-100 pt-16 dark:bg-slate-800">
        <PokemonList pokemonList={pokemonList} />
      </main>
      <div ref={ref}></div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-white dark:bg-slate-900">
      <h1 className="ml-8 text-4xl font-extrabold tracking-wide text-slate-500 drop-shadow-lg dark:text-slate-300">
        포키몬
      </h1>
      <DarkModeToggleBtn />
    </header>
  );
};

const DarkModeToggleBtn = () => {
  const [dark, setDark] = useState(() => {
    // localStorage에서 테마 값을 가져오거나 시스템 기본 설정을 사용
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // 시스템 기본 설정 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // dark 상태에 따라 HTML 태그에 클래스 추가/제거
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleDarkMode = () => {
    setDark(prev => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="mr-8 flex items-center gap-2 text-2xl font-bold text-slate-500 dark:text-slate-300"
    >
      {dark ? <IoSunny /> : <IoMoon />}
    </button>
  );
};
