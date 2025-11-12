import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { Equipment, RootStackParamList } from "./types";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type EquipmentRouteProp = RouteProp<RootStackParamList, "equipment">;
type EquipmentNavigationProp = StackNavigationProp<RootStackParamList, "equipment">;

export default function EquipmentScreen() {
  const route = useRoute<EquipmentRouteProp>();
  const navigation = useNavigation<EquipmentNavigationProp>();

  const [equipmentList] = useState<Equipment[]>([
    { name: "Sword", type: "melee", stats: { hp: 500, agi: 12, str: 18, int: 9 }, profile: require("../assets/images/sword.jpg") },
    { name: "Axe", type: "range", stats: { hp: 450, agi: 12, str: 9, int: 18 }, profile: require("../assets/images/axe.jpg") },
    { name: "Staff", type: "melee", stats: { hp: 600, agi: 15, str: 15, int: 11 }, profile: require("../assets/images/staff.jpg") },
  ]);

  const [eqIndex, setEqIndex] = useState<number>(0);
  const eq = equipmentList[eqIndex];

  const handleEqChange = (direction: "prev" | "next") => {
    if (direction === "next") {
      setEqIndex((prev) => (prev + 1) % equipmentList.length);
    } else if (direction === "prev") {
      setEqIndex((prev) => (prev - 1 + equipmentList.length) % equipmentList.length);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipment</Text>

      <Image source={eq.profile} style={{ width: 150, height: 150, marginBottom: 10 }} />
      <Text style={styles.heroName}>{eq.name}</Text>
      <Text>Type: {eq.type}</Text>
      <Text>HP: {eq.stats.hp}</Text>
      <Text>AGI: {eq.stats.agi}</Text>
      <Text>STR: {eq.stats.str}</Text>
      <Text>INT: {eq.stats.int}</Text>

      <View style={styles.row}>
        <Button title="Previous" onPress={() => handleEqChange("prev")} />
            <Button
             title="Equip"  onPress={() => {navigation.navigate("heroes", { selectedEquipment: eq });  }}/>

        <Button title="Next" onPress={() => handleEqChange("next")} />
      </View>

      <Text style={{ marginTop: 20 }}>
        Viewing equipment {eqIndex + 1} of {equipmentList.length}
      </Text>

      <Button title ="Back to Hero Selection" onPress={() => navigation.navigate("heroes")}
       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  heroName: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 15, gap: 10 },
});
