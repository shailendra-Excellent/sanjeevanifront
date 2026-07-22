import React from "react";
import { View,Image,Text} from "react-native";

const GridComponent=({req,GridType,blurRadious})=>{
    // console.log(req)
    return(
       <View style={{alignItems:'center',justifyContent:'center'}}>
        {req !==null?<Image blurRadius={blurRadious} source={req} style={{height:50,width:50,marginTop:20,}} />
:null}
       <Text style={blurRadious==4?{marginTop:10,color:'gray',fontSize:12,fontWeight:'600'}:{marginTop:10,color:'#000',fontSize:12,fontWeight:'600'}}>{GridType}</Text>
       </View>
    )
}
export default GridComponent