import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import RNBounceable from '@freakycoder/react-native-bounceable'
import { Image } from 'react-native'
let num=5
const SizeComp = ({data,setdata,exData,selectAllSize}) => {
    const [SelectAll,setSelectAll]= useState(false)
  return (
    <View style={{alignItems:'center'}}>
    <View style={{width:'90%'}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontWeight:'700',fontSize:16,color:'#000'}}> Select Size</Text>
        <RNBounceable style={{flexDirection:'row',alignItems:'center'}}
        onPress={()=>{
            setSelectAll(true);
            selectAllSize()
        }}
        >
            <View style={{height:20,width:20,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                {SelectAll ==true?  <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/5290/5290058.png'}} style={{height:20,width:20}} />:null}
               
            </View>
        <Text style={{fontWeight:'700',fontSize:16,color:'#000'}}> Select All</Text>
        </RNBounceable>
        

        </View>
    <FlatList extraData={exData} data={data} keyExtractor={({item,index})=>{
        return index
    }} 
    numColumns={num}
    renderItem={({item,index})=>{
       
        return(
            // <View style={{justifyContent:'space-between'}}>
                 <RNBounceable style={[styles.ListViewSty,item.Status==false?{backgroundColor:'#fff'}:{backgroundColor:'#000'}]} 
                 onPress={()=>{
                    setdata(index)
                 }}
                 >
                    <Text style={item.Status==false?{color:'#000',}:{color:'#fff',}}>{item.Name}</Text>
                 </RNBounceable>
            // </View>
           
        )
    }}
    />
    </View>
   
    </View>
  )
}

export default SizeComp

const styles = StyleSheet.create({
    ListViewSty:{
        height:55,width:'17%',
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#000',
        borderWidth:1,
        margin:3
    }
})