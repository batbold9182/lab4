// app/heroes.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Hero, Equipment } from "./types";

type HeroesRouteProp = RouteProp<RootStackParamList, "heroes">;
type HeroesNavigationProp = StackNavigationProp<RootStackParamList, "heroes">;

export default function Heroes() {
  const navigation = useNavigation<HeroesNavigationProp>();
  const route = useRoute<HeroesRouteProp>();

  const selectedEquipment = route.params?.selectedEquipment;

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const hero = heroes[heroIndex];

  const [userPoints, setUserPoints] = useState({ agi: 0, str: 0, int: 0 });
  const [counter, setCounter] = useState<number>(10);

  const equipmentBonus: Equipment["stats"] = selectedEquipment?.stats ?? { hp: 0, agi: 0, str: 0, int: 0 };

  useEffect(() => {
    setUserPoints({ agi: 0, str: 0, int: 0 });
    setCounter(10);
  }, [hero, selectedEquipment]);

  // Fetch heroes from backend
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetch("http://192.168.10.10:3003/heroes");
        const data = await res.json();
        setHeroes(data);
      } catch (err) {
        console.error("Failed to fetch heroes:", err);
        Platform.OS === "web" ? alert("Failed to fetch heroes") : Alert.alert("Error", "Failed to fetch heroes");
      }
    };
    fetchHeroes();
  }, []);

  const handleHeroChange = (direction: "prev" | "next") => {
    if (!heroes.length) return;
    if (direction === "next") setHeroIndex((prev) => (prev + 1) % heroes.length);
    else setHeroIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

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

  if (!heroes.length) {
    return <Text>Loading heroes...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Remaining Points: {counter}</Text>

      {/* Hero Switcher */}
      <View style={styles.heroSwitch}>
        <Button title="<" onPress={() => handleHeroChange("prev")} />
        <Text style={styles.heroName}>{hero.name}</Text>
        <Button title=">" onPress={() => handleHeroChange("next")} />
      </View>

      <Image source={{ uri: hero.profile }} style={{ width: 100, height: 100, margin: 10, borderRadius: 10 }} />
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
          onPress={() => {
            // Compute final stats
            const finalStats = {
              hp: hero.stats.hp + (equipmentBonus.hp ?? 0),
              agi: hero.stats.agi + userPoints.agi + (equipmentBonus.agi ?? 0),
              str: hero.stats.str + userPoints.str + (equipmentBonus.str ?? 0),
              int: hero.stats.int + userPoints.int + (equipmentBonus.int ?? 0),
              equipment: selectedEquipment,
            };

            // Navigate to fight screen
            navigation.navigate("fight", {
              hero,
              stats: finalStats,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  heroSwitch: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 15 },
  heroName: { fontSize: 22, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10 },
  label: { fontSize: 18, width: 180 },
  hero: { alignItems: "center", marginTop: 20 },
});
