import React from "react";
import { View } from "react-native";
import { TouchableOpacity,Text } from "react-native";
import { Checkbox } from "react-native-paper";

const RedioBtn=({BtType,CheckType})=>{

    return(
<View style={{flexDirection:'row'}}>
<Checkbox
      color='red'
      uncheckedColor='#000'
      status={CheckType ? 'checked' : 'unchecked'}
/>
    <Text style={{margin:5,fontSize:18,color:'#000'}}>{BtType}</Text>
</View>
    )
}
export default RedioBtn