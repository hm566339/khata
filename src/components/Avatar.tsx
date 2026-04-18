import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '@constants';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  style?: ViewStyle;
  initials?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  imageUrl,
  size = 'medium',
  backgroundColor = COLORS.primary,
  style,
  initials,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return SIZES.avatarSizeSmall;
      case 'large':
        return SIZES.avatarSizeLarge;
      default:
        return SIZES.avatarSizeMedium;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return SIZES.fontSizeSm;
      case 'large':
        return SIZES.fontSizeXl;
      default:
        return SIZES.fontSizeMd;
    }
  };

  const avatarSize = getSize();
  const getInitials = () => {
    if (initials) return initials;
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: getFontSize(),
          },
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontWeight: '700',
  },
});
