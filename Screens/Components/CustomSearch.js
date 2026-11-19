import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { filterByText, wildFilterByText } from "./useDebounce";

const SearchRow = memo(({ item, width, onSelect }) => (
  <TouchableOpacity style={{ width, alignItems: 'flex-start' }} onPress={() => onSelect(item)}>
    <Text style={{ marginTop: 20, fontSize: 17, width: '100%', paddingLeft: 10, borderBottomWidth: 1 }}>{item.Name}</Text>
  </TouchableOpacity>
));

// wildSearch: match every typed word in any order (see wildFilterByText) instead of the exact text
const CustomSearch = ({ data, placeholder, setvalue, setcrosValue, setitemDetails, wildSearch }) => {
  const [Search, setSearch] = useState('');
  const [Filterdata, setFilterData] = useState([]);
  const [Speenar, setSpeenar] = useState(false);
  const { height, width } = useWindowDimensions();
  // Skip filtering when the text was set by selecting an item from the list
  const skipFilter = useRef(true);

  useEffect(() => {
    if (skipFilter.current) {
      skipFilter.current = false;
      return;
    }
    if (!Search) {
      setSpeenar(false);
      setFilterData([]);
      setitemDetails && setitemDetails();
      return;
    }
    setSpeenar(true);
    const timer = setTimeout(() => {
      setFilterData((wildSearch ? wildFilterByText : filterByText)(data, Search, (item) => item.Name));
      setSpeenar(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [Search]);

  // Parents pass inline callbacks, so keep the latest ones in refs to keep rows memoized
  const latest = useRef({});
  latest.current = { setvalue, Search };

  const onSelect = useCallback((item) => {
    Keyboard.dismiss();
    if (item.Name !== latest.current.Search) skipFilter.current = true;
    setSearch(item.Name);
    latest.current.setvalue(item);
    //  -------------------List hide when item is select
    setFilterData([]);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <SearchRow item={item} width={width} onSelect={onSelect} />
  ), [width, onSelect]);

  return (
    <View style={{ alignItems: 'center' }} >
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', width: '100%', borderWidth: 1, marginTop: 10, borderRadius: 5, alignItems: 'center' }}>
        {Speenar == true ? <ActivityIndicator color={'#000'} /> :
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/667/667434.png' }} style={{ tintColor: '#000', height: 20, width: 20, marginLeft: 4 }} />
        }
        <TextInput style={{ width: '80%' }} value={Search}
          placeholder={placeholder} onChangeText={setSearch} />
        <TouchableOpacity style={{ margin: 5 }} onPress={() => {
          setcrosValue && setcrosValue();
          setSearch('');
          setFilterData([]);
          setSpeenar(false);
          setitemDetails && setitemDetails();
        }}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }} style={{ tintColor: '#000', height: 20, width: 20, }} />
        </TouchableOpacity>
      </View>

      {Filterdata.length > 0 ?
        <FlatList style={{ height: height / 2.6, marginBottom: 5 }}
          keyboardShouldPersistTaps={'handled'}
          data={Filterdata}
          keyExtractor={(item, index) => `${item.Code}-${index}`}
          renderItem={renderItem}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={7}
        />
        : null}
    </View>
  )
}

export default CustomSearch
