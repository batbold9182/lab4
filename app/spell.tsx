import React from "react";
import { View, Text, StyleSheet ,TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";

type ShopNavigationProp = StackNavigationProp<RootStackParamList, "equipment">;

export default function Spell() {
  const navigation = useNavigation<ShopNavigationProp>();

  return (
    <View style={styles.buttonGroup}>
        <Text style={styles.title}>You must reach 5 level to use spell 🔒</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("heroes")}
              >
                <Text style={styles.buttonText}>Go to heroes</Text>
              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
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
