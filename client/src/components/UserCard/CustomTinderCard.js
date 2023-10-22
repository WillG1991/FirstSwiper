import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, PanResponder, Animated, Dimensions } from 'react-native';

const TinderCard = forwardRef(
  (
    {
      flickOnSwipe = true,
      children,
      onSwipe,
      onCardLeftScreen,
      className,
      preventSwipe = [],
    },
    ref
  ) => {
    const swipeAlreadyReleased = useRef(false);
    const element = useRef();

    const { width: screenWidth } = Dimensions.get('window');

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        swipeAlreadyReleased.current = false;
      },

      onPanResponderMove: (_, gestureState) => {
        const { dx, dy, vx, vy } = gestureState;

        // Apply translation on the x-axis
        const translationX = dx;
        const translationY = 0;

        // Calculate rotation based on the swipe velocity
        const rotation = Math.sign(vx) * Math.min(Math.abs(vx) / 5, 30);

        element.current.setNativeProps({
          style: {
            transform: [{ translateX: translationX }, { translateY: translationY }, { rotate: `${rotation}deg` }],
          },
        });
      },

      onPanResponderRelease: (_, gestureState) => {
        const { vx, vy } = gestureState;

        if (swipeAlreadyReleased.current) {
          return;
        }
        swipeAlreadyReleased.current = true;

        const speed = { x: vx, y: vy };
        const swipeDirection = getSwipeDirection(speed);

        if (onSwipe) onSwipe(swipeDirection);

        if (flickOnSwipe && !preventSwipe.includes(swipeDirection) && !['up', 'down'].includes(swipeDirection)) {
          animateOut(element.current, speed, swipeDirection).then(() => {
            element.current.setNativeProps({ style: { display: 'none' } });
            if (onCardLeftScreen) onCardLeftScreen(swipeDirection);
          });
        } else {
          animateBack(element.current).then(() => {
            element.current.setNativeProps({ style: { transform: [] } });
          });
        }
      },
    });

    useImperativeHandle(ref, () => ({
      async swipe(dir = 'right') {
        if (onSwipe) onSwipe(dir);
        const power = 1000;
        const disturbance = (Math.random() - 0.5) * 100;
        if (dir === 'right') {
          await animateOut(element.current, { x: power, y: disturbance }, true);
        } else if (dir === 'left') {
          await animateOut(element.current, { x: -power, y: disturbance }, true);
        } else if (dir === 'up') {
          await animateOut(element.current, { x: disturbance, y: power }, true);
        } else if (dir === 'down') {
          await animateOut(element.current, { x: disturbance, y: -power }, true);
        }
        element.current.setNativeProps({ style: { display: 'none' } });
        if (onCardLeftScreen) onCardLeftScreen(dir);
      },
      async restoreCard() {
        await animateBack(element.current);
        element.current.setNativeProps({ style: { transform: [] } });
      },
    }));

    return (
      <View {...panResponder.panHandlers} ref={element} style={className}>
        {children}
      </View>
    );
  }
);

export default TinderCard;

// Rest of the code remains unchanged
