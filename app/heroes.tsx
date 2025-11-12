// app/heroes.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Hero, Equipment } from "./types";

// Type definitions
type HeroesRouteProp = RouteProp<RootStackParamList, "heroes">;
type HeroesNavigationProp = StackNavigationProp<RootStackParamList, "heroes">;

export default function Heroes() {
  const navigation = useNavigation<HeroesNavigationProp>();
  const route = useRoute<HeroesRouteProp>();

  const selectedEquipment = route.params?.selectedEquipment;

  const [heroes] = useState<Hero[]>([
    { name: "Omniknight", profile: require("../assets/images/paladin.jpg"), type: "Paladin", stats: { hp: 500, agi: 12, str: 18, int: 9 } },
    { name: "Lina", profile: require("../assets/images/sorcerer.jpg"), type: "Sorcerer", stats: { hp: 450, agi: 12, str: 9, int: 18 } },
    { name: "Axe", profile: require("../assets/images/warrior.jpg"), type: "Warrior", stats: { hp: 600, agi: 15, str: 15, int: 11 } },
  ]);

  const [heroIndex, setHeroIndex] = useState<number>(0);
  const hero = heroes[heroIndex];

  // Track user-allocated stat points
  const [userPoints, setUserPoints] = useState({ agi: 0, str: 0, int: 0 });
  const [counter, setCounter] = useState<number>(10);

  // Equipment bonus
  const equipmentBonus: Equipment["stats"] = selectedEquipment?.stats ?? { hp: 0, agi: 0, str: 0, int: 0 };

  // Reset user points and counter whenever hero or equipment changes
  useEffect(() => {
    setUserPoints({ agi: 0, str: 0, int: 0 });
    setCounter(10);
  }, [hero, selectedEquipment]);

  // Hero switching
  const handleHeroChange = (direction: "prev" | "next") => {
    if (direction === "next") setHeroIndex((prev) => (prev + 1) % heroes.length);
    else setHeroIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  // Increment stat
  const handleIncrement = (type: "agi" | "str" | "int") => {
    if (counter <= 0) {
      Platform.OS === "web"
        ? alert("Total points cannot exceed 10!")
        : Alert.alert("Limit reached", "Total points cannot exceed 10!");
      return;
    }
    setUserPoints((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setCounter((prev) => prev - 1);
  };

  // Decrement stat
  const handleDecrement = (type: "agi" | "str" | "int") => {
    if (counter === 10 || userPoints[type] <= 0) {
      Platform.OS === "web"
        ? alert("No points spent — cannot decrease yet!")
        : Alert.alert("No points spent", "You cannot decrease stats yet!");
      return;
    }
    setUserPoints((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    setCounter((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remaining Points: {counter}</Text>

      {/* Hero Switcher */}
      <View style={styles.heroSwitch}>
        <Button title="<" onPress={() => handleHeroChange("prev")} />
        <Text style={styles.heroName}>{hero.name}</Text>
        <Button title=">" onPress={() => handleHeroChange("next")} />
      </View>

      <Image source={hero.profile} style={{ width: 100, height: 100, margin: 10, borderRadius: 10 }} />
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{hero.type}</Text>

      {/* Stats display */}
      {(["agi", "str", "int"] as const).map((stat) => (
        <View key={stat} style={styles.row}>
          <Text style={styles.label}>
            {stat.toUpperCase()}: {hero.stats[stat] + userPoints[stat]} + ({equipmentBonus[stat]})
          </Text>
          <Button title="+" onPress={() => handleIncrement(stat)} />
          <Button title="-" onPress={() => handleDecrement(stat)} />
        </View>
      ))}

      {/* Navigation Buttons */}
      <View style={styles.hero}>
        <Button
          title="Go to Equipment Selection"
          onPress={() => navigation.navigate("equipment")}
        />
        <Button
          title="Choose your hero"
          onPress={() =>
            navigation.navigate("fight", {
              hero,
              stats: { ...hero.stats, ...userPoints, equipment: selectedEquipment },
            })
          }
        />
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
  label: { fontSize: 18, width: 180 },
  hero: { alignItems: "center", marginTop: 20 },
});
