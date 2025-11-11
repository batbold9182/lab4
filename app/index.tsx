// app/index.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList , Hero } from "./types";


type NavigationProp = StackNavigationProp<RootStackParamList, "index">;
export default function Index() {
   const navigation = useNavigation<NavigationProp>();
   const [heroes] = useState<Hero[]>([
    { name: "Omniknight", profile: require("../assets/images/paladin.jpg"), type: "Paladin", stats: {hp:500, agi: 12, str: 18, int: 9 } },
    { name: "Lina", profile: require("../assets/images/sorcerer.jpg"), type: "Sorcerer", stats: {hp:450, agi: 12, str: 9, int: 18 } },
    { name: "Axe", profile: require("../assets/images/warrior.jpg"), type: "Warrior", stats: {hp:600, agi: 15, str: 15, int: 11 } },
  ]);

  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [tempStats, setTempStats] = useState(heroes[0].stats);
  const [counter, setCounter] = useState<number>(10);

  const hero = heroes[heroIndex];

  useEffect(() => {
    setTempStats(hero.stats);
    setCounter(10);
  }, [heroIndex]);

  const handleHeroChange = (direction: "prev" | "next") => {
    if (direction === "next") {
      setHeroIndex((prev) => (prev + 1) % heroes.length);
    } else {
      setHeroIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    }
  };

  const handleIncrement = (type: "agi" | "str" | "int") => {
    if (counter <= 0) {
      if (Platform.OS === "web") alert("Total points cannot exceed 10!");
      else Alert.alert("Limit reached", "Total points cannot exceed 10!");
      return;
    }

    setTempStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setCounter((prev) => prev - 1);
  };

  //========================= Decrement stats=====================================
  const handleDecrement = (type: "agi" | "str" | "int") => {
    if (counter === 10) {
      if (Platform.OS === "web") alert("No points spent — cannot decrease yet!");
      else Alert.alert("No points spent", "You cannot decrease stats yet!");
      return;
    }

    if (tempStats[type] <= 5) {
      if (Platform.OS === "web") alert("Stats cannot go lower than 5!");
      else Alert.alert("Minimum Reached", "Stats cannot go lower than 5!");
      return;
    }

    setTempStats((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    setCounter((prev) => Math.min(prev + 1, 10));
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remaining Points: {counter}</Text>

      {/* ========= Hero Switcher ================================== */}
      <View style={styles.heroSwitch}>
        <Button title="<" onPress={() => handleHeroChange("prev")} />
        <Text style={styles.heroName}>{hero.name}</Text>
        <Button title=">" onPress={() => handleHeroChange("next")} />
      </View>

      <Image
        source={hero.profile}
        style={{ width: 100, height: 100, margin: 10, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{hero.type}</Text>

      {/*=========================== Stat Rows =======================*/}
      <View style={styles.row}>
        <Text style={styles.label}>Agility: {tempStats.agi}</Text>
        <Button title="+" onPress={() => handleIncrement("agi")} />
        <Button title="-" onPress={() => handleDecrement("agi")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Strength: {tempStats.str}</Text>
        <Button title="+" onPress={() => handleIncrement("str")} />
        <Button title="-" onPress={() => handleDecrement("str")} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Intelligence: {tempStats.int}</Text>
        <Button title="+" onPress={() => handleIncrement("int")} />
        <Button title="-" onPress={() => handleDecrement("int")} />
      </View>

      <View style={styles.hero}>
        <Button title="Choose your hero" onPress={() => navigation.navigate("fight", {
          hero: hero,
          stats: tempStats
        })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  heroSwitch: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 15 },
  heroName: { fontSize: 22, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10 },
  label: { fontSize: 18, width: 150 },
  hero: { alignItems: "center", marginTop: 20 },
});
