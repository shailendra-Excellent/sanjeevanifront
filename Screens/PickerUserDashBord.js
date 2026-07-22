import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, } from "react-native";
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
import SearchBar from "react-native-dynamic-search-bar";
import { UIActivityIndicator } from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native";
import {Modal} from 'react-native-paper';
const PickerUserDashBord = ({ navigation, route }) => {
  const { Id, UserInfo } = route.params;
  const [UserName, setUserName] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [alertMsg, setShowAlertMsg] = useState('');
  const [data, setData] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [search, setsearch] = useState('');
  const [BaseURL, setBaseURL] = useState('');
  const [CompCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const isFocused = useIsFocused();
  // ---------------------useEffect 
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseUrl) {
      setBaseURL(BaseUrl)
      DefaultPreference.get('CompCode').then(function (compCode) {
        setCompCode(compCode)
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('Uname').then(function (uname) {
            setUserName(uname)
            DefaultPreference.get('Rtype').then(function (Rtype) {
              setFy(Fy);
              if (Id == 1) {
                CallAPI(BaseUrl, compCode, Fy, uname)
              }
            });
          });
        });
      });
    });

  }, [isFocused]);

  // ----------------------Call API
  const CallAPI = async (BaseUrl, compCode, Fy, uname) => {
    setData([])
    setisLoading(true)
    console.log(BaseUrl + '/api/Values/GetPendingOrderforPicking?CompCode=' + compCode + '&FY=' + Fy + '&Picker=' + uname);
    try {
      const res = await fetch(BaseUrl + '/api/Values/GetPendingOrderforPicking?CompCode=' + compCode + '&FY=' + Fy + '&Picker=' + uname)
      const Response = await res.json();
      // console.log(Response)
      setisLoading(false);
      if (Response.Status == 1) {
        if (Response.Data.length > 0) {
          setData(Response.Data);
          setMasterDataSource(Response.Data);
        } else {
          alert('Data Not Found')
        }
      }
    } catch (e) {
      setisLoading(false);
      Alert.alert('Catch Error' + e.message)
    }
  }
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
      style={[styles.listViewSty,item.OLevel==1?{backgroundColor:'#ce2507'}:item.OrderType==1?{backgroundColor:'#cfe9d3'}:null]}
      // style={listViewSty item.OLevel == 1 ? { flexDirection: 'row', borderBottomWidth: 0.5, backgroundColor: '#F5B7B1' } : { flexDirection: 'row', borderBottomWidth: 0.5, backgroundColor: '#fff' }}
        // style={{flexDirection:'row',borderBottomWidth:0.5,}}
        onPress={() => {
          DefaultPreference.set('OrderId', item.OrderNo);
          DefaultPreference.set('PartyName', item.AccName);
          DefaultPreference.set('TOrder', item.TotalQty.toString());
          DefaultPreference.set('OrdDate', item.OrderDate);
          DefaultPreference.set('VchCode', item.VchCode.toString())
          navigation.navigate('ItemDPickerUser', { Id: 1, ItemInfo: 0, PartyInfo: item })
        }}
      >
        <View style={{width: '10%', borderRightWidth: 1, borderColor: '#000',justifyContent:'center'}}>
        <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{index + 1 + '.'}</Text>
        </View>
       
        <View style={{ width: '40%', borderRightWidth: 1, borderColor: '#000',alignItems:'flex-start' ,padding:5,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{width:'80%'}}>
          <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.OrderNo} </Text>
          <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.OrderDate} </Text>
          {item.DeliveryDate !==''? <Text style={[styles.ValueTextSty, {color:'blue'}]} >{item.DeliveryDate}</Text>:null}
          <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.Remarks} </Text>
          </View>
          {item.IRemarks !==''?<View style={{height:20,width:20,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
            <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/5291/5291032.png'}} style={{height:20,width:20,tintColor:'#1b8c02'}} />
          </View>
:null}
        </View>
        <View style={{ width: '35%', borderRightWidth: 1,alignItems:'flex-start',padding:5}}>
          <Text style={[styles.ValueTextSty, item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.AccName}</Text>
          <Text style={[styles.ValueTextSty, { borderColor: '#000', color: '#21a703', }]} >{item.SAccName}</Text>
        </View>
        <View style={ { width: '15%',alignItems:'center',justifyContent:'center'}}>
        <Text style={[styles.ValueTextSty, item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.TotalQty}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // ---------------------------Search Function call
  const searchFilterFunction = (text) => {
    if (text) {

      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.AccName
            ? item.AccName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      setData(newData);
      setsearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(masterDataSource);
      setsearch(text);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 5, backgroundColor: '#000' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }} >
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '700', fontSize: 16 }}>User:</Text>
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '700', fontSize: 16 }}>{UserName}</Text>
          </View>
          {/* <TouchableOpacity onPress={()=>{
                    setshowModal(true);
                    setShowAlertMsg('Are You Sure To Log-Out ?');
                  }} >
                  <Image source={require('./Images/logout.png')} style={{height:25,width:25,margin:10,tintColor:'#fff'}} />
                  </TouchableOpacity> */}
        </View>

        <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '300', fontSize: 17 }}>Total Order: </Text>
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '300', fontSize: 17 }}>{data.length}</Text>
        </View>
      </View>
      <View style={{ padding: 10, backgroundColor: '#D4D5D4' }}>
        <SearchBar
          backgroundColor="#fff"
          placeholder="Search here.."
          textInputStyle={{ height: 40, margin: 10 }}
          onChangeText={(text) => { searchFilterFunction(text) }}
          onSearchPress={(text) => { searchFilterFunction(text) }}
          value={search}
        />
      </View>
      <View style={{ width: '100%' }}>
        <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
         <View style={{ width: '10%', borderRightWidth: 1, borderColor: '#fff',}}>
         <Text style={[style.headerText, { fontWeight: '500', padding: 5 }]} >SrNo.</Text>
         </View>
         <View style={{ width: '40%', borderRightWidth: 1, borderColor: '#fff', }}>
         <Text style={[style.headerText, {fontWeight: '500', padding: 5 }]} >Order No. / Order Date / Delivery Date /Remarks </Text>
         </View>
          <View style={{ width: '35%', borderRightWidth: 1, borderColor: '#fff', padding: 5 }}>
            <Text style={[style.headerText, { fontWeight: '500' }]} >Party Name</Text>
            <Text style={[style.headerText, { color: '#fff', fontWeight: '500' }]} >Customer Name</Text>
          </View>
          <Text style={[style.headerText, { width: '15%', borderRightWidth: 1, borderColor: '#fff', padding: 5, fontWeight: '500', }]} >Qty</Text>
        </LinearGradient>
        {/* <View style={{  }}> */}
          <FlatList data={data} style={{height:'68%'}} renderItem={renderItem}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item, Index) => Index.toString()} />
        {/* </View> */}

      </View>
      <View style={{alignItems:'flex-end',height:'12%',}}>
      <View style={styles.FooterViewSty}>

        <View style={[styles.FooterContentView,{}]}>
          <Text style={styles.FooterTextSty}>Exhibition Order</Text>
          <Text style={[styles.ColorTextSty,{backgroundColor:'#3b9c04'}]}></Text>
        </View>
        <View style={[styles.FooterContentView,{}]}>
          <Text style={styles.FooterTextSty}>Urgent Order</Text>
          <Text style={[styles.ColorTextSty,{backgroundColor:'#ce2507'}]}></Text>
        </View>
      </View>
      </View>
      <Modal visible={showModal} transparent={true} animationType='slide'  >
        <View style={style.content}>
          <View style={{ width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ margin: 5, fontSize: 20, fontWeight: '600', color: '#000' }}>Alert</Text>
            </View>
            <View style={{ margin: 5 }}>
              <Text style={{ color: '#000' }}>{alertMsg}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
              <TouchableOpacity style={style.alertMsgBtnSty}
                onPress={() => {
                  setshowModal(false);
                  setShowAlertMsg('')
                }}>
                <Text style={{ color: '#fff' }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.alertMsgBtnSty}
                onPress={() => {
                  if (alertMsg == 'Do you want to exit this app') {
                    BackHandler.exitApp();
                  } else {
                    DefaultPreference.clear('Uname');
                    navigation.replace('Login');
                  }
                }} >
                <Text style={{ color: '#fff' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isLoading} >
        <View style={style.content} >
          <ActivityIndicator size={35} />
          <Text>Please Wait...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
export default PickerUserDashBord;
const styles=StyleSheet.create({
  FooterViewSty:{
    flexDirection:'row',
    justifyContent:'space-between',
    borderWidth:1,
  },
  FooterContentView:{
    borderRightWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:'50%',
  height:35,
  flexDirection:'row'
  },
  ColorTextSty:{
    height:12,
    width:20,
  },
  listViewSty:{
   flexDirection:'row',
   borderBottomWidth:1 
  },
  ValueTextSty:{
    fontSize:12,
    fontWeight:'600'
  },
  FooterTextSty:{
    color:'#000',
    fontWeight:'600',
    fontSize:14,
    marginRight:5
  }

});