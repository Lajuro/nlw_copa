import { useToast, FlatList } from "native-base";
import { useEffect, useState } from "react";

import { api } from "../services/api";

import { Loading } from "../components/Loading";
import { Game, GameProps } from "../components/Game";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      let response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      if (!toast.isActive("error")) {
        toast.show({
          id: "error",
          title: "Opa!",
          description: "Não foi possível carregar os jogos",
          placement: "top",
          bgColor: "red.500",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        if (!toast.isActive("error")) {
          return toast.show({
            id: "error",
            title: "Opa!",
            description: "Informe o placar do palpite",
            placement: "top",
            bgColor: "red.500",
          });
        }
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        id: "success",
        title: "Maravilha!",
        description: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      if (!toast.isActive("error")) {
        toast.show({
          id: "error",
          title: "Opa!",
          description: "Não foi possível enviar o palpite",
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => {
            handleGuessConfirm(item.id);
          }}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
