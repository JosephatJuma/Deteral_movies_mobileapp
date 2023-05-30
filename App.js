import { StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Box,
  Input,
  FormControl,
  Button,
  Skeleton,
  Select,
  CheckIcon,
  ScrollView,
  Spinner,
  Heading,
  StatusBar,
  Icon,
  Pressable,
  Center,
  HStack,
  VStack,
  useDisclose,
  Actionsheet,
  Divider,
  View,
  Text,
  IconButton,
  Menu,
  AlertDialog,
  FlatList,
  Image,
  TextArea,
  Checkbox,
  Slider,
  Progress,
  Avatar,
  Badge,
  AspectRatio,
  Stack,
} from "native-base";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=3c0bd2c4";
export default function App() {
  const [services, setServices] = useState([
    { imdbID: "1" },
    { imdbID: "2" },
    { imdbID: "3" },
    { imdbID: "4" },
    { imdbID: "5" },
    { imdbID: "6" },
  ]);

  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const [openActionSheet, setOpen] = useState(false);
  const [focussed, setFocussed] = useState(false);
  const [amount, setAmount] = useState();
  const [selected, setSelected] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("Vikings");
  const [err, setErr] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const openIt = (service) => {
    setOpen(!openActionSheet);
    setSelected(service);
  };

  const onCloseAlert = () => setAlertIsOpen(false);
  const cancelRef = React.useRef(null);

  const searchMovie = async (title) => {
    setLoading(true);
    await fetch(`${API_URL}&s=${title}`)
      .then(async (data) => {
        const movies = await data.json();
        if (movies.Error) {
          setErr(movies.Error);
          setMovies([]);
        } else setMovies(movies.Search);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error.message);
        setLoading(false);
      });

    setRefreshing(false);
  };
  useEffect(() => {
    searchMovie(searchTerm);
  }, [1]);

  //Refresh
  const onRefresh = React.useCallback(() => {
    //setSearchTerm("Vikings");
    setRefreshing(true);
    searchMovie(searchTerm);
  }, []);

  const renderService = ({ item }) => {
    return (
      <Box
        alignItems="center"
        width={"48%"}
        m={1}
        bg="black"
        style={{
          shadowColor: "#fff",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 7,
        }}
      >
        <Box
          maxW="80"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.50",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.900",
          }}
          height={350}
        >
          <Pressable onPress={() => openIt(item.Title)}>
            <Image
              height={250}
              width={200}
              source={{
                uri:
                  item.Poster === "N/A"
                    ? "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    : item.Poster,
              }}
              alt="image"
            />

            <Center
              bg="amber.500"
              _dark={{
                bg: "violet.400",
              }}
              _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xs",
              }}
              position="absolute"
              bottom="0"
              px="3"
              py="1.5"
            >
              {item.Year}
            </Center>
          </Pressable>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading
                fontSize={12}
                ml="-1"
                _light={{
                  color: "white",
                }}
              >
                {item.Title}
              </Heading>
              <Text
                fontSize="xs"
                fontWeight="500"
                ml="-0.5"
                mt="-1"
                _light={{
                  color: "white",
                }}
              >
                Type: {item.Type}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  };

  const renderSkeleton = (item) => {
    return (
      <VStack
        w="48%"
        borderWidth="1"
        space={8}
        m={2}
        overflow="hidden"
        _dark={{
          borderColor: "white",
        }}
        _light={{
          borderColor: "coolGray.200",
        }}
      >
        <Skeleton h="40" />
        <Skeleton.Text px="4" />
        <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
      </VStack>
    );
  };

  return (
    <NativeBaseProvider>
      <StatusBar style="light" backgroundColor="black" />
      <VStack w="100%" space={5} alignSelf="center" backgroundColor="black">
        <HStack
          px="1"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <HStack alignItems="center" marginLeft={5}>
            <Heading color="white" size={"lg"}>
              Deteral Movies
            </Heading>
          </HStack>

          <HStack>
            <Menu
              w="190"
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                  >
                    <MaterialIcons name="more-vert" size={30} color="white" />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={() => setAlertIsOpen(!alertIsOpen)}>
                Delete
              </Menu.Item>
              <Menu.Item>Games</Menu.Item>
              <Menu.Item>Accounts</Menu.Item>
              <Menu.Item>Friends</Menu.Item>
              <Menu.Item>Friends</Menu.Item>
            </Menu>
          </HStack>
        </HStack>
        <Input
          type="text"
          value={searchTerm}
          onBlur={() => searchMovie(searchTerm)}
          cursorColor="white"
          onChangeText={(value) => setSearchTerm(value)}
          color="white"
          placeholder="Search Movies & Shows"
          width="90%"
          borderRadius="4"
          m={2}
          alignSelf={"center"}
          fontSize="14"
          shadow={"#fff"}
          returnKeyType="search"
          InputRightElement={
            <Button
              onPress={() => searchMovie(searchTerm)}
              size="sm"
              rounded="none"
              w="1/6"
              h="full"
              background={"gray.900"}
            >
              {loading ? (
                <Spinner color={"white"} m="2" mr="3" size="sm" />
              ) : (
                <Icon
                  m="2"
                  mr="3"
                  size="4"
                  color="gray.400"
                  as={<MaterialIcons name="search" />}
                />
              )}
            </Button>
          }
        />
      </VStack>

      <ScrollView
        backgroundColor="gray.900"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["black", "#ff5349", "grey"]}
            title="Relaoding"
          />
        }
      >
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={loading === true ? services : movies}
          renderItem={loading === true ? renderSkeleton : renderService}
          keyExtractor={(movie) => movie.imdbID}
          numColumns={2}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          onEndReachedThreshold={5}
          windowSize={5}
          indicatorStyle={{ backgroundColor: "red" }}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <Center
              bg="gray.700"
              padding={10}
              width={"90%"}
              marginTop={100}
              rounded={"sm"}
              alignSelf={"center"}
            >
              <Icon
                m="2"
                mr="3"
                size="10"
                color="white"
                as={<MaterialIcons name="info" />}
              />
              <Heading color={"white"}>{err}</Heading>
            </Center>
          }
        />
      </ScrollView>
    </NativeBaseProvider>
  );
}
