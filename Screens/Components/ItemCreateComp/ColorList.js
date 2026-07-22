import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'

const ColorList = ({Itn,Ind}) => {
    // console.log(Itm)
  return (
    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1}}>
        <View style={{width:'25%',borderRightWidth:1,padding:6,alignItems:'center'}}>
        <Text style={{fontWeight:'600',fontSize:14}}>{Itn.Color}</Text>
        </View>
     <FlatList horizontal={true} data={Itn.SizeData} keyExtractor={({ item,index})=>{return index}}  
        renderItem={({item,index})=>{

            return(
                <View style={{flexDirection:'row',alignItems:'center',marginLeft:3}}>
                    <Text style={{fontSize:14,fontWeight:'600',color:'red',marginRight:5}}>{item.Size}</Text>
                    <Text style={{fontSize:14,fontWeight:'600',color:'red'}}>,</Text>
                </View>
            )
        }}
        />
    </View>
  )
}

export default ColorList

const styles = StyleSheet.create({})