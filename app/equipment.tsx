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
import { Equipment, RootStackParamList } from "./types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type EquipmentNavigationProp = StackNavigationProp<
  RootStackParamList,
  "equipment"
>;

export default function EquipmentScreen() {
  const navigation = useNavigation<EquipmentNavigationProp>();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [eqIndex, setEqIndex] = useState<number>(0);
  const eq = equipmentList[eqIndex];

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch("http://192.168.10.10:3003/equipment");
        const data: Equipment[] = await res.json();
        setEquipmentList(data);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
        Platform.OS === "web"
          ? alert("Failed to fetch equipment")
          : Alert.alert("Error", "Failed to fetch equipment");
      }
    };
    fetchEquipment();
  }, []);

  const handleEqChange = (direction: "prev" | "next") => {
    if (direction === "next")
      setEqIndex((prev) => (prev + 1) % equipmentList.length);
    else setEqIndex((prev) => (prev - 1 + equipmentList.length) % equipmentList.length);
  };

  if (!equipmentList.length) return <Text>Loading equipment...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equipment</Text>

      <Image source={{ uri: eq.profile }} style={styles.image} />
      <Text style={styles.itemName}>{eq.name}</Text>

      {/* Equipment Type Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{eq.type.toUpperCase()}</Text>
      </View>

      {/* Stats Card with Icons */}
      <View style={styles.statsCard}>
        {(["hp", "agi", "str", "int"] as const).map((stat) => (
          <View key={stat} style={styles.row}>
            {/* Icon */}
            <Image
              source={{ uri: eq.icons?.[stat] }}
              style={styles.statIcon}
            />

            {/* Value */}
            <Text style={styles.statLabel}>
              {stat.toUpperCase()}: {eq.stats[stat]}
            </Text>
          </View>
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleEqChange("prev")}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.equipButton}
          onPress={() => navigation.navigate("heroes", { selectedEquipment: eq })}
        >
          <Text style={styles.equipButtonText}>Equip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleEqChange("next")}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.indexText}>
        Viewing equipment {eqIndex + 1} of {equipmentList.length}
      </Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("heroes")}
      >
        <Text style={styles.backButtonText}>Back to Hero Selection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },

  itemName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },

  badge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 12,
  },

  badgeText: {
    color: "white",
    fontWeight: "bold",
  },

  statsCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    marginBottom: 15,
  },

  statLabel: {
    fontSize: 18,
    marginVertical: 3,
    color: "#444",
    flex: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  navButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  navButtonText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  equipButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginHorizontal: 5,
  },

  equipButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  indexText: {
    marginTop: 15,
    fontSize: 16,
  },

  backButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
  },

  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
