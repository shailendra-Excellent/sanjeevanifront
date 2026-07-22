import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text,FlatList,Keyboard,useWindowDimensions} from "react-native";
import SearchBar from "react-native-dynamic-search-bar";

 const SerchComponent=({PlacHolder,data,masterDataSource,value,setname,setIcode})=>{
    const [ItemData,setItemData]= useState([]);
    const [name,setItemName]= useState('');
    const {height,width}=useWindowDimensions()

    searchFilterFunction = text => {
        
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.Name.toUpperCase()
            ? item.Name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setItemData(newData);

      };
    return(
        <View>
          <View style={{marginTop:10,width:'100%',backgroundColor:'#ADB0B0',height:60,justifyContent:'center'}}>
      <SearchBar
       style={{width:'90%',backgroundColor: '#fff',borderWidth:1,borderRadius:5}}   
            placeholder={PlacHolder}
            value={name}
            onChangeText={text => { setItemName(text),searchFilterFunction(text)}} 
            onClearPress={()=>{
             setname('');
             setItemData([])
             Keyboard.dismiss();
             setIcode(0);
                      }}
                      keyboardShouldPersistTaps='handled'
            onClear={text => {
              setname(''),setItemData([])
            }}
            
            />
   
      </View>
      {ItemData.length >0 ?  <FlatList style={{height:height/3,marginBottom:10,}}  keyboardShouldPersistTaps={'handled'} 
      data={ItemData} renderItem={({item})=>{
        return(
            <TouchableOpacity
            onPress={()=>{
              Keyboard.dismiss();
              setname(item.Name);
              setItemName(item.Name);
              setIcode(item.Code)
              setItemData([]) 
            }}
            style={{borderBottomWidth:1,justifyContent:'center',marginTop:5}}>
                <Text  style={{fontSize:18,padding:5}}>{item.Name}</Text>
            </TouchableOpacity>
        )
    }} />:<></>}
     
        </View>
    )
}
export default SerchComponent;