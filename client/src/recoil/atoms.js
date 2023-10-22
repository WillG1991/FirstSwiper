import { atom } from 'recoil'

export const userLocationState = atom({
  key: 'user_location',
  default: {
    longitude: null,
    latitude: null
  }
})

export const meState = atom({
  key: 'me_state',
  default: {},
});