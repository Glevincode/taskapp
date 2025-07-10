import React, { useRef, useState } from 'react';
import { Text, Modal, View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from './ThemeContext';



type TaskOptionsMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void; // Add this
};

const TaskItemScreen: React.FC<TaskOptionsMenuProps> = ({ onEdit, onDelete, onRefresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });

  const iconRef = useRef<View>(null);

  const openMenu = () => {
    iconRef.current?.measure((fx, fy, width, height, px, py) => {
      setAnchorPosition({ x: px, y: py + height }); // +height to position below icon
      setModalVisible(true);
    });
  };
  const { darkMode } = useTheme();
  const bgColor = darkMode ? '#0f172a' : '#fff';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';




  

  return (
   <>
      <Pressable ref={iconRef} onPress={openMenu} style={styles.menuWrapper}>
        <Feather name="more-vertical" size={30} color="#8b5cf6" />
      </Pressable>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalBox,
                {
                    backgroundColor: cardColor,
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    borderWidth: 1,
                },
              {
                top: anchorPosition.y,
                left: anchorPosition.x - 120,
              },
            ]}
          >
            <View style={styles.arrow} />


                   <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setModalVisible(false);
                  onRefresh && onRefresh();
                }}
              >
                <Feather name="refresh-cw" size={18} color={textColor} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ color: textColor }}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalBox: {
    position: 'absolute',
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    
    
  },
    menuWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
  arrow: {
  position: 'absolute',
  top: -8,
  left: 110,
  width: 0,
  height: 0,
  borderLeftWidth: 8,
  borderRightWidth: 8,
  borderBottomWidth: 8,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: '#fff', // Same color as your modal box
},

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,



  },
});

export default TaskItemScreen;
