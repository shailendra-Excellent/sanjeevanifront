import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const MultiSelectComponent = ({Data,Value,setValue}) => {
  const [selected, setSelected] = useState([]);

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={Data}
        labelField="Name"
        valueField="Code"
        placeholder="Select Multiple Design"
        searchPlaceholder="Search..."
        value={selected}
        onChange={item => {
          
          setSelected(item);
          setValue(item)
        }}
        renderLeftIcon={() => (<></>
            // <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/4922/4922949.png'}} style={{height:20,width:20}}/>
        //   <AntDesign
        //     style={styles.icon}
        //     color="black"
        //     name="Safety"
        //     size={20}
        //   />
        )}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: { paddingRight: 10,paddingLeft:10,paddingBottom:3 },
  dropdown: {
    height: 40,
    backgroundColor: '#fff',
    borderBottomColor: 'gray',
    borderWidth: 0.5,
    borderRadius:6,
    width:'100%',
    padding:5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
