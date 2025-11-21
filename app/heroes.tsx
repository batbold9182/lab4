import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

  const equipmentBonus: Equipment["stats"] =
    selectedEquipment?.stats ?? { hp: 0, agi: 0, str: 0, int: 0 };

  useEffect(() => {
    setUserPoints({ agi: 0, str: 0, int: 0 });
    setCounter(10);
  }, [hero, selectedEquipment]);

  // Fetch heroes
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetch("http://192.168.10.10:3003/heroes");
        const data = await res.json();
        setHeroes(data);
      } catch (err) {
        console.error("Failed to fetch heroes:", err);
        Platform.OS === "web"
          ? alert("Failed to fetch heroes")
          : Alert.alert("Error", "Failed to fetch heroes");
      }
    };
    fetchHeroes();
  }, []);

  const handleHeroChange = (direction: "prev" | "next") => {
    if (!heroes.length) return;
    if (direction === "next")
      setHeroIndex((prev) => (prev + 1) % heroes.length);
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

  if (!heroes.length) return <Text>Loading heroes...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Remaining Points: {counter}</Text>

      {/* Hero Switch */}
      <View style={styles.heroSwitch}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => handleHeroChange("prev")}
        >
          <Text style={styles.switchText}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.heroName}>{hero.name}</Text>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => handleHeroChange("next")}
        >
          <Text style={styles.switchText}>▶</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: hero.profile }}
        style={styles.heroImage}
      />
      <Text style={styles.heroType}>{hero.type}</Text>

      {/* Stats */}
            <View style={styles.statsCard}>
              {(["agi", "str", "int"] as const).map((stat) => (
        <View key={stat} style={styles.row}>
          
          {/* Icon */}
          <Image
            source={{ uri: hero?.icons?.[stat] }}
            style={styles.statIcon}
          />

          {/* Label */}
          <Text style={styles.label}>
            {stat.toUpperCase()}:{" "}
            {hero.stats[stat] + userPoints[stat]} + ({equipmentBonus[stat]})
          </Text>

          {/* Plus / Minus */}
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => handleIncrement(stat)}
          >
            <Text style={styles.plusMinusText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.minusButton}
            onPress={() => handleDecrement(stat)}
          >
            <Text style={styles.plusMinusText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}

      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("equipment")}
        >
          <Text style={styles.buttonText}>Go to Equipment Selection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("spell")}
        >
          <Text style={styles.buttonText}>Learn spell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            const finalStats = {
              hp: hero.stats.hp + (equipmentBonus.hp ?? 0),
              agi:
                hero.stats.agi +
                userPoints.agi +
                (equipmentBonus.agi ?? 0),
              str:
                hero.stats.str +
                userPoints.str +
                (equipmentBonus.str ?? 0),
              int:
                hero.stats.int +
                userPoints.int +
                (equipmentBonus.int ?? 0),
              equipment: selectedEquipment,
            };

            navigation.navigate("fight", {
              hero,
              stats: finalStats,
            });
          }}
        >
          <Text style={styles.buttonText}>Choose Your Hero</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statIcon:{
    width: 28,
    height: 28,
    marginRight: 10,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  heroSwitch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  switchButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
  },

  switchText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  heroName: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
  },

  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 15,
    marginBottom: 10,
  },

  heroType: {
    fontSize: 16,
    marginBottom: 10,
  },

  statsCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    marginVertical: 8,
  },

  label: {
    fontSize: 18,
    color: "#444",
    flex:1,
  },

  plusButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  minusButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  plusMinusText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonGroup: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: "#3498db",
    width: "90%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
