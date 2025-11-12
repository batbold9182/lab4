import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { translations } from "./translation";
type InstructionNavigationProp = StackNavigationProp<RootStackParamList, "index">;


export default function Index() {
  const navigation = useNavigation<InstructionNavigationProp>();
  const [lang, setLang] = useState<"en" | "mn">("en");
  const t = translations[lang];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {}
      <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
        <Button title="EN" onPress={() => setLang("en")} />
        <Button title="MN" onPress={() => setLang("mn")} />
      </View>

      <Text style={styles.title}>{t.welcome}</Text>
      <Text style={styles.text}>{t.description}</Text>

      {t.bullets.map((bullet, idx) => (
        <Text key={idx} style={styles.bullet}>• {bullet}</Text>
      ))}

      <Text style={[styles.text, { marginTop: 20 }]}>{t.note}</Text>

      <View style={{ marginTop: 30 }}>
        <Button title={t.start} onPress={() => navigation.navigate("heroes")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
    width: "90%",
  },
});
