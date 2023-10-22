import React, { useState, useRef, useEffect } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import { useImperativeHandle, forwardRef } from 'react';


const SwipeComponent = forwardRef(({ onSwipe, onCardLeftScreen, children, isPhotoModalOpen }, ref) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [boxOffset, setBoxOffset] = useState(new Animated.Value(0));
  const [isOffScreen, setIsOffScreen] = useState(false);
  const isDragging = useRef(false);
  const startXRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isPhotoModalOpen,
    onMoveShouldSetPanResponder: () => !isPhotoModalOpen,
    onPanResponderGrant: (e) => handleStart(e.nativeEvent.pageX),
    onPanResponderMove: (e) => handleMove(e.nativeEvent.pageX),
    onPanResponderRelease: handleEnd,
  });

  const handleStart = (pageX) => {
    if (isPhotoModalOpen) return;
    startXRef.current = pageX;
    isDragging.current = true;
  };

  const handleMove = (pageX) => {
    if (!isDragging.current || !startXRef.current) return;

    const diffX = pageX - startXRef.current;
    setBoxOffset(new Animated.Value(diffX));
  };

  const handleEnd = () => {
    if (!isDragging.current || !startXRef.current) return;

    isDragging.current = false;
    startXRef.current = null;

    const diffX = boxOffset._value;
    handleSwipe(diffX);

    if (Math.abs(diffX) > 100) {
      if (diffX > 0) {
        setSwipeDirection('right');
        setBoxOffset(new Animated.Value(window.innerWidth));
        onSwipe('right');
      } else {
        setSwipeDirection('left');
        setBoxOffset(new Animated.Value(-window.innerWidth));
        onSwipe('left');
      }
      setIsOffScreen(true);
      onCardLeftScreen();
    } else {
      setBoxOffset(new Animated.Value(0));
      setIsOffScreen(false);
    }

    if (isOffScreen && onCardLeftScreen) {
      onCardLeftScreen();
    }
  };

  const handleSwipe = (diffX) => {
    if (Math.abs(diffX) > 150) {
      if (diffX > 0) {
        setSwipeDirection('right');
      } else {
        setSwipeDirection('left');
      }
    } else {
      setSwipeDirection(null);
    }
  };

  useImperativeHandle(ref, () => ({
    swipe: () => {
      return swipeDirection;
    },
  }));

  const handleReset = () => {
    setBoxOffset(new Animated.Value(0));
    setSwipeDirection(null);
    setIsOffScreen(false);
  };

  useEffect(() => {
    if (boxOffset) {
      Animated.timing(boxOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [boxOffset]);

  return (
    <View
      {...panResponder.panHandlers}
      style={{ width: '100%', overflow: 'hidden', position: 'relative', display: isOffScreen ? 'none' : 'block' }}
    >
      <Animated.View
        style={{
          transform: [{ translateX: boxOffset }],
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
});

export default SwipeComponent;
