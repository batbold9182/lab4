import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, Enemy } from "./types";
import { StackNavigationProp } from "@react-navigation/stack";

type FightRouteProp = RouteProp<RootStackParamList, "fight">;
type NavigationProp = StackNavigationProp<RootStackParamList, "fight">;

export default function Fight() {
  const route = useRoute<FightRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { hero, stats } = route.params;

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [heroStats, setHeroStats] = useState({ ...stats });
  const [history, setHistory] = useState<string[]>([]);

  // Fetch enemies from server
  useEffect(() => {
    const fetchEnemies = async () => {
      try {
        const res = await fetch("http://192.168.10.10:3003/characters"); // Replace with your server IP
        const data: Enemy[] = await res.json();
        setEnemies(data);

        // Pick random enemy
        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentEnemy(random);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch enemies from server");
      }
    };

    fetchEnemies();
  }, []);

  // Check for victory or defeat
  useEffect(() => {
    if (!currentEnemy) return;

    if (currentEnemy.stats.hp <= 0) {
      if (Platform.OS === "web") alert("You won!");
      else Alert.alert("Victory", "You won!");
    } else if (heroStats.hp <= 0) {
      if (Platform.OS === "web") alert("You lost!");
      else Alert.alert("Defeat", "You lost!");
    }
  }, [heroStats.hp, currentEnemy]);

  // Attack logic
  const attackEnemy = () => {
    if (!currentEnemy) return;

    const heroDamage = Math.floor((((Math.random() * 6) + 1) - 0.5) * heroStats.str);

    setCurrentEnemy(prevEnemy => {
      if (!prevEnemy) return prevEnemy;

      const newEnemyHp = Math.max(0, prevEnemy.stats.hp - heroDamage);

      setHistory(prev => [
        `Hero deals ${heroDamage} damage to ${prevEnemy.name} (Enemy HP: ${newEnemyHp}, Hero HP: ${heroStats.hp})`,
        ...prev,
      ]);

      if (newEnemyHp > 0) {
        const enemyDamage = Math.floor((((Math.random() * 6) + 1) - 0.5) * prevEnemy.stats.str);

        setHeroStats(prevHero => {
          const newHeroHp = Math.max(0, prevHero.hp - enemyDamage);

          setHistory(prev => [
            `${prevEnemy.name} deals ${enemyDamage} damage to Hero (Hero HP: ${newHeroHp}, Enemy HP: ${newEnemyHp})`,
            ...prev,
          ]);

          return { ...prevHero, hp: newHeroHp };
        });
      }

      return {
        ...prevEnemy,
        stats: { ...prevEnemy.stats, hp: newEnemyHp },
      };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battle Arena</Text>

      {/* Hero Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{hero.name} (Hero)</Text>
        <Image source={hero.profile} style={styles.heroImage} />
        <Text>HP: {heroStats.hp}</Text>
        <Text>STR: {heroStats.str} | AGI: {heroStats.agi} | INT: {heroStats.int}</Text>
      </View>

      {/* Enemy Card */}
      {currentEnemy && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{currentEnemy.name} ({currentEnemy.type})</Text>
          <Image source={{ uri: currentEnemy.profile }} style={styles.enemyImage} />
          <Text>HP: {currentEnemy.stats.hp}</Text>
          <Text>STR: {currentEnemy.stats.str} | AGI: {currentEnemy.stats.agi} | INT: {currentEnemy.stats.int}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.attackButton} onPress={attackEnemy}>
          <Text style={styles.buttonText}>Attack!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("heroes")}>
          <Text style={styles.buttonText}>Back to Hero Selection</Text>
        </TouchableOpacity>
      </View>

      {/* Battle History */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Battle History</Text>
      <ScrollView style={styles.history}>
        {history.map((entry, index) => (
          <Text
            key={index}
            style={{ color: entry.startsWith("Hero") ? "green" : "red", marginBottom: 4 }}
          >
            {entry}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", alignItems: "center", padding: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 10 },
  card: { width: "90%", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 10, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  heroImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  enemyImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  buttons: { flexDirection: "row", marginTop: 15 },
  attackButton: { backgroundColor: "#e74c3c", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginRight: 10 },
  backButton: { backgroundColor: "#3498db", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  history: { width: "90%", maxHeight: 200, backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: "#ccc" },
});
