import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image, Alert, Platform, ScrollView } from "react-native";
import { Equipment, RootStackParamList } from "./types";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type EquipmentRouteProp = RouteProp<RootStackParamList, "equipment">;
type EquipmentNavigationProp = StackNavigationProp<RootStackParamList, "equipment">;

export default function EquipmentScreen() {
  const navigation = useNavigation<EquipmentNavigationProp>();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [eqIndex, setEqIndex] = useState<number>(0);
  const eq = equipmentList[eqIndex];

  // Fetch equipment from backend
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
    if (direction === "next") setEqIndex((prev) => (prev + 1) % equipmentList.length);
    else setEqIndex((prev) => (prev - 1 + equipmentList.length) % equipmentList.length);
  };

  if (!equipmentList.length) return <Text>Loading equipment...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equipment</Text>

      <Image source={{ uri: eq.profile }} style={{ width: 150, height: 150, marginBottom: 10 }} />
      <Text style={styles.heroName}>{eq.name}</Text>
      <Text>Type: {eq.type}</Text>
      <Text>HP: {eq.stats.hp}</Text>
      <Text>AGI: {eq.stats.agi}</Text>
      <Text>STR: {eq.stats.str}</Text>
      <Text>INT: {eq.stats.int}</Text>

      <View style={styles.row}>
        <Button title="Previous" onPress={() => handleEqChange("prev")} />
        <Button
          title="Equip"
          onPress={() => {
            navigation.navigate("heroes", { selectedEquipment: eq });
          }}
        />
        <Button title="Next" onPress={() => handleEqChange("next")} />
      </View>

      <Text style={{ marginTop: 20 }}>
        Viewing equipment {eqIndex + 1} of {equipmentList.length}
      </Text>

      <Button title="Back to Hero Selection" onPress={() => navigation.navigate("heroes")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  heroName: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 15, gap: 10 },
});
