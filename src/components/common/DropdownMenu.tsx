import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { typography } from '../../constants/typography';

interface DropdownItem {
  icon: any;
  label: string;
  onPress: () => void;
  isSelected?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isVisible: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.dropdownContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dropdownItem,
            item.isSelected && styles.selectedItem
          ]}
          onPress={() => {
            item.onPress();
            onClose();
          }}
          activeOpacity={0.7}
        >
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.itemText}>{item.label}</Text>
          {item.isSelected && (
            <Image
              source={require('../../assets/icons/icon-asl.png')}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedItem: {
    backgroundColor: '#f8fafc',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  itemText: {
    ...typography.bodyMedium,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    width: 16,
    height: 16,
    tintColor: '#2563eb',
    marginLeft: 8,
  },
});

export default DropdownMenu;