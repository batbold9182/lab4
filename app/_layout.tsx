import { createStackNavigator } from "@react-navigation/stack";
import Index from "./index";
import Fight from "./fight";

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen name="index" component={Index} options={{ title: "Hero Selection" }} />
      <Stack.Screen name="fight" component={Fight} options={{ title: "Fight Scene" }} />
    </Stack.Navigator>
  );
}
