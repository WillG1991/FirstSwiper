import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useMutation } from "@apollo/client";
import {
  ADD_FRIEND,
  SEND_FRIEND_REQUEST,
  BLOCK_USER,
  UNBLOCK_USER,
} from "../../utils/mutations";
import { ADD_DISLIKED_USER } from "../../utils/mutations";
import SwipeComponent from "../SwipeComponent";
import { Avatar, Card } from "react-native-elements";
import { Icon } from "react-native-elements";
import UserCardMenu from "../UserCardMenu";
import UserInfo from "./userInfo.js";
import UserKinks from "./userKinks";
import UserIdentity from "./userIdentity";

const UserCard = (props) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user, sendBackUser } = props;
  const [lastDirection, setLastDirection] = useState();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [cardContentStyle, setCardContentStyle] = useState({});
  const [backdropStyle, setBackdropStyle] = useState({});
  const [cardContainerHeight, setCardContainerHeight] = useState(null);
  const cardContentRef = useRef();
  const [unblockUser] = useMutation(UNBLOCK_USER);
  const [blockUser] = useMutation(BLOCK_USER);
  const [addFriend] = useMutation(ADD_FRIEND);
  const [addDislikedUser] = useMutation(ADD_DISLIKED_USER);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);

  const swiped = async (direction, nameToDelete, id) => {
    props.onSwipe();
    setLastDirection(direction);
    if (direction === "right") {
      await addFriend({ variables: { friendId: id } });
      await sendFriendRequest({ variables: { friendId: id } });
    } else {
      await addDislikedUser({ variables: { dislikedUserId: id } });
      console.log("disliked user id: " + id);
    }
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const handleBlockUser = async (id, username) => {
    try {
      await blockUser({ variables: { userId: id } });
      // props.onBlock();
      setShowAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const { data } = await unblockUser({ variables: { userId: userId } });
      setShowAlert(false);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const handleBackdropClose = () => {
    setCardContentStyle({});
    setBackdropOpen(false);
    setCardContainerHeight(null);
  };

  const handleDragHandleClick = () => {
    if (backdropOpen) {
      handleBackdropClose();
    } else {
      const cardContainerHeight = cardContentRef.current.clientHeight;
      setCardContainerHeight(cardContainerHeight);
      setCardContentStyle({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "black",
        color: "white",
        height: `${windowHeight * 0.25}px`,
      });
      setBackdropOpen(true);
      setBackdropStyle({
        marginTop: `${windowHeight * 0.17}px`,
        paddingTop: "-5px",
      });
    }
  };

  return showAlert ? (
    <>
      <Text>Show alert here</Text>
      {/* Render the alert component here */}
    </>
  ) : (
    <SwipeComponent
      isPhotoModalOpen={isPhotoModalOpen}
      key={user.username}
      onSwipe={(dir) => swiped(dir, user.username, user._id)}
      onCardLeftScreen={() => outOfFrame(user.username)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e4e4e4",
        position: "relative",
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <Card
        sx={{
          maxWidth: 300,
          width: "100%",
          borderRadius: 2,
          marginBottom: "20px",
          height: cardContainerHeight,
        }}
        id="myContainer"
      >
        <View
          style={{
            position: "relative",
            height: "55vh",
          }}
        >
          <View
            style={{
              position: "relative",
              width: "80%",
              height: "100%",
            }}
          >
            <Avatar
              variant="square"
              source={{
                uri: !!user.photoURL[0] ? user.photoURL[0] : "",
              }}
            >
              {user.role === "admirer" ? (
                <Icon
                  name="male" // Use the appropriate icon name for male
                  type="material-community" // Use the correct icon library and type
                  style={{
                    fontSize: 400,
                    color: "#1785b2",
                    marginTop: 10,
                  }}
                />
              ) : (
                <Icon
                  name="female" // Use the appropriate icon name for female
                  type="material-community" // Use the correct icon library and type
                  style={{
                    fontSize: 400,
                    color: "#bd59ce",
                    marginTop: 10,
                  }}
                />
              )}
            </Avatar>
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1000,
                color: "white",
                padding: "0.5rem",
              }}
            >
              <UserCardMenu
                handleBlockUser={handleBlockUser}
                username={user.username}
                userId={user._id}
                myId={props.myId}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "0px",
            ...cardContentStyle,
            overflow: "auto",
          }}
          ref={cardContentRef}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Icon
              name="drag-handle" // Use the appropriate icon name for a drag handle
              type="material-community" // Use the correct icon library and type
              style={{
                width: 30,
                height: 30,
                margin: "-5 auto",
              }}
              onPress={handleDragHandleClick}
            />
          </View>
          <View style={{ marginRight: 1 }} />
          <UserInfo user={user} />
        </View>
        {backdropOpen && (
          <View
            style={{
              backgroundColor: "black",
              zIndex: 1,
              position: "absolute",
              width: "100%",
              height: "auto%",
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...backdropStyle,
            }}
          >
            {/* Add the rest of your content here */}
          </View>
        )}
      </Card>
    </SwipeComponent>
  );
};

export default UserCard;
