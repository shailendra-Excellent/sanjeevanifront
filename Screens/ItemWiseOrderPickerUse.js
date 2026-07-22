import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, Alert, RefreshControl, useWindowDimensions, StyleSheet, Pressable, TextInput } from "react-native";
import DefaultPreference from 'react-native-default-preference';
import { style } from "./style";
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment/moment";
import { ScrollView } from "react-native";
import { Checkbox } from 'react-native-paper'
import { ActivityIndicator } from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
import SearchBar from "react-native-dynamic-search-bar";
import DropdownComponent from "./Components/ItemCreateComp/DropDownComp";
import { Modal } from 'react-native-paper';
// import { SafeAreaView } from "react-native-safe-area-context";

var pageSize = 2;
var pageNumber = 2;
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};
//    ------------------------------Flatlist Render Item
const RenderFirtsList = ({ item, index, Data, setValue, ItemDT }) => {
  // console.log(item)
  // console.log(index)
  return (
    <SafeAreaView style={{ marginTop: 10 }}>
      <View style={{ justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={[style.salesmantextsty, { fontSize: 16, fontWeight: '600', paddingLeft: 5 }]}>{item.ItemName}</Text>
            <Text style={[style.salesmantextsty, { fontSize: 12, fontWeight: '600', paddingLeft: 5, color: '#1b8c02' }]}>{item.IRemarks}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[style.itemSty, { margin: 3, color: '#000' }]}>Select All</Text>
            <Checkbox
              color='green'
              uncheckedColor='#000'
              status={Data[index]["selectAll"] ? 'checked' : 'unchecked'}
              onPress={() => {
                if (Data[index]["selectAll"] == false) {
                  Data[index]["selectAll"] = true;
                  let DT = []
                  Data[index]["ItemParamDT"].forEach(function (obj) {
                    obj.Transfer = 2
                    //  obj.Qty = 1
                    let object = {
                      Color: obj.Color,
                      Size: obj.Size,
                      Qty: obj.TfrQty,
                      Transfer: 2,
                    }

                    DT.push(object)
                    setValue(object)


                  })
                  let obj1 = {
                    ItemCode: Data[index]['ItemCode'],
                    ItemName: Data[index]['ItemName'],
                    ItemParamDT: DT
                  }

                  ItemDT.push(obj1)

                } else {
                  Data[index]["selectAll"] = false;
                  // setItemDT([])
                  Data[index]["ItemParamDT"].forEach(function (obj) {
                    obj.Transfer = 1
                    // obj.Qty = 0


                  })
                }
                // setChecked(!checked);
              }}
            />
          </View>
        </View>
        <View>
          <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40 }}>
            <View style={[styles.listHeaderSty, { width: '22%' }]}>
              <Text style={[style.headerText,]} >Color</Text>
            </View>
            <View style={styles.listHeaderSty}>
              <Text style={[style.headerText,]} >Size</Text>
            </View>
            <View style={styles.listHeaderSty}>
              <Text style={[style.headerText,]} >Main Qty</Text>
            </View>
            <View style={styles.listHeaderSty}>
              <Text style={[style.headerText,]} >Trf Qty</Text>
            </View>
            <View style={styles.listHeaderSty}>
              <Text style={[style.headerText,]} >Receive</Text>
            </View>

          </LinearGradient>
          <ColorWiseData mapData={item} ItemParamDT={item.ItemParamDT} setValue={(value) => { setOrdDT(value) }} />

        </View>
      </View>

    </SafeAreaView>
  )
}

