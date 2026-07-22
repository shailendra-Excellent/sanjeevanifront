import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNBounceable from '@freakycoder/react-native-bounceable';
import moment from 'moment';

const FromToDateFilter = ({value,setvalue}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      setvalue(moment(date).format('DD-MMM-YYYY'))
      hideDatePicker();
    };
  return (
    <View style={{width:'50%'}}>
         <RNBounceable style={styles.mainViewSty} 
         onPress={()=>{
            showDatePicker()
         }}
         >
        <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/2886/2886665.png'}} style={{height:20,width:20,tintColor:'#c9c8ca',marginRight:5}} />
      <Text style={styles.textSty}>{value}</Text>
    
    </RNBounceable>
    <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
   
  )
}

export default FromToDateFilter

const styles = StyleSheet.create({
    mainViewSty:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        height:40
    },
    textSty:{
       fontSize:15,
       fontWeight:'700',
        color:'#000'
    }
})