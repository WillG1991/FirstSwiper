import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import Auth from "../../utils/auth";
import DashboardLocation from "../../components/DashboardLocation";
import DashboardRoulette from "../../components/DashboardRoulette";
import { useQuery, useLazyQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries";
import { TabView, TabBar } from "react-native-tab-view";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userLocationState, meState } from "../../recoil/atoms";
import LoadingScreen from "../../components/Loading";
import SecondaryNav from "../../components/SecondaryNav";
import CustomDrawer from "../../components/Drawer";
import Profile from "../../components/Profile";
import Settings from "../Settings";

const Dashboards = () => {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const tabContainerRef = useRef(null);

  const handlePageChange = (index) => {
    setActiveTab(index);
  };

  const handleProfileDrawerOpen = () => {
    setIsProfileDrawerOpen(true);
  };

  const handleProfileDrawerClose = () => {
    setIsProfileDrawerOpen(false);
  };

  const handleSettingsDrawerOpen = () => {
    setIsSettingsDrawerOpen(true);
  };

  const handleSettingsDrawerClose = () => {
    setIsSettingsDrawerOpen(false);
  };

  const loggedIn = Auth.loggedIn();
  const [me, setMe] = useRecoilState(meState);
  const userLocation = useRecoilValue(userLocationState);
  const updateUserLocation = useSetRecoilState(userLocationState);

  const { loading: queryLoading, data: cachedData } = useQuery(QUERY_ME);

  const [fetchMeData, { loading: fetchLoading, data: fetchedData }] = useLazyQuery(QUERY_ME);

  useEffect(() => {
    if (!queryLoading && cachedData && cachedData.me) {
      setMe(cachedData.me);
      updateUserLocation({
        latitude: cachedData.me.location[0],
        longitude: cachedData.me.location[1],
      });
    } else if (!fetchLoading && fetchedData && fetchedData.me) {
      setMe(fetchedData.me);
      updateUserLocation({
        latitude: fetchedData.me.location[0],
        longitude: fetchedData.me.location[1],
      });
    } else if (!fetchLoading && !fetchedData && !queryLoading) {
      fetchMeData();
    }
  }, [queryLoading, cachedData, fetchLoading, fetchedData, fetchMeData, updateUserLocation]);

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateUserLocation({ latitude, longitude });
      },
      (error) => {
        console.log("Error fetching user location: ", error);
      }
    );
  };

  useEffect(() => {
    if (loggedIn && me && !userLocation.latitude && !userLocation.longitude) {
      fetchUserLocation();
    }
  }, [loggedIn, me, userLocation]);

  useEffect(() => {
    if (!queryLoading) {
      setLoading(false);
    }
  }, [queryLoading]);

  if (queryLoading || loading) {
    return <LoadingScreen />;
  }

  if (loggedIn && me && userLocation.latitude && userLocation.longitude) {
    return (
      <>
        <SecondaryNav
          username={me?.username}
          id={me?._id}
          avatar={me?.photoURL}
          requests={me?.friendRequests}
          onProfileButtonClick={handleProfileDrawerOpen}
          onSettingsButtonClick={handleSettingsDrawerOpen}
        />
        <CustomDrawer maxWidth={382} open={isProfileDrawerOpen} onClose={handleProfileDrawerClose}>
          <Profile onClose={handleProfileDrawerClose} />
        </CustomDrawer>
        <CustomDrawer open={isSettingsDrawerOpen} onClose={handleSettingsDrawerClose}>
          <Settings onClose={handleSettingsDrawerClose} />
        </CustomDrawer>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            marginBottom: 88,
            marginLeft: 0,
          }}
        >
          <ScrollView
            ref={tabContainerRef}
            style={{ borderBottomWidth: 1, borderColor: "divider" }}
          >
            <TabView
              navigationState={{ index: activeTab, routes: [{ key: 'distance', title: 'Distance' }, { key: 'roulette', title: 'Roulette' }] }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  indicatorStyle={{
                    backgroundColor: "white",
                  }}
                  labelStyle={{
                    color: "white",
                    textAlign: "center",
                    flexGrow: 1,
                  }}
                />
              )}
              renderScene={({ route }) => {
                switch (route.key) {
                  case "distance":
                    return <DashboardLocation userLocation={userLocation} />;
                  case "roulette":
                    return <DashboardRoulette activeTab={activeTab} />;
                  default:
                    return null;
                }
              }}
              onIndexChange={handlePageChange}
            />
          </ScrollView>
        </View>
      </>
    );
  }
  return null;
};

export default Dashboards;
