import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { navigate } = useNavigation();

  const toast = useToast();
  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        if (!toast.isActive("error")) {
          toast.show({
            id: "error",
            description: "Informe o código",
            placement: "top",
            bgColor: "red.500",
          });
        }
      }

      await api.post("/pools/join", { code });

      toast.show({
        title: "Maravilha!",
        description: "Você entrou no bolão com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      setIsLoading(false);
      setCode("");
      navigate("pools");
    } catch (error) {
      setIsLoading(false);
      let message = "Ocorreu um erro ao tentar carregar os bolões.";

      if (error.response?.data?.message == "Pool not found.")
        message = "Bolão não encontrado";

      if (error.response?.data?.message == "You already joined this pool.")
        message = "Você já está nesse bolão";

      if (!toast.isActive("error")) {
        toast.show({
          id: "error",
          title: "Opa!",
          description: message,
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
