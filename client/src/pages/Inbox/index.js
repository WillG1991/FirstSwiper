import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_USERS, QUERY_CHAT_PARTNER } from '../../utils/queries';
import { BLOCK_USER } from '../../utils/mutations';
import { FRIEND_REQUEST_SENT_SUBSCRIPTION } from '../../utils/subscriptions';
import { TabView, TabBar } from 'react-native-tab-view';
import { Avatar, Badge } from 'react-native-paper';
import {
  createChannelId,
} from '../../utils/helperFunction';
import UserCardMenu from '../../components/UserCardMenu';
import LoadingScreen from '../../components/Loading';
import SecondaryNav from '../../components/SecondaryNav';
import CustomDrawer from '../../components/Drawer';
import Profile from '../../components/Profile';
import Settings from '../Settings';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { meState } from '../../recoil/atoms';

const Inbox = () => {
  const navigation = useNavigation();
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { tabIndex: tabIndexParam = "0" } = useParams();
  const loggedIn = auth.loggedIn();
  const [state, setState] = useState({
    partner: null,
    showInfo: false,
    conversationId: null,
    selectedChannel: null,
    showBackdrop: false,
    lastMessages: {},
    subscriptionData: null,
    usernamesById: {},
    tabIndex: Number(tabIndexParam),
    loading: true,
    hasNewFriendRequest: false,
  });
  const { partner, showInfo, selectedChannel, showBackdrop, lastMessages, subscriptionData, usernamesById, tabIndex, loading } = state;
  const [getChatPartner, { data: chatPartnerData }] = useLazyQuery(QUERY_CHAT_PARTNER);
  const [blockUser] = useMutation(BLOCK_USER)
  const [me, setMe] = useRecoilState(meState);
  const [users, setUsers] = useState(null);
  const { loading: loadingMe, data: myData, refetch: refetchMe } = useQuery(QUERY_ME);
  const { loading: loadingUsers, data: usersData } = useQuery(QUERY_USERS);
  const [requestsTabClicked, setRequestsTabClicked] = useState(false);

  const hasNewFriendRequest =
    me && me.me && me.me.friendRequests && me.me.friendRequests.length > 0;

  // ... (continued)

  if (!loggedIn) {
    navigate('/');
    return null; // You can return null or any other component here
  }

  if (loadingMe || loadingUsers) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <SecondaryNav
        username={me?.me?.username}
        id={me?.me?._id}
        avatar={me?.me?.photoURL}
        requests={me?.me?.friendRequests}
        onProfileButtonClick={handleProfileDrawerOpen}
        onSettingsButtonClick={handleSettingsDrawerOpen}
      />
      <CustomDrawer maxWidth={382} open={isProfileDrawerOpen} onClose={handleProfileDrawerClose}>
        <Profile onClose={handleProfileDrawerClose} />
      </CustomDrawer>
      <CustomDrawer open={isSettingsDrawerOpen} onClose={handleSettingsDrawerClose}>
        <Settings onClose={handleSettingsDrawerClose} />
      </CustomDrawer>
      <TabView
        navigationState={{ index: tabIndex, routes: [{ key: 'inbox', title: 'Inbox' }, { key: 'requests', title: 'Requests' }] }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'inbox':
              return (
                <ScrollView style={styles.scrollView}>
                  <MatchList
                    userNameClick={handleClick}
                    matches={me?.me?.friends}
                    myID={me?.me._id}
                    matchedWithUsername={matchedUsername}
                    passUsername={myUsername}
                  />
                  <UnmatchedUsersList
                    users={users?.users}
                    matchedUserIds={matchedUserIds}
                    unmatchedUserIds={unmatchedUserIds}
                  />
                </ScrollView>
              );
            case 'requests':
              return (
                <ScrollView style={styles.scrollView}>
                  <RequestsTabContent
                    me={me}
                    handleBlockUser={handleBlockUser}
                    handleRemoveFriend={() => {
                      setState(prevState => ({ ...prevState, showBackdrop: false }));
                    }}
                  />
                </ScrollView>
              );
            default:
              return null;
          }
        }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor="#ffffff"
            inactiveColor="#8b8b8b"
          />
        )}
        onIndexChange={index => setState(prevState => ({ ...prevState, tabIndex: index }))}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
      {partner && (
        <StyledBackdrop open={showBackdrop}>
          <View style={styles.backdropHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.backdropBackButton}>
              <ChevronLeft color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backdropUserInfo} onPress={toggleInfo}>
              <Avatar.Text
                size={48}
                label={getAvatarInitials(chatPartnerData?.user.username)}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <Text style={styles.username}>{chatPartnerData?.user.username}</Text>
            </TouchableOpacity>
            <UserCardMenu
              handleBlockUser={handleBlockUser}
              userId={chatPartnerData?.user._id}
              myId={me.me._id}
              onRemoveFriend={() => {
                setState(prevState => ({ ...prevState, showBackdrop: false }));
              }}
            />
          </View>
          {showInfo ? (
            <ChatPartnersProfile chatPartnerData={chatPartnerData?.user} />
          ) : (
            me?.me.username && partner && (
              <Chat
                myData={me}
                currentChatPartner={partner}
                chatPartnerData={chatPartnerData?.user}
                username={me?.me.username}
                recipient={partner}
                channelId={selectedChannel}
                lastMessages={state.lastMessages}
                style={styles.chat}
                onCloseBackdrop={handleClose}
              />
            )
          )}
        </StyledBackdrop>
      )}
    </View>
  );
}

export default Inbox;
