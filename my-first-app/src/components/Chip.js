import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { s } from '../styles';

// ปุ่มตัวเลือก (เลือกอุปกรณ์ / ประเภทปัญหา / ความรุนแรง)
export default function Chip({
  label,
  selected,
  onPress,
  style,
  selectedStyle,
  selectedTextStyle,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.chip, style, selected && (selectedStyle || s.chipSelected)]}
    >
      <Text
        style={[s.chipTxt, selected && (selectedTextStyle || s.chipTxtSelected)]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
