import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userLocationState } from '../../recoil/atoms';
import { useMutation } from '@apollo/client';
import { EDIT_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import Geolocation from 'react-native-geolocation-service';

const LocationProvider = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [editUser] = useMutation(EDIT_USER);
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    if (loggedIn) {
      const getLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };
      getLocation();
    }
  }, [loggedIn, setUserLocation]);

  useEffect(() => {
    if (loggedIn && userLocation.latitude && userLocation.longitude) {
      editUser({
        variables: {
          location: [userLocation.latitude, userLocation.longitude],
        },
      })
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [editUser, loggedIn, userLocation]);

  return null;
};

export default LocationProvider;
