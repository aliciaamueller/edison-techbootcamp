import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import SetTimeScreen from './screens/SetTimeScreen';
import ReasonScreen from './screens/ReasonScreen';
import ProofMethodScreen from './screens/ProofMethodScreen';
import AlarmSetScreen from './screens/AlarmSetScreen';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import ProofTaskScreen from './screens/ProofTaskScreen';
import RoundCompleteScreen from './screens/RoundCompleteScreen';
import SuccessScreen from './screens/SuccessScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SetTime" component={SetTimeScreen} />
        <Stack.Screen name="Reason" component={ReasonScreen} />
        <Stack.Screen name="ProofMethod" component={ProofMethodScreen} />
        <Stack.Screen name="AlarmSet" component={AlarmSetScreen} />
        <Stack.Screen name="AlarmRinging" component={AlarmRingingScreen} />
        <Stack.Screen name="ProofTask" component={ProofTaskScreen} />
        <Stack.Screen name="RoundComplete" component={RoundCompleteScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}