import React, { memo, useCallback, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text,FlatList,Keyboard,useWindowDimensions} from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { filterByText, useDebouncedCallback } from "./useDebounce";

const SearchRow = memo(({ item, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(item)}
    style={{borderBottomWidth:1,justifyContent:'center',marginTop:5}}>
    <Text style={{fontSize:18,padding:5}}>{item.Name}</Text>
  </TouchableOpacity>
));

 const SerchComponent=({PlacHolder,data,masterDataSource,value,setname,setIcode})=>{
    const [ItemData,setItemData]= useState([]);
    const [name,setItemName]= useState('');
    const {height,width}=useWindowDimensions()

    const searchFilterFunction = useDebouncedCallback(text => {
      // null = cleared via the cross button, so hide the list
      setItemData(text === null ? [] : filterByText(masterDataSource, text, item => item.Name));
    });

    // Parents pass inline callbacks, so keep the latest ones in a ref to keep rows memoized
    const latest = useRef({});
    latest.current = { setname, setIcode };

    const onSelect = useCallback(item => {
      Keyboard.dismiss();
      latest.current.setname(item.Name);
      setItemName(item.Name);
      latest.current.setIcode(item.Code)
      searchFilterFunction(null)
      setItemData([])
    }, [searchFilterFunction]);

    const renderItem = useCallback(({item}) => <SearchRow item={item} onSelect={onSelect} />, [onSelect]);

    return(
        <View>
          <View style={{marginTop:10,width:'100%',backgroundColor:'#ADB0B0',height:60,justifyContent:'center'}}>
      <SearchBar
       style={{width:'90%',backgroundColor: '#fff',borderWidth:1,borderRadius:5}}
            placeholder={PlacHolder}
            value={name}
            onChangeText={text => { setItemName(text),searchFilterFunction(text)}}
            onClearPress={()=>{
             setItemName('');
             searchFilterFunction(null);
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
      data={ItemData}
      keyExtractor={(item, index) => `${item.Code}-${index}`}
      renderItem={renderItem}
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      windowSize={7} />:<></>}

        </View>
    )
}
export default SerchComponent;
