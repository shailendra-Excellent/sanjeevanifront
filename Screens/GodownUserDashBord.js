import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Modal, FlatList, BackHandler, SafeAreaView, StyleSheet } from "react-native";
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
import SearchBar from "react-native-dynamic-search-bar";
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";
const GodownUserDashBord = ({ navigation, route }) => {
  const { Id } = route.params;
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
  const [McName, setMcName] = useState('');
  const isFocused = useIsFocused();
  const [GoDownReport, setGodownReport] = useState(false);
  const [GodownReportData, setGodownReportData] = useState([]);
  const { height, width } = useWindowDimensions()

  // ---------------------useEffect 
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseUrl) {
      setBaseURL(BaseUrl)
      DefaultPreference.get('CompCode').then(function (compCode) {
        setCompCode(compCode)
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('Uname').then(function (uname) {
            setUserName(uname)
          });
          DefaultPreference.get('Rtype').then(function (Rtype) {
            DefaultPreference.get('McCode').then(function (McCdoe) {
              DefaultPreference.get('McName').then(function (McName) {
                setMcName(McName)
                setFy(Fy);
                if (Id == 1) {
                  CallAPI(BaseUrl, compCode, Fy, McCdoe);
                  CallReportAPI(BaseUrl, compCode, Fy, McCdoe)
                }
              });
            });
          });
        });
      });
    });
    // console.log(' is focuseeeeeee', isFocused)
  }, [isFocused == true]);

  // ----------------------Call API
  const CallAPI = async (BaseUrl, compCode, Fy, McCdoe) => {

    console.log(BaseUrl + '/api/Values/GetPendingOrderforTransfer?CompCode=' + compCode + '&FY=' + Fy + '&IgrpCode=' + McCdoe);
    setisLoading(true)
    try {
      const res = await fetch(BaseUrl + '/api/Values/GetPendingOrderforTransfer?CompCode=' + compCode + '&FY=' + Fy + '&IgrpCode=' + McCdoe)
      const Response = await res.json();
      setisLoading(false);
      if (Response.Status == 1) {
        if (Response.Data.length > 0) {
          setData(Response.Data);
          setMasterDataSource(Response.Data);
        } else {
        }

      }
    } catch (e) {
      alert('Catch Error' + e)
    }
  }
  // ----------------------Call Report API
  const CallReportAPI = async (BaseUrl, compCode, Fy, McCdoe) => {
    try {
      // console.log(BaseUrl+'/api/Values/GetTransferDoneList?CompCode='+compCode+'&FY='+Fy+'&IgrpCode='+McCdoe)
      const res = await fetch(BaseUrl + '/api/Values/GetTransferDoneList?CompCode=' + compCode + '&FY=' + Fy + '&IgrpCode=' + McCdoe)
      const Response = await res.json();
      setisLoading(false);

      if (Response.Status == 1) {
        if (Response.Data.length > 0) {
          setGodownReportData(Response.Data)
        } else {
          // alert('Data Not Found')
        }

      }
    } catch (e) {
      alert('Catch Error' + e)
    }
  }
  const renderItem = ({ item, index }) => {
    return <TouchableOpacity
    style={[styles.listViewSty,item.OLevel==1?{backgroundColor:'#ce2507'}:item.OrderType==1?{backgroundColor:'#cfe9d3'}:null]}

      // style={item.OLevel == 1 ? { flexDirection: 'row', borderBottomWidth: 0.5, backgroundColor: '#F5B7B1' } : { flexDirection: 'row', borderBottomWidth: 0.5, backgroundColor: '#fff' }}
      // style={{flexDirection:'row',borderBottomWidth:0.5,}}
      onPress={() => {
        DefaultPreference.set('ItemInfo', JSON.stringify(item))
        DefaultPreference.clear('BCNdata');
        setsearch('')
        navigation.navigate('PtWiseOrderInGUser', { Id: 1, ItemInfo: 0, BCN: 0 })
      }}
    >
      <View style={{width: '10%', borderRightWidth: 1, borderColor: '#000',justifyContent:'center'}}>
      <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]}>{index + 1 + '.'}</Text>

      </View>
      <View style={{ width: '65%', borderRightWidth: 1, borderColor: '#000',justifyContent:'center' }}>
        <View>
        <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]}>{item.OrderNo} </Text>
        <Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]}>{item.OrderDate}</Text>
        <Text style={[styles.ValueTextSty, { color: 'blue', }]}>{item.DeliveryDate}</Text>
        <Text style={[style.ValueTextSty, { color: 'blue',}]}>{item.Picker}</Text>
        </View>
        {item.IRemarks !==''?<View style={{height:20,width:20,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
            <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/5291/5291032.png'}} style={{height:20,width:20,tintColor:'#1b8c02'}} />
          </View>
:null}
      </View>
<View style={{ width: '25%', borderRightWidth: 1, borderColor: '#000',justifyContent:'center' }}>
<Text style={[styles.ValueTextSty,item.OLevel==1?{color:'#fff'}:item.OrderType==1?{color:'#000'}:{color:'#000'}]} >{item.TotalQty}</Text>

</View>
    </TouchableOpacity>


  }
  // ---------------------------Search Function call
  const searchFilterFunction = (text) => {
    if (text) {

      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.OrderNo
            ? item.OrderNo.toUpperCase()
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
  return <SafeAreaView style={{ flex: 1 }}>
    <View style={{ padding: 5, backgroundColor: '#000' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }} >
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '700', fontSize: 16 }}>User:</Text>
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '700', fontSize: 16 }}>{UserName}</Text>
        </View>

      </View>
      <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, paddingBottom: 10, width: '100%' }}>
        <Text style={{ color: '#fff', marginTop: 5, fontWeight: '500', fontSize: 17 }}>Department:    {McName}</Text>
      </View>
      <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
        <Text style={{ color: '#fff', marginTop: 5, fontWeight: '300', fontSize: 17 }}>Total Party: </Text>
        <Text style={{ color: '#fff', marginTop: 5, fontWeight: '300', fontSize: 17 }}>{data.length}</Text>
      </View>
    </View>
    {GoDownReport == false ?
      <View>
        <View style={{ padding: 10, backgroundColor: '#D4D5D4' }}>
          <SearchBar
            backgroundColor="#fff"
            placeholder="Search here.."
            textInputStyle={{ height: 40, margin: 10 }}
            onChangeText={(text) => { searchFilterFunction(text) }}
            onSearchPress={(text) => { searchFilterFunction(text) }}
            // onPress={() => alert("onPress")}
            onClearPress={() => { setsearch('') }}
            value={search}
          />
        </View>

        <View style={{ width: '100%' }}>
          <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <View style={{ width: '10%', borderRightWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[style.headerText, { fontWeight: '500', fontSize: 15, padding: 5 }]} >SrNo.</Text>
            </View>
            <View style={{ width: '65%', borderRightWidth: 1, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[style.headerText, { fontWeight: '500', fontSize: 15, }]} >Order No. / Order  / Delivery Date / Picker </Text>
            </View>
            <View style={{ width: '35%', borderRightWidth: 1, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[style.headerText, { fontWeight: '500', fontSize: 15, }]} >Qty</Text>
            </View>
          </LinearGradient>
          <View style={{}}>
            {data.length > 0 ? <FlatList style={{ height: height / 1.5 }} data={data} renderItem={renderItem}
              keyboardShouldPersistTaps={'handled'}
              keyExtractor={(item, Index) => Index.toString()} /> : <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 19, fontWeight: '600', color: '#000' }}>Data Not Found</Text>

            </View>}

          </View>


        </View>

      </View> :
      <View>
        <View style={{ alignItems: 'center', width: '100%', backgroundColor: 'gray' }}>
          <Text style={{ fontSize: 19, fontWeight: '600', color: 'skyblue', padding: 5 }}>Godown Transfer Report</Text>

        </View>
        {GodownReportData.length > 0 ? <ScrollView horizontal={true}>
          {GodownReportData.map((item, index) => {
            let TAmount = 0
            let TQty = 0
            return <View style={{}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[style.salesmantextsty, { width: 100 }]}>Order ID :</Text>
                  <Text style={[style.salesmantextsty, { fontSize: 12, fontWeight: '400' }]}>{item.OrderNo}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[style.salesmantextsty, { width: 50 }]}>Date :</Text>
                  <Text style={[style.salesmantextsty, { fontSize: 12, fontWeight: '400' }]}>{moment(item.OrderDate).format('DD/MMM/YYYY')}</Text>
                </View>
              </View>
              <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>


              </View>
              <ScrollView horizontal={true}>
                <View>
                  <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
                    <Text style={{ padding: 5, color: '#fff', width: 120, borderRightWidth: 1, borderRightColor: '#fff' }}>Item Name</Text>
                    <Text style={{ padding: 5, color: '#fff', width: 70, borderRightWidth: 1, borderRightColor: '#fff' }}>Color</Text>
                    <ScrollView horizontal={true}>
                      <View style={{ minWidth: 200 }}>
                        <Text style={{ padding: 5, color: '#fff', width: 'auto', borderRightColor: '#fff', }}>Size/Qty</Text>

                      </View>

                    </ScrollView>

                  </View>
                  {item.OrdItem.map((ItemDT) => {
                    let sizeQty = ''
                    return <View style={{ flexDirection: 'row', borderBottomWidth: 1, minWidth: 100 }}>
                      <Text style={{ color: '#000', width: 120, borderRightWidth: 1, borderRightColor: '#000', padding: 4, fontSize: 12, fontWeight: '400', fontSize: 12, fontWeight: '400' }}>{ItemDT.ItemName}</Text>
                      <Text style={{ color: '#000', width: 70, borderRightWidth: 1, borderRightColor: '#000', padding: 4, fontSize: 12, fontWeight: '400', fontSize: 12, fontWeight: '400' }}>{ItemDT.Color}</Text>

                      <View style={{ alignItems: 'baseline', flexDirection: 'row', }}  >
                        <View style={{}}>
                          <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red', fontSize: 12, fontWeight: '400' }} >{ItemDT.Size} /{ItemDT.Qty}</Text>
                        </View>

                      </View>


                    </View>
                  })}
                </View>
              </ScrollView>

            </View>


          })}
        </ScrollView> : <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 19, fontWeight: '600' }}>Data Not Found</Text>
        </View>}
      </View>}


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
        <View style={{ height: '20%', width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
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

}
export default GodownUserDashBord;
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