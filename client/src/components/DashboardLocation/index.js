import React, { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { meState } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper'; // Assuming you're using react-native-paper for Checkbox
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'; // Replace with the appropriate icon library

import getDistanceFromLatLonInKm from "../../utils/proximity";
import UserCard from "../UserCard";
import { UNBLOCK_USER } from "../../utils/mutations";
import KinksFilter from "./kinksFilter";
import PositionSelection from "./positionFilter";
import EthnicityFilter from "./ethnicityFilter";
import GenderFilter from "./genderFilter";

const DashboardLocation = () => {
  const me = useRecoilValue(meState);
  const role = me?.me?.role; // Use optional chaining to handle undefined

  if (!role) {
    return <View><Text>Role is undefined</Text></View>;
  }

  const [sortedUsers, setSortedUsers] = useState([]);
  const [swipedUsers, setSwipedUsers] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [onlineNow, setOnlineNow] = useState(false);
  const [page, setPage] = useState(1);
  const cardContainerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const oppositeRole = role === "sissy" ? "admirer" : "sissy";
  const [blockedUsername, setBlockedUsername] = useState("");
  const [blockedUserId, setBlockedUserId] = useState("");
  const [unblockUser] = useMutation(UNBLOCK_USER);
  const [selectedKink, setSelectedKink] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [isFilterIconClicked, setIsFilterIconClicked] = useState(false);

  const { data, fetchMore, refetch } = useQuery(QUERY_USERS_BY_ROLE, {
    variables: {
      role: oppositeRole,
      sortByDistance: true,
      userLocation: me.location,
      limit: 10,
      offset: 0,
      kink: selectedKink,
      position: selectedPosition,
      ethnicity: selectedEthnicity,
      gender: selectedGender,
      active: onlineNow
    },
    notifyOnNetworkStatusChange: true,
  });
  const usersByRole = data?.usersByRole || [];

  const handleSwipe = async (userId) => {
    setSwipedUsers((prevSwipedUsers) => [...prevSwipedUsers, userId]);
  };

  const [filterChanged, setFilterChanged] = useState(false);

  const refetchWithFilters = () => {
    refetch({
      role: oppositeRole,
      sortByDistance: true,
      userLocation: me.location,
      limit: 10,
      offset: 0,
      kink: selectedKink,
      position: selectedPosition,
      ethnicity: selectedEthnicity,
      gender: selectedGender,
    });
  };

  const handleScroll = useCallback(() => {
    const container = cardContainerRef.current;
    if (container) {
      const cardHeight = container.offsetHeight;
      const scrollPosition = container.scrollTop;
      const newIndex = Math.round(scrollPosition / cardHeight);
      setActiveCardIndex(newIndex);
    }
  }, []);

  const handleUnblockUser = async (userId) => {
    try {
      const { data } = await unblockUser({ variables: { userId: userId } });
      if (data.unblockUser.success) {
        setSwipedUsers((prevSwipedUsers) => prevSwipedUsers.filter((id) => id !== userId));
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  useEffect(() => {
    if (filterChanged) {
      refetchWithFilters();
      setFilterChanged(false);
    }
  }, [filterChanged]);

  useEffect(() => {
    const container = cardContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    const calculateSortedUsers = () => {
      const usersWithDistance = usersByRole.map((user) => {
        const [aLatitude, aLongitude] = me.location;
        const [bLatitude, bLongitude] = user.location;
        const distanceInKm = getDistanceFromLatLonInKm(
          parseFloat(aLatitude),
          parseFloat(aLongitude),
          parseFloat(bLatitude),
          parseFloat(bLongitude)
        );
        const distanceInMiles = Math.round(distanceInKm / 1.60934);
        return {
          ...user,
          distance: distanceInMiles,
        };
      });

      const filteredUsers = usersWithDistance.filter((user) => !swipedUsers.includes(user._id));
      setSortedUsers(filteredUsers);
    };

    calculateSortedUsers();
  }, [data, swipedUsers, selectedKink, selectedPosition, selectedEthnicity, selectedGender]);

  const loadMoreUsers = () => {
    fetchMore({
      variables: {
        limit: 10,
        offset: page * 10,
        kink: selectedKink,
        position: selectedPosition,
        ethnicity: selectedEthnicity,
        gender: selectedGender,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          !fetchMoreResult.usersByRole ||
          !fetchMoreResult.usersByRole.users
        ) {
          return prev;
        }
        const newUsers = fetchMoreResult.usersByRole.users;
        const updatedUsers = [...prev.usersByRole.users, ...newUsers];

        return {
          ...prev,
          usersByRole: {
            ...prev.usersByRole,
            users: updatedUsers,
          },
        };
      },
    })
      .then(() => {
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.error("Error loading more users:", error);
      });
  };

  const handleKinkSelection = (kink) => {
    setSelectedKink((prevSelectedKink) => {
      const newSelectedKink = prevSelectedKink === kink ? null : kink;
      setFilterChanged(true);
      return newSelectedKink;
    });
  };

  const handlePositionSelection = (position) => {
    setSelectedPosition((prevSelectedPosition) => {
      const newSelectedPosition = prevSelectedPosition === position ? null : position;
      setFilterChanged(true);
      return newSelectedPosition;
    });
  };

  const handleEthnicitySelection = (ethnicity) => {
    setSelectedEthnicity((prevSelectedEthnicity) => {
      const newSelectedEthnicity = prevSelectedEthnicity === ethnicity ? null : ethnicity;
      setFilterChanged(true);
      return newSelectedEthnicity;
    });
  };

  const handleGenderSelection = (gender) => {
    setSelectedGender((prevSelectedGender) => {
      const newSelectedGender = prevSelectedGender === gender ? null : gender;
      setFilterChanged(true);
      return newSelectedGender;
    });
  };

  const handleFilterIconClick = () => {
    setIsFilterIconClicked((prevValue) => !prevValue);
  };

  const handleFilterOptionClick = (event) => {
    event.stopPropagation(); // Prevent backdrop from closing on filter option click
  };

  const handleOnlineFilterChange = () => {
    setOnlineNow(!onlineNow);
  };

  return (
    <ScrollView style={{ flexGrow: 1, marginTop: 5 }}>
      <TouchableOpacity onPress={handleFilterIconClick} style={{ position: 'absolute', top: 0, right: 0 }}>
        {/* Replace with an appropriate icon */}
        <FontAwesomeIcon name="filter" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView>
        <View style={{
          display: 'flex',
          justifyContent: 'flex-start',
          paddingHorizontal: '5%',
          paddingTop: '10px',
          paddingBottom: '10px',
          flexDirection: 'column',
          flexGrow: 1,
        }}
          onStartShouldSetResponder={() => true}
          onClick={handleFilterOptionClick}
        >
          <Checkbox
            status={onlineNow ? 'checked' : 'unchecked'}
            onPress={handleOnlineFilterChange}
            name="onlineNow"
            color="primary"
          />
          <Text>Online Now</Text>
          <KinksFilter selectedKink={selectedKink} onKinkSelect={handleKinkSelection} />
          <PositionSelection selectedPosition={selectedPosition} onPositionSelect={handlePositionSelection} />
          <EthnicityFilter selectedEthnicity={selectedEthnicity} onEthnicitySelect={handleEthnicitySelection} />
          <GenderFilter selectedGender={selectedGender} onGenderSelect={handleGenderSelection} />
        </View>
      </ScrollView>

      <View style={{ alignItems: 'center' }}>
        {showAlert && (
          <Alert icon={false} style={{ marginBottom: 2 }} variant="outlined" severity="info">
            {blockedUsername} is blocked
          </Alert>
        )}

        {sortedUsers.slice(0, page * 10).map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            myId={me._id}
            fullSize={index === activeCardIndex}
            onSwipe={() => handleSwipe(user._id)}
            style={{ marginBottom: 20 }}
          >
            <Text>{`${user.distance} mi`}</Text>
          </UserCard>
        ))}
      </View>
      <TouchableOpacity onPress={loadMoreUsers} disabled={page * 10 >= sortedUsers.length}>
        <Text>Load More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardLocation;
