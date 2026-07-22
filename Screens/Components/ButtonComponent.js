import React from "react";
import { View,Text} from "react-native";
const ButtonComponent=({type,style})=>{
    return(
 <View style={style}>
    <Text style={{color:'#fff',fontSize:19,padding:5,fontWeight:'600'}}>{type}</Text>
 </View>
    )
}
export default ButtonComponent