import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, Enemy, Hero, Equipment } from "./types";
import { StackNavigationProp } from "@react-navigation/stack";

type FightRouteProp = RouteProp<RootStackParamList, "fight">;
type NavigationProp = StackNavigationProp<RootStackParamList, "fight">;
type StatKey = "hp" | "agi" | "str" | "int";

export default function Fight() {
  const route = useRoute<FightRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { hero, stats } = route.params;

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [heroStats, setHeroStats] = useState(stats);
  const [history, setHistory] = useState<string[]>([]);

  // Fetch enemies
  useEffect(() => {
    const fetchEnemies = async () => {
      try {
        const res = await fetch("http://192.168.10.10:3003/characters");
        const data: Enemy[] = await res.json();
        setEnemies(data);

        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentEnemy(random);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch enemies from server");
      }
    };

    fetchEnemies();
  }, []);

  // Victory/defeat check
  useEffect(() => {
    if (!currentEnemy) return;
    if (currentEnemy.stats.hp <= 0) {
      Platform.OS === "web"
        ? alert("You won!")
        : Alert.alert("Victory", "You won!");
    } else if (heroStats.hp <= 0) {
      Platform.OS === "web"
        ? alert("You lost!")
        : Alert.alert("Defeat", "You lost!");
    }
  }, [heroStats.hp, currentEnemy]);

  // Attack logic
  const attackEnemy = () => {
    if (!currentEnemy) return;

    const heroDamage = Math.floor(((Math.random() * 6 + 1) - 0.5) * heroStats.str);

    setCurrentEnemy((prevEnemy) => {
      if (!prevEnemy) return prevEnemy;

      const newEnemyHp = Math.max(0, prevEnemy.stats.hp - heroDamage);

      setHistory((prev) => [
        `Hero deals ${heroDamage} damage to ${prevEnemy.name} (Enemy HP: ${newEnemyHp}, Hero HP: ${heroStats.hp})`,
        ...prev,
      ]);

      if (newEnemyHp > 0) {
        const enemyDamage = Math.floor(((Math.random() * 6 + 1) - 0.5) * prevEnemy.stats.str);

        setHeroStats((prevHero) => {
          const newHeroHp = Math.max(0, prevHero.hp - enemyDamage);
          setHistory((prev) => [
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

  // Render stat row with icon
  const renderStatRow = (stat: StatKey, value: number, icons?: Record<StatKey, string>) => (
    <View style={styles.statRow} key={stat}>
      {icons?.[stat] && (
        <Image source={{ uri: icons[stat] }} style={styles.statIcon} />
      )}
      <Text style={styles.statText}>
        {stat.toUpperCase()}: {value}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚔ Battle Arena ⚔</Text>

      {/* Hero Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{hero.name} ({hero.type})</Text>
        <Image source={{ uri: hero.profile }} style={styles.characterImage} />
        {(["hp", "str", "agi", "int"] as StatKey[]).map((stat) =>
          renderStatRow(stat, heroStats[stat], hero.icons)
        )}
      </View>

      {/* Enemy Card */}
      {currentEnemy && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {currentEnemy.name} ({currentEnemy.type})
          </Text>
          <Image source={{ uri: currentEnemy.profile }} style={styles.characterImage} />
          {(["hp", "str", "agi", "int"] as StatKey[]).map((stat) =>
            renderStatRow(stat, currentEnemy.stats[stat], currentEnemy.icons)
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.attackButton} onPress={attackEnemy}>
          <Text style={styles.buttonText}>Attack!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("heroes")}
        >
          <Text style={styles.buttonText}>Back to Heroes</Text>
        </TouchableOpacity>
      </View>

      {/* Battle History */}
      <Text style={styles.historyTitle}>Battle History</Text>
      <ScrollView style={styles.historyBox}>
        {history.map((entry, index) => (
          <Text
            key={index}
            style={[
              styles.historyEntry,
              { color: entry.startsWith("Hero") ? "#27ae60" : "#e74c3c" },
            ]}
          >
            {entry}
          </Text>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 15, backgroundColor: "#eef2f3" },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 10, color: "#2c3e50" },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#34495e" },
  characterImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
  statRow: { flexDirection: "row", alignItems: "center", marginVertical: 4, gap: 6 },
  statIcon: { width: 28, height: 28 },
  statText: { fontSize: 16 },
  buttons: { flexDirection: "row", marginTop: 15 },
  attackButton: { backgroundColor: "#c0392b", paddingVertical: 12, paddingHorizontal: 22, borderRadius: 12, marginRight: 12 },
  backButton: { backgroundColor: "#2980b9", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  historyTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#2c3e50" },
  historyBox: { width: "95%", maxHeight: 230, backgroundColor: "#fff", padding: 12, marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#ccc" },
  historyEntry: { marginBottom: 6, fontSize: 14, fontWeight: "600" },
});
