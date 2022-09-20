import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import styled from 'styled-components/native'

import { theme } from '@online-library/core'

import type { RootStackParamList } from 'types'

import { Text } from './common'
import { HomeScreen } from './screens'

const Tab = createBottomTabNavigator<RootStackParamList>()

export const App = () => {
   useEffect(() => SplashScreen.hide(), [])
   return (
      <AppContainer>
         <NavigationContainer>
            <Tab.Navigator
               initialRouteName="Home"
               screenOptions={{
                  headerShown: false,
                  tabBarStyle: { backgroundColor: theme.colors.primary },
                  tabBarLabelStyle: { display: 'none' },
                  tabBarItemStyle: { justifyContent: 'center' },
                  tabBarBadgeStyle: { backgroundColor: 'white' },
               }}
            >
               <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ tabBarIcon: () => <Text>🏠</Text> }}
               />
            </Tab.Navigator>
         </NavigationContainer>
      </AppContainer>
   )
}

const AppContainer = styled.View`
   flex: 1;
`