const ColorWiseData = ({ ItemParamDT, setValue, mapData }) => {
  const [isRef, setisRef] = useState(false);
  const onRef = () => {
    setisRef(true);
    setTimeout(() => {
      setisRef(false)
    }, 1000);
  }
  return (
    <FlatList
      // maxToRenderPerBatch={10}
      // windowSize={5}
      refreshControl={
        <RefreshControl style={{ backgroundColor: 'transparent' }}
          progressBackgroundColor='transparent' colors={['transparent']} refreshing={false} onRefresh={() => { onRef() }} />
      }
      keyExtractor={(item, index) => index.toString()}
      data={ItemParamDT} renderItem={(({ item, index }) => {
        return (
          <SafeAreaView
            style={item.StockAvailable == 1 && item.Stock > 1 ? { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40, backgroundColor: '#bdf39a' }
              : item.StockAvailable == 1 && item.Stock == 1 ? { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40, backgroundColor: '#f9f6ab' } : { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40, }}>
            <View style={[styles.listHeaderSty, { width: '22%', borderColor: '#000' }]}>
              <Text style={[style.salesmantextsty,]} >{item.Color}</Text>
            </View>
            <View style={[styles.listHeaderSty, { borderColor: '#000' }]}>
              <Text style={[style.salesmantextsty,]} >{item.Size}</Text>
            </View>
            <View style={[styles.listHeaderSty, { borderColor: '#000' }]}>
              <Text style={[style.salesmantextsty,]} >{item.Qty}</Text>
            </View>
            <View style={[styles.listHeaderSty, { borderColor: '#000' }]} >
              <Text style={[style.salesmantextsty,]} >{item.TfrQty}</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
              {item.TfrQty == 0 ? <Text>N/A</Text> : <TouchableOpacity style={{ height: 25, width: 25, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {

                  // console.log(item)
                  if (item.Transfer == 1) {
                    // inputDetailsHandler('Transfer',index, 2,ItemParamDT)  
                    item.Transfer = 2;
                    onRef()
                  } else {
                    item.Transfer = 1
                    // inputDetailsHandler('Transfer',index, 1,ItemParamDT)  
                    onRef()
                  }

                }}
              >
                {item.Transfer == 1 ?
                  <Text></Text> : <Image source={require('./Images/check-mark.png')} style={{ height: 20, width: 20 }} />}


              </TouchableOpacity>}

            </View>

          </SafeAreaView>
        )
      })} />
  )
}

const inputDetailsHandler = (k, ind, val, ItemParamDT) => {

  // console.log('yyy', val)
  var locArr = ItemParamDT;
  locArr[ind][k] = val;


}

const ItemWiseOrderPicker = ({ navigation, route }) => {
  const { PartyInfo, Id, ItemInfo } = route.params;
  const [Data, setData] = useState([])
  const [ApprovelModal, setApprovalModal] = useState(false)
  const [PickerData, setPickerData] = useState([{ PickerName: 'Picker 1' }, { PickerName: 'Picker 2' },
  { PickerName: 'Picker 3' }, { PickerName: 'Picker 4' }, { PickerName: 'Picker 5' },]);
  const [SelectedPicker, setSelectedPicker] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [BaseURL, setBaseURL] = useState('');
  const [CompCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [alertMsg, setShowAlertMsg] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [ItemData, setItemData] = useState([]);
  const [OrdDT, setOrdDT] = useState([]);
  const [userName, setuserName] = useState('');
  const [ItemDT, setItemDT] = useState([]);
  const [ApplyFilter, setApplyFilter] = React.useState(false);
  const [selectAllItem, setSelectAllItem] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setsearch] = useState('');
  const { height, width } = useWindowDimensions();
  const [TrfQtyFilter, setTrfQtyFilter] = useState(false);
  const [desending, setdesanding] = useState(false);
  const [MinTrfQty, setMinTrfQty] = useState(0);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [DepartmentName, setDepartmentName] = useState('All');
  const [DepartmentCode, setDepartmentCode] = useState(0);
  const [VchCode, setVchCode] = useState(0);
  const [TotTransferQty, setTotTransferQty] = useState(0);
  const [ShowTrfData, setShowTrfData] = useState(false);
  const [exData, setexData] = useState(0);
  const [oldData, setOldData] = useState([]);
  const [exData1, setexData1] = useState(0);
  const [AvilabeStock, setAvilabeStock] = useState(0)
  // --------------------------UseEffect 
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseUrl) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('Uname').then(function (uname) {
            DefaultPreference.get('VchCode').then(function (VchCode) {
              setuserName(uname)
              setBaseURL(BaseUrl);
              setCompCode(compCode);
              setFy(Fy);
              setMinTrfQty(PartyInfo.TotalQty)
              callItemMasterAPI(BaseUrl, compCode, Fy, VchCode);
              setVchCode(VchCode)
              CallAPI(BaseUrl, compCode, Fy, VchCode, 0)
              if (Id == 2) {
                getLocalData()
              }
            });
          });
        });
      });
    });
  }, []);
  const callItemMasterAPI = async (BaseURL, compCode, Fy, VchCode) => {
    setisLoading(true)
    try {

      // console.log(BaseURL + '/api/Values/GetOrderPickingDepartment?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode);
      const res = await fetch(BaseURL + '/api/Values/GetOrderPickingDepartment?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode)
      // const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode)
      const response = await res.json();
      // setisLoading(false)
      if (response.Status == 1) {
        response.Data.sort((firstItem, secondItem) => firstItem.Name - secondItem.Name);
        response.Data.forEach(element => {
          element.select = false
        });
        setDepartmentData(response.Data)
      } else {
        setisLoading(false)
        alert(response.Message)
      }
    } catch (e) {
      setisLoading(false)
      alert(e)
    }
  };

  const getLocalData = async () => {
    try {
      const myArray = await AsyncStorage.getItem('GetListData');
      if (myArray !== null) {
        // We have data!!
        setData(JSON.parse(myArray))
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  // ---------------------------Search Function call
  const searchFilterFunction = React.useMemo((text) => {
    if (search) {

      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.ItemName
            ? item.ItemName.toUpperCase()
            : ''.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      setData(newData);
      setsearch(search);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(masterDataSource);
      setsearch(search);
    }
  }, [masterDataSource, search])

  //--------------------------APProval APICall
  const ApprovalAPI = async () => {
    let ItemDT = []
    Data.map((item) => {
      let ItemParamDT = []
      item.ItemParamDT.map((item2) => {

        if (item2.Transfer == 2 && item2.TfrQty > 0) {
          let obj2 = {
            Color: item2.Color,
            Size: item2.Size,
            Qty: item2.TfrQty,
            Transfer: item2.Transfer,
          }
          ItemParamDT.push(obj2)
        }
      })
      let obj = {
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        ItemParamDT: ItemParamDT
      }
      if (obj.ItemParamDT.length !== 0) {
        ItemDT.push(obj)
      }

    });
    const JSONData = {
      VchCode: PartyInfo.VchCode,
      SOrderID: PartyInfo.OrderNo,
      SOrderDate: moment(PartyInfo.OrderDate).format('DD/MMM/YYYY'),
      ItemDT: ItemDT
    }
    // console.log(JSON.stringify(JSONData))
    setisLoading(true);
    try {
      const response = await fetch(BaseURL + '/api/Values/SavePickerReceiving?CompCode=' + CompCode + '&FY=' + Fy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(JSONData)
      });
      const json = await response.json();
      setisLoading(false);
      navigation.goBack()
    } catch (e) {
      setisLoading(false)
      Alert.alert('Catch Error' + e)
    }
  }
  // ------------------------Call API
  const CallAPI = async (BaseUrl, compCode, Fy, VchCode, DepCode) => {
    setisLoading(true);
    try {
      console.log(BaseUrl + '/api/Values/GetOrderPickingItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&DeptCode=' + DepCode)
      const res = await fetch(BaseUrl + '/api/Values/GetOrderPickingItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&DeptCode=' + DepCode);
      const Response = await res.json();
      // console.log(Response)
      let TotTrf = 0;
      let AvbStock = 0;
      if (Response.Status == 1) {

        Response.Data.forEach(element => {
          element.selectAll = false;
          element.TotalTrf = 0;
          element.ItemParamDT.forEach(render2 => {
            element.Qty = element.Qty + render2.Qty
            element.TotalTrf = element.TotalTrf + render2.TfrQty;
            TotTrf = TotTrf + render2.TfrQty;
            if (render2.StockAvailable !== 0) {
              if (render2.Stock == render2.Qty) {
                AvbStock = AvbStock + render2.Qty;
                return;
              }
              if (render2.Stock >= render2.Qty) {
                AvbStock = AvbStock + render2.Qty;
                return;
              }
              if (render2.Stock < render2.Qty) {
                AvbStock = AvbStock + render2.Stock;
                return;
              }
              AvbStock = AvbStock + render2.StockAvailable;
            }
          });
        });
        setAvilabeStock(AvbStock)
        setTotTransferQty(TotTrf)
        Response.Data.sort((a, b) => b.TotalTrf - a.TotalTrf);
        let TotTrfQty = 0;
        let TotMainQty = 0
        Response.Data.forEach(element => {
          TotMainQty = TotMainQty + element.Qty
          TotTrfQty = TotTrfQty + element.TotalTrf
         

        });
        Response.Data.forEach(item => {
  item.ItemParamDT.sort((a, b) => a.Color.localeCompare(b.Color, undefined, { numeric: true }));
});

        setMinTrfQty(TotMainQty)
        setTotTransferQty(TotTrfQty)
        setData(Response.Data);
        setMasterDataSource(Response.Data);
        setOldData(Response.Data)

        setisLoading(false)
      } else {
        alert(Response.Message);
      }
    } catch (e) {
      setisLoading(false);
      Alert.alert('Catch Error' + e)
    }
    setisLoading(false);

  }

  const ShowOnlyTrfData = () => {
    let newData = []
    let locData = Data;
    let MainQty = 0;
    let TotQty = 0;
    if (ShowTrfData == false) {


      locData.forEach(element => {
        if (element.TotalTrf > 0) {
          // console.log('====================================');
          // console.log(element);
          // console.log('====================================');
          newData.push(element);
          MainQty = MainQty + element.Qty;
          TotQty = TotQty + element.TotalTrf
        }

      });
      setMinTrfQty(MainQty);
      setTotTransferQty(TotQty)
      setData(newData);
      setMasterDataSource(newData)
    } else {
      oldData.forEach(element => {


        MainQty = MainQty + element.Qty;
        TotQty = TotQty + element.TotalTrf


      });
      setMinTrfQty(MainQty);
      setTotTransferQty(TotQty)
      setData(oldData);
      setMasterDataSource(oldData)
    }

    setexData(exData + 1)
    setShowTrfData(!ShowTrfData)
    // console.log('====================================');
    // console.log(JSON.stringify(Data));
    // console.log('====================================');
  }


  const FooterComp = () => {
    if (Data.length < 5) {
      setTimeout(() => {
        return <View style={{ alignItems: 'center' }}>

          <ActivityIndicator size={'large'} />
          {/* <Text style={{fontSize:20}}>hello</Text> */}
        </View>
      }, 10000);
    } else {
      return <View style={{ alignItems: 'center' }}>

        <ActivityIndicator size={'large'} />
        {/* <Text style={{fontSize:20}}>hello</Text> */}
      </View>
    }


  }
  //   function paginate(array, pageSize, pageNumber) {
  //     return Data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  // }
  // console.log( 'ggggggg',  paginate(Data, pageSize, pageNumber));

  const onendreached = ({ distancefromend }) => {
    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
    return Data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    // if(!this.onendreachedcalledduringmomentum){
    //     this.fetchdata();
    //     this.onendreachedcalledduringmomentum = true;
    // }
  }
  const changeHandler = (ind, item) => {
    console.log('====================================');
    console.log(item.Code);
    console.log('====================================');
    let LocData = DepartmentData;
    LocData[ind]['select'] = !LocData[ind]['select']
    // LocData[!ind]['select']= false;
    if (LocData[ind]['select'] == true) {
      setDepartmentName(item.Name)
      CallAPI(BaseURL, CompCode, Fy, VchCode, item.Code)
    }

    setDepartmentData(LocData)
    setexData1(exData1 + 1);
  }
  return (
    <SafeAreaView style={{ flex: 1, }}>
      {/* --------------------Party Info In Header----------------------- */}
      <View style={{ padding: 5, backgroundColor: '#000' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '75%' }}>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>OrderId:   </Text>
              <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{PartyInfo.OrderNo}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, width: '70%' }} >
                <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Party Name:   </Text>
                <View style={{ alignItems: 'flex-start' }}>
                  <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{PartyInfo.AccName}</Text>
                </View>
              </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, width: '70%', marginTop: 5 }} >
              <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Shipping Party:   </Text>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{PartyInfo.SAccName}</Text>
              </View>
            </View>
          </View>
          <RNBounceable onPress={() => {
            ShowOnlyTrfData()
          }} style={{ backgroundColor: '#fff', borderRadius: 10, height: 30, width: 100, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            {ShowTrfData == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5291/5291043.png' }} style={{ height: 25, width: 25, tintColor: 'green' }} /> : null}
            <Text style={{ color: '#000', fontSize: 14, fontWeight: '800' }}>Show Trf</Text>
          </RNBounceable>
          {/* <RNBounceable onPress={() => {
            setApplyFilter(true)
          }} >
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10628/10628714.png' }} style={{ height: 30, width: 30, tintColor: '#fff', margin: 5 }} />
          </RNBounceable> */}
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }} >
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Main Qty:</Text>
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{MinTrfQty}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }} >
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Order Date:  </Text>
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{moment(PartyInfo).format('DD/MMM/YYYY')}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, width: '40%' }} >
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Total Transfer Qty :</Text>
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{TotTransferQty}</Text>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }} >
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Order Date:  </Text>
            <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{moment(PartyInfo).format('DD/MMM/YYYY')}</Text>
          </View> */}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, width: '40%' }} >
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '600', }}>Available Stock :</Text>
          <Text style={{ color: '#fff', marginTop: 5, fontWeight: '400', }}>{AvilabeStock}</Text>
        </View>
        <FlatList data={DepartmentData} style={{ height: 40 }}
          horizontal={true}
          extraData={exData1}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {
            // console.log('====================================');
            // console.log(item);
            // console.log('====================================');
            return (
              <RNBounceable onPress={() => {
                changeHandler(index, item)
              }} style={{ backgroundColor: '#fff', borderRadius: 7, alignItems: 'center', justifyContent: 'center', height: 30, flexDirection: 'row', marginLeft: 3, padding: 4, minWidth: 80 }}>
                {/* {item.select ==true ?<Image source={{uri:'https://cdn-icons-png.flaticon.com/128/5291/5291043.png'}} style={{height:20,width:20,tintColor:'green'}} />:null} */}
                <Text style={{ color: '#000' }}>{item.Name}</Text>
              </RNBounceable>
            )
          }}
        />
      </View>

      <View style={{ padding: 10, backgroundColor: '#D4D5D4' }}>
        <SearchBar
          backgroundColor="#fff"
          placeholder="Search here.."
          textInputStyle={{ height: 40, margin: 10 }}
          onChangeText={(text) => {
            setsearch(text)
            //  searchFilterFunction(text)
          }}
          onSearchPress={(text) => { setsearch(text) }}
          value={search}
        />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: 'green', margin: 3 }}>{DepartmentName} Department</Text>
      <View style={{ flexDirection: 'row', }}>
        <Text style={[style.itemSty, { margin: 3, color: '#000', fontWeight: '500' }]}>Select All Item</Text>
        <Checkbox
          color='green'
          uncheckedColor='#000'
          status={selectAllItem ? 'checked' : 'unchecked'}
          onPress={() => {
            if (selectAllItem == true) {
              setSelectAllItem(false)
              Data.map((item) => {
                item.selectAll = false
                item.ItemParamDT.map((item2) => {
                  if (item.TfrQty !== 0) {
                    item2.Transfer = 1
                  }
                })
              })
            } else {
              setSelectAllItem(true)
              Data.map((item) => {
                let DT = []
                item.selectAll = true
                item.ItemParamDT.map((item2) => {
                  if (item.TfrQty !== 0) {
                    item2.Transfer = 2
                  }
                })
              })
            }

            // setChecked(!checked);
          }}
        />
      </View>
      {/* <SafeAreaView> */}
      {/* <ScrollView  >
        {Data.map((item, index)=>{
          // console.log(item)
          // return<Text>hello</Text>
        return <RenderFirtsList item={item} index={index} Data={Data} setValue={(item) => {
            setOrdDT([...OrdDT, item])
          }} ItemDT={ItemDT} />

        })}
       </ScrollView> */}
      <ScrollView
        // onScroll={({nativeEvent}) => {
        //   if (isCloseToBottom(nativeEvent)) {
        //     // enableSomeButton();
        //     onendreached
        //   }D
        // }}
        scrollEventThrottle={400}
      >
        <FlatList style={{}}
          extraData={exData}
          data={Data}
          removeClippedSubviews={true}
          initialNumToRender={4}
          keyExtractor={(item, index) => index}
          maxToRenderPerBatch={10}
          windowSize={10}
          renderItem={({ item, index }) => {
            return <RenderFirtsList key={index} item={item} index={index} Data={Data} setValue={(item) => {
              setOrdDT([...OrdDT, item])
            }} ItemDT={ItemDT} />
          }
          }
          // maxToRenderPerBatch={10}
          // windowSize={40}
          // removeClippedSubviews={true}
          // initialNumToRender={20}
          // maxToRenderPerBatch={40}
          // scrollEventThrottle={400}
          ListFooterComponent={FooterComp}
        />
      </ScrollView>

      {/* </SafeAreaView> */}

      <Modal visible={isLoading} transparent={true} >
        <View style={[style.content, {
          background: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
        }]}>
          <ActivityIndicator size={'large'} color={'red'} />
          <Text style={{ color: '#000', fontWeight: '700' }}>Please Wait...</Text>
        </View>
      </Modal>
      {/* ---------------------Modal for Approvel------------------------------- */}
      <Modal visible={showModal} transparent={true} animationType='slide'  >
        <View style={style.content}>
          <View style={{ height: '20%', width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ margin: 5, fontSize: 20, fontWeight: '600', color: '#000' }}>Alert</Text>
            </View>
            <View style={{ margin: 5 }}>
              <Text style={{ color: '#000' }}>{alertMsg}</Text>
            </View>
            <View style={{ width: '90%', alignItems: 'flex-end' }}>

              <TouchableOpacity style={style.alertMsgBtnSty}
                onPress={() => {
                  setshowModal(false);
                  setShowAlertMsg('')
                }} >
                <Text style={{ color: '#fff' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row' }}>
          <RNBounceable
            onPress={() => {
              navigation.goBack()
            }}
            style={{
              alignItems: 'center', justifyContent: 'center', backgroundColor: 'red',
              borderWidth: 1, borderColor: '#fff', width: '50%'
            }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14, padding: 7 }}>Quit</Text>
          </RNBounceable>
          <RNBounceable style={{
            alignItems: 'center', justifyContent: 'center', backgroundColor: 'green',
            borderWidth: 1, borderColor: '#fff', width: '50%'
          }}
            onPress={() => {
              Alert.alert('Alert', 'Do You want to receive Items', [
                {
                  text: 'NO',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'YES', onPress: () => ApprovalAPI() },
              ]);
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14, padding: 5 }}>Approved</Text>
          </RNBounceable>

        </View>
      </View>
      <Modal visible={ApplyFilter} transparent={true} >
        <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => {
          setApplyFilter(false)
        }} >
          <Pressable style={{ height: '50%', width: '100%', backgroundColor: '#fff', borderTopRightRadius: 20, borderTopLeftRadius: 20, padding: 5 }}>
            <Pressable style={{ alignSelf: 'flex-end', margin: 10 }}
              onPress={() => {
                setApplyFilter(false)
              }}
            >
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2961/2961937.png' }} style={{ height: 30, width: 30 }} />
            </Pressable>

            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '700' }}>Apply Filter</Text>
            <DropdownComponent Data={DepartmentData} Value={DepartmentName} setValue={(val) => {
              setDepartmentCode(val.Code);
              setDepartmentName(val.Name)
            }} headerCap={'Search Department'} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
              <RNBounceable style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}
                onPress={() => {
                  setdesanding(!desending)
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: 'gray' }}>Short By Trf Qty</Text>
                <Image source={{ uri: desending == true ? 'https://cdn-icons-png.flaticon.com/128/4655/4655143.png' : 'https://cdn-icons-png.flaticon.com/128/8567/8567254.png' }} style={{ height: 30, width: 30, tintColor: 'gray' }} />

              </RNBounceable>
              {/* <TextInput keyboardType={'numeric'} style={{ borderWidth: 1, height: 35, width: 80,alignSelf:'center',borderColor:'gray',borderRadius:10}}
              value={MinTrfQty} 
              onChangeText={(text)=>{
                setMinTrfQty(text)
              }}
              /> */}
            </View>

            <RNBounceable style={{ width: '50%', height: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#000', marginTop: 30, borderRadius: 10 }}
              onPress={() => {
                setApplyFilter(false)
                CallAPI(BaseURL, CompCode, Fy, VchCode, DepartmentCode)
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Load</Text>
            </RNBounceable>

          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}
export default ItemWiseOrderPicker;
const styles = StyleSheet.create({
  listHeaderSty: {
    width: '20%',
    borderRightWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

})