import React from "react";
import { View,Text, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
const ItemDetails=({navigation})=>{
  const [userId,setuserId]= React.useState(1)
  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       console.log('12345');
  //       Alert.alert(
  //         "Alert Title",
  //         "do You want to exit this page",
  //         [
  //           {
  //             text: "Cancel",
  //             onPress: () => console.log("Cancel Pressed"),
  //             style: "cancel"
  //           },
  //           { text: "OK", onPress: () => console.log("OK Pressed") }
  //         ]
  //       );
  //       // Do something that should run on blur
  //     }
  //   }, [])
  // );
    return(
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={()=>{
          navigation.goBack()
        }}>
        <Text>hello</Text>
        </TouchableOpacity>
      </View>
    )
}
export default ItemDetails