import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMainDefinition } from "@apollo/client/utilities";
import { RecoilRoot } from "recoil";
import Home from "./client/src/pages/Home"
import LoginPage from "./client/src/pages/LoginPage";
import Dashboards from "./client/src/pages/Dashboards"
import Profile from "./client/src/components/Profile";
import PageNotFound from "./client/src/components/PageNotFound/index";
import FileUpload from "./client/src/components/FileUpload";
import Inbox from "./client/src/pages/Inbox";
import ResetPasswordForm from "./client/src/components/ResetPasswordForm";
import Verify from "./client/src/components/Verify";
import LocationProvider from "./client/src/components/LocationProvider";
import PrivacyPolicy from "./client/src/components/PrivacyPolicy";
import HomeBack from "./client/src/pages/Home/homeBack";
import About from "./client/src/pages/AboutSupportContact/about";
import Support from "./client/src/pages/AboutSupportContact/support";
import Contact from "./client/src/pages/AboutSupportContact/contact";
import Donation from "./client/src/pages/AboutSupportContact/donation";

const Stack = createNativeStackNavigator();

const wsLink = new WebSocketLink({
  uri: "ws://localhost:3001/graphql", // Update the WebSocket URL
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql", // Update the GraphQL HTTP URL
});

const authLink = new ApolloLink(async (operation, forward) => {
  const token = await AsyncStorage.getItem('id_token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          friends: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          dislikedUsers: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <LocationProvider />
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Dashboards" component={Dashboards} />
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Donate" component={Donation} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="FileUpload" component={FileUpload} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="ResetPasswordForm" component={ResetPasswordForm} />
            <Stack.Screen name="Verify" component={Verify} />
            <Stack.Screen name="HomeBack" component={HomeBack} />
            <Stack.Screen name="PageNotFound" component={PageNotFound} />
          </Stack.Navigator>
        </NavigationContainer>
      </RecoilRoot>
    </ApolloProvider>
  );
}