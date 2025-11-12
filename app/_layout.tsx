import { createStackNavigator } from "@react-navigation/stack";
import Fight from "./fight";
import Equipment from "./equipment";
import InstructionScreen from "./index";
import Heroes from "./heroes";

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen name="index" component={InstructionScreen} options={{title:"index"}}/>
      <Stack.Screen name="heroes" component={Heroes} options={{ title: "Hero Selection" }} />
      <Stack.Screen name="fight" component={Fight} options={{ title: "Fight Scene" }} />
      <Stack.Screen name="equipment" component={Equipment} options={{ title: "Equipment" }} />

    </Stack.Navigator>
  );
}
