import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, FlatList, Modal, Keyboard, TouchableWithoutFeedback, BackHandler, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { style } from "./style";
import moment from 'moment';
import RNBounceable from "@freakycoder/react-native-bounceable";
import { useIsFocused } from '@react-navigation/native';
import { ImageBackground } from "react-native";
let Fair=0
const DashBord = ({ navigation, route }) => {
  const { Id } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [data, setData] = useState([]);
  const [search, setsearch] = useState('');
  const [ActiveOrderT, setActiveOrderT] = useState(false);
  const [ActiveFOrder, setActiveFOrder] = useState(false);
  const [ActivePOrder, setActivePORder] = useState(true);
  const [ActiveCustVisit, setActiveCustVisit] = useState(false)
  const [UserName, setUserName] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [alertMsg, setShowAlertMsg] = useState('');
  const [PendingOrder, setPendingOrder] = useState('0');
  const [FinalOrder, setFinalOrder] = useState('0');
  const [OrderTaken, setOrderTaken] = useState('0');
  const [CustVisit, setCustVisit] = useState('0');
  const [cuDate, setCuDate] = useState(moment(new Date()).format('DD-MMM-YYYY'));
  const [APIdate, setAPIDate] = useState('');
  const [BaseURL, setBaseURL] = useState('');
  const [compCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('Uname').then(function (uname) {
            setBaseURL(BaseURL)
            setCompCode(compCode);
            setFy(Fy)
            const D = moment(new Date()).format('DD/MMM/YYYY');
            setIsloading(true)
            setAPIDate(moment(new Date()).format('DD/MMM/YYYY'))

            ShowCount(BaseURL, compCode, Fy, uname, moment(new Date()).format('DD/MMM/YYYY'));
            if (ActiveCustVisit == false) {
              callAPI(BaseURL, compCode, Fy, uname, moment(new Date()).format('DD/MMM/YYYY'), 3)
            }

            setUserName(uname)
          })
        });
      });
    });
  }, [isFocused]);

  // ----------------------------Call API
  const callAPI = async (BaseURL, compCode, Fy, uname, date, Ordtype) => {
    setMasterDataSource([])
    setData([])
    console.log(BaseURL+'/api/Values/GetUserPartyOrderDashboard?CompCode='+compCode+'&FY='+Fy+'&UserName='+uname+'&Date='+date+'&OType='+Ordtype+ '&FairOrder='+global.FairOrder);
    try {
      const res = await fetch(BaseURL+'/api/Values/GetUserPartyOrderDashboard?CompCode='+compCode+'&FY='+Fy+'&UserName='+uname+'&Date='+date+'&OType='+Ordtype+ '&FairOrder='+global.FairOrder)
      const response = await res.json();
      setIsloading(false)
      if (response.Status == 1) {
        setData(response.Data);
        setMasterDataSource(response.Data)
      }
    } catch (e) {
      setIsloading(false)
      alert('Catch Error: ' + e)
    }
  }
  // -----------------------------show Count API
  const ShowCount = async (BaseURL, compCode, Fy, uname, date) => {
    console.log(BaseURL+'/api/Values/GetUserSalesmanDashboard?CompCode='+compCode+'&FY='+Fy+'&UserName='+uname+'&Date='+date+ '&FairOrder='+global.FairOrder)
    try {
      const res = await fetch(BaseURL + '/api/Values/GetUserSalesmanDashboard?CompCode=' + compCode + '&FY=' + Fy + '&UserName=' + uname + '&Date=' + date+'&FairOrder='+global.FairOrder);
      const response = await res.json();
      setIsloading(false);
      if (response.Status == 1) {
        setPendingOrder(response.Data.POrder);
        setOrderTaken(response.Data.TOrder);
        setFinalOrder(response.Data.FOrder);
        setCustVisit(response.Data.PartyIn);
      }
    } catch (e) {
      setIsloading(false);
      alert('Catch Error: ' + e)
    }
  }
  // ---------------Call Customer in dashboard api
  const callCustInAPI = async (BaseURL, compCode, Fy, APIdate) => {
    setData([]);
    setMasterDataSource([])
    console.log(BaseURL+'/api/Values/GetUserPartyInDashboard?CompCode='+compCode+'&FY='+Fy+'&Date='+APIdate+ '&FairOrder='+global.FairOrder)
    try {
      const res = await fetch(BaseURL + '/api/Values/GetUserPartyInDashboard?CompCode=' + compCode + '&FY=' + Fy + '&Date=' + APIdate+ '&FairOrder='+global.FairOrder);
      const response = await res.json();
      if (response.Status == 1) {
        setData(response.Data);
        setMasterDataSource(response.Data);
      }
    } catch (e) {
      setIsloading(false);
      alert('Catch Error: ' + e)
    }
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setCuDate(moment(date).format('DD-MM-YYYY'));
    ShowCount(BaseURL, compCode, Fy, UserName, moment(date).format('DD/MMM/YYYY'));
    setAPIDate(moment(date).format('DD/MMM/YYYY'))
    callAPI(BaseURL, compCode, Fy, UserName, moment(date).format('DD/MMM/YYYY'), 3)
    hideDatePicker();
  };
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
  const renderitem = (item) => {
    return (
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();

          if (ActiveCustVisit == true) {
            let obj = {
              Transport: item.item.Transport,
              Remarks: item.item.Remarks,
            }
            DefaultPreference.set('Transport', item.item.Transport)
            DefaultPreference.set('Partyname', item.item.AccName)
            DefaultPreference.set('ShippingParty', item.item.SAccName);
            DefaultPreference.set('shippingPCode', item.item.SAccCode.toString());
            DefaultPreference.set('VchCode', '0');
            DefaultPreference.set('PCode', item.item.AccCode.toString())
            DefaultPreference.set('TransRemark', JSON.stringify(obj))
            navigation.navigate('ScanItemScreen', { BCN: undefined, Id: 2, OType: 1, BStation: item.item.BStation })
          } else {
            if (item.item.OStatus == 0) {
              let obj = {
                Transport: item.item.Transport,
                Remarks: item.item.Remarks,
              }
              DefaultPreference.set('Transport', item.item.Transport)
              DefaultPreference.set('Partyname', item.item.BAccName);
              DefaultPreference.set('PCode', item.item.BAccCode.toString())
              DefaultPreference.set('VchCode', item.item.VchCode.toString());
              DefaultPreference.set('ShippingParty', item.item.AccName);
              DefaultPreference.set('TransRemark', JSON.stringify(obj))
              DefaultPreference.set('shippingPCode', item.item.AccCode.toString());
              DefaultPreference.set('Remarks', item.item.Remarks.toString());
              navigation.navigate('ScanItemScreen', { BCN: undefined, Id: 2, OType: 1, BStation: item.item.BStation });
            } else {

            }

          }
        }} >
          <View style={item.item.OStatus == 0 ? { width: '95%', borderWidth: 0.5, borderRadius: 7, backgroundColor: '#A9DFBF' }
            : ActiveCustVisit == true ? { width: '95%', borderWidth: 0.5, borderRadius: 7, backgroundColor: '#fff' } : { width: '95%', borderWidth: 0.5, borderRadius: 7, backgroundColor: '#FAD7A0' }}>
            {ActiveCustVisit == true ? <>
              <View style={{ flexDirection: 'row', marginTop: 5, width: '100%', paddingBottom: 5 }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46' }}>Billing Party</Text>
                <Text style={{ width: '10%', textAlign: 'center' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '50%' }} >{item.item.AccName}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46', }}>Shipping Party</Text>
                <Text style={{ width: '10%', textAlign: 'center' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '50%' }} >{item.item.SAccName}</Text>
              </View>

            </> : <>
              <View style={{ flexDirection: 'row', marginTop: 3, }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46' }}>Billing Party</Text>
                <Text style={{ width: '5%' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '55%' }} >{item.item.BAccName}</Text>
              </View>
              <View style={{ flexDirection: 'row', }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46' }}>Shipping Party</Text>
                <Text style={{ width: '5%' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '55%' }} >{item.item.AccName}</Text>
              </View>
              <View style={{ flexDirection: 'row', }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46' }}>Booking Station</Text>
                <Text style={{ width: '5%' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '45%' }} >{item.item.BStation}</Text>
              </View>
              <View style={{ flexDirection: 'row', }}>
                <Text style={{ fontSize: 16, paddingLeft: 15, width: '40%', color: '#4D4B46' }}>Remarks</Text>
                <Text style={{ width: '5%' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '55%' }} >{item.item.Remarks}</Text>
              </View>
            </>}

            {ActiveCustVisit == false ? <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, paddingLeft: 5, width: '39%', color: '#4D4B46' }}>Qty</Text>
                <Text style={{ width: '5%' }}>:</Text>
                <Text style={{ fontSize: 15, marginTop: 3, width: '55%' }} >{item.item.Qty}</Text>
              </View>
            </View> : null}

          </View>
        </TouchableWithoutFeedback>
      </View>

    )
  }
  return (
    <View style={{ flex: 1, }}>
       {global.FairOrder == 1 ? <View style={{ alignItems: 'center', backgroundColor:'#000',padding:5 }}>
            <View style={{ flexDirection: 'row', }}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2622/2622619.png' }} style={{ height: 20, width: 20 }} />
              <Text style={{ color: '#D89F08', fontWeight: '700', fontSize: 16, margin: 5 }}>Exhibition Order</Text>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2622/2622619.png' }} style={{ height: 20, width: 20 }} />
            </View>
          </View> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', backgroundColor: 'red', width: '33%', borderWidth: 0.5, borderColor: '#fff' }}>
          <Text style={{ color: '#fff', fontSize: 13, margin: 10, fontWeight: '600' }}>User :- {UserName}</Text>
        </View>
        <RNBounceable
          onPress={() => {
            showDatePicker()
          }}
          style={{
            width: '33%', borderWidth: 0.5, backgroundColor: 'red', borderColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 13, color: '#fff', fontWeight: '700' }}>{cuDate}</Text>
        </RNBounceable>
        <RNBounceable onPress={() => {
          navigation.navigate('AddCustomer', { Id: 1 });
        }} style={{
          width: '33%', borderWidth: 0.5, backgroundColor: 'red', borderColor: '#fff',
          alignItems: 'center', justifyContent: 'center',
        }} >

          <Text style={{ fontWeight: '600', color: '#fff', fontSize: 13, }}>New Order</Text>
        </RNBounceable>
      </View>
    
      {/* ------------Headeing View------------------ */}
      <View style={{ flexDirection: 'row', width: '100%', borderWidth: 1 }}>

        <View style={[style.GridSty, { width: '25%', alignItems: 'center', backgroundColor: '#808B96', }]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8163/8163551.png' }} style={{ height: 40, width: 40 }} />
          <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>Total Customers  Visit</Text>
        </View>
        <View style={[style.GridSty, { width: '25%', alignItems: 'center', backgroundColor: '#808B96' }]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9422/9422789.png' }} style={{  height: 40, width: 40 }} />
          <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>Order Taken</Text>
        </View>

        <View style={[style.GridSty, { width: '25%', alignItems: 'center', backgroundColor: '#808B96' }]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/11137/11137678.png' }} style={{  height: 40, width: 40 }} />
          <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>Final Order</Text>
        </View>
        <View style={[style.GridSty, { width: '25%', alignItems: 'center', backgroundColor: '#808B96' }]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4903/4903186.png' }} style={{  height: 40, width: 40 }} />
          <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>Pending Order</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TouchableOpacity style={ActiveCustVisit == true ? [style.GridSty, { width: '25%', borderWidth: 0.5, backgroundColor: '#D5D3CF' }] : [style.GridSty, { width: '25%', borderWidth: 0.5 }]}
          onPress={() => {
            setActiveOrderT(false);
            setActiveFOrder(false);
            setActivePORder(false);
            setActiveCustVisit(true);
            callCustInAPI(BaseURL, compCode, Fy, APIdate)
          }}
        >
          <Text style={{ color: '#000', fontSize: 19, }}>{CustVisit}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          callAPI(BaseURL, compCode, Fy, UserName, APIdate, 1)
          setActiveOrderT(true);
          setActiveFOrder(false);
          setActivePORder(false);
          setActiveCustVisit(false)
        }} style={ActiveOrderT == true ? [style.GridSty, { width: '25%', borderWidth: 0.5, backgroundColor: '#D5D3CF' }] : [style.GridSty, { width: '25%', borderWidth: 0.5 }]}>
          <Text style={{ color: '#000', fontSize: 19, }}>{OrderTaken}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          callAPI(BaseURL, compCode, Fy, UserName, APIdate, 2)
          setActiveFOrder(true);
          setActiveOrderT(false);
          setActivePORder(false); setActiveCustVisit(false)
        }} style={ActiveFOrder == true ? [style.GridSty, { width: '25%', borderWidth: 0.5, backgroundColor: '#D5D3CF' }] : [style.GridSty, { width: '25%', borderWidth: 0.5 }]}>
          <Text style={{ color: '#000', fontSize: 19, }}>{FinalOrder}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          callAPI(BaseURL, compCode, Fy, UserName, APIdate, 3)
          setActiveFOrder(false); setActiveOrderT(false)
          setActivePORder(true); setActiveCustVisit(false)
        }} style={ActivePOrder == true ? [style.GridSty, { width: '25%', borderWidth: 0.5, backgroundColor: '#D5D3CF' }] : [style.GridSty, { width: '25%', borderWidth: 0.5 }]}>
          <Text style={{ color: '#000', fontSize: 19, }}>{PendingOrder}</Text>
        </TouchableOpacity>
      </View>
      {/* ----------------Add Customer----------------- */}
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center' }}>
        
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        
        </View>
      </View>
 
      {/* ----------------Search bar------------------- */}
    
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '95%', height: 45, borderWidth: 1, marginTop: 5, borderRadius: 7, flexDirection: 'row', padding: 4 }}>
          <TextInput style={{ width: '90%', fontSize: 14, padding: 5 }} placeholder='Search Customer...' onChangeText={(text) => { searchFilterFunction(text) }} value={search}
            onClear={text => searchFilterFunction('')}
          />
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/751/751463.png' }} style={{ height: 30, width: 30, marginTop: 7 }} />
        </View>
      </View>
      {/* <ImageBackground source={{uri:'https://cdn-icons-png.flaticon.com/128/2622/2622619.png'}} style={{height:100,width:100}}> */}
      <FlatList style={{ marginBottom: 10 }}
        keyboardShouldPersistTaps={'handled'}
        data={data} renderItem={renderitem}
        keyExtractor={(item, Index) => Index.toString()}
      />
      {/* </ImageBackground> */}
     
      <Modal visible={showModal} transparent={true} animationType='slide'  >
        <View style={style.content}>
          <View style={{ height: '20%', width: '80%', borderWidth: 1, backgroundcolor: '#000', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
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
          <ActivityIndicator size={30} />
          <Text>Please Wait...</Text>
        </View>
      </Modal>
    </View>
  )
}
export default DashBord;
