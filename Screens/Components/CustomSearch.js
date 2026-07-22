import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image,Dimensions, Keyboard, Text, TextInput, TouchableOpacity, View, useWindowDimensions} from "react-native";

 const CustomSearch=({data,placeholder,setvalue,setcrosValue,setitemDetails})=>{
    const [Search,setSearch]= useState('');
    const [MasterData,setMAsterdAta]= useState([]);
    const [Filterdata,setFilterData]= useState([]);
    const [Speenar,setSpeenar]= useState(false);
    const [SearchIcon,setSearchIcon]= useState('');
    const [dataAlertMsg,setdataAlertMsg]= useState('')
    const windowWidth = Dimensions.get('window').width;
    
    const {height,width}=useWindowDimensions()
    useEffect(()=>{
        // callAPI() 
    },[0])  
    // const callAPI=async()=>{
    //     console.log('http://103.117.156.78:1174/api/Values/GetAccountList?CompCode=comp0027&FY=2022');
    //     const reponse= await fetch('http://103.117.156.78:1174/api/Values/GetAccountList?CompCode=comp0027&FY=2022');
    //     const res= await reponse.json();
    //     setMAsterdAta(res.Data);
    //     setFilterData(res.Data)
    // }
    const searchFilter = useMemo((text) => {
      setSpeenar(true)
        // Check if searched text is not blank
        if (Search) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = data.filter(
            function (item) {
              // Applying filter for the inserted text in search bar
              const itemData = item.Name
                  ? item.Name.toUpperCase()
                  : ''.toUpperCase();
              const textData = Search.toUpperCase();
              return itemData.indexOf(textData) > -1;
            }
          );
          setSpeenar(false);
          setFilterData(newData);
        } else {
          setSpeenar(false)
          setdataAlertMsg('Data Not Found')
          setFilterData([]);
          setitemDetails()
          // setSearch(text);
        }
      },[Search]);
    return(
        <View style={{alignItems:'center'}} >
            <View style={{backgroundColor:'#fff',flexDirection:'row',width:'100%',borderWidth:1,marginTop:10,borderRadius:5,alignItems:'center'}}>
                {Speenar ==true ? <ActivityIndicator color={'#000'} />:
                                <Image source={{uri:'https://cdn-icons-png.flaticon.com/512/667/667434.png'}} style={{tintColor:'#000',height:20,width:20,marginLeft:4}} />
}
            <TextInput style={{width:'80%'}} value={Search}
            placeholder={placeholder} onChangeText={(text)=>{
              setSearch(text);
              // searchFilter(text)
            }} /> 
            <TouchableOpacity style={{margin:5}} onPress={()=>{
              setcrosValue()
              setSearch(''),setFilterData([]),setitemDetails()
            }}>
          <Image source={{uri:'https://cdn-icons-png.flaticon.com/512/2961/2961937.png'}} style={{tintColor:'#000',height:20,width:20,}} />
            </TouchableOpacity>

                       </View>
                     
                       {Filterdata.length >0 ?
//                         {Filterdata.map((item)=>{
//  return( 
//   <TouchableOpacity style={{width:windowWidth,alignItems:'flex-start',}} onPress={()=>{
//     Keyboard.dismiss()
//      setSearch(item.Name);
//      setvalue(item)
//     //  -------------------List hide when item is select
//     setFilterData([])
//   }} >
//     <Text style={{marginTop:20,fontSize:17,width:'100%',paddingLeft:10,borderBottomWidth:1}}>{item.Name}</Text>
//      </TouchableOpacity>
// )
//                         })}
                       <FlatList style={{height:height/2.6,marginBottom:5}} removeClippedSubviews={false}
                           keyboardShouldPersistTaps={'handled'}
                       data={Filterdata} renderItem={({item})=>{
              return( 
                <TouchableOpacity style={{width:windowWidth,alignItems:'flex-start',}} onPress={()=>{
                  Keyboard.dismiss()
                   setSearch(item.Name);
                   setvalue(item)
                  //  -------------------List hide when item is select
                  setFilterData([])
                }} >
                  <Text style={{marginTop:20,fontSize:17,width:'100%',paddingLeft:10,borderBottomWidth:1}}>{item.Name}</Text>
                   </TouchableOpacity>
              )
            }} />
                          :null }
                     

        </View>
    )
}

export default CustomSearch