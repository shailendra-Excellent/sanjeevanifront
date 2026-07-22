import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import RNBounceable from '@freakycoder/react-native-bounceable';

const ItemSearchComp = ({ data,Value,setValue,FilterData,setIVal}) => {
  const [ItemVal,setItemVal]= useState('');
  const [Data,setData]= useState([])
  const FilterFun=useMemo(()=>{
    console.log(FilterData)
    const newData = FilterData.filter(
      function (item) {
        console.log('====================================');
        console.log(item);
        console.log('====================================');
        const itemData = item.Name.toUpperCase()
          ? item.Name.toUpperCase()
          : "".toUpperCase();
        const textData = ItemVal.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log('New Data');
    if(ItemVal !==''){
      setValue(newData)
    }else{
      setValue([])
    }
   
      
  },[ItemVal])
  return (
    <View style={{alignItems:'center'}} >
      <View style={styles.SearchViewSty}>
        <TextInput style={styles.InputSty} placeholder='Search Item' value={Value}
         onChangeText={(text)=>{setItemVal(text)
          setIVal(text)
         }}
         
         />
         <RNBounceable onPress={()=>{
                  setIVal('')
            setValue([])
         }}>
            <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/2961/2961937.png'}} 
        style={{height:20,width:20}} />
         </RNBounceable>
      
      </View>
    
     
    </View>
  )
}

export default ItemSearchComp;
const styles = StyleSheet.create({
  SearchViewSty: {
    flexDirection: 'row',
    borderBottomWidth:1,
    width:'90%',
    borderColor:'gray',
    alignItems:'center'
  },
  InputSty:{
    width:'95%',
  }
});