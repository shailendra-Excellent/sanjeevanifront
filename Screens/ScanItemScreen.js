import React, { useState, useEffect } from 'react';
// import { Text, Divider, useTheme } from '@rneui/themed';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Alert, TextInput, Keyboard, FlatList, Image, RefreshControl, Text, Modal, BackHandler, Button, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Pressable } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import { UIActivityIndicator } from 'react-native-indicators';
import { Checkbox } from 'react-native-paper'
import { style } from './style';
import { useIsFocused } from '@react-navigation/native';
import RedioBtn from './Components/RedioBtn';
import SerchComponent from './Components/SearchComponent';
import ButtonComponent from './Components/ButtonComponent';
import SearchBar from "react-native-dynamic-search-bar";
import CustomSearch from './Components/CustomSearch';
import RNBounceable from '@freakycoder/react-native-bounceable';
let exData = 0;
const ScanItemScreen = ({ navigation, route }) => {
  const { BCN, Id, OType, BStation } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [incCard, setIncCard] = useState()
  const [BaseURL, setBaseURL] = useState('');
  const [CompCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [ItemName, setItemName] = useState('');
  const [ItemCode, setItemCode] = useState('0')
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [stock, setstock] = useState('');
  const [userName, setUserName] = useState('')
  const [custCode, setCustCode] = useState('');
  const [coustName, setCustName] = useState('');
  const [shippingParty, setshippingParty] = useState('');
  const [shippingPCode, setShippingPCode] = useState('');
  const [VchCode, setVchCode] = useState('0');
  const [shippingval, setShippingval] = useState('0');
  const [Data, setData] = useState([]);
  const [AddCartGif, setAddCartGif] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [showAlertMsg, setShowAlertMsg] = useState('')
  const [showModify, setshowModify] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [Qty, setQty] = useState();
  const isFocused = useIsFocused();
  const [ItemWiseCheck, setItemWiseCheck] = useState(true);
  const [BCNWise, setBCNWise] = useState(false);
  const [ItemData, setItemData] = useState([])
  const [Iname, setIname] = useState('');
  const [CartBtnDisable, setCartBtnDisable] = useState(false)
  let KartList = [];
  const [Icode, setIcode] = useState('0');
  const [Transporter, setTransporter] = useState('');
  const [Remark, setRemark] = useState('');
  const [searchValue, setSearchValue] = useState('')
  // const [searchDepartment,setSearchDepartment]= useState('');
  const [DepartmentObj, setDepartmentObj] = useState({
    Departmentname: '', DepartmentCode: '', DepartmentData: [], DepartmentMasterData: [], SearchDepartment: ''
  });
  const [NegativeStockMsg, setNegativeStockMsg] = useState(false);
  const [NegativestockData, setNegativestockData] = useState([]);
  const [VisibleItemRemark, setVisibleItemRemark] = useState(false);
  const [ItemRemark, setItemRemark] = useState('');
  const [height, setHeight] = useState(0);
  const [ItemGroupData, setItemGroupData] = useState([])
  useEffect(() => {

    DefaultPreference.get('TransRemark').then((TransRemark) => {
      setTransporter(JSON.parse(TransRemark).Transport);
      setRemark(JSON.parse(TransRemark).Remarks)

    })
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('Uname').then(function (uname) {
            DefaultPreference.get('ShippingParty').then(function (shippingParty) {
              DefaultPreference.get('shippingPCode').then(function (shippingPCode) {
                DefaultPreference.get('PCode').then(function (PCode) {
                  DefaultPreference.get('Partyname').then(function (Partyname) {
                    DefaultPreference.get('VchCode').then(function (VchCode) {
                      DefaultPreference.get('InCartVal').then(function (InCartVal) {
                        setIncCard(InCartVal);
                        global.BaseURL = BaseURL;
                        global.CompCode = compCode;
                        global.Fy = Fy
                      })
                      setCustName(Partyname);
                      setCustCode(PCode);
                      if (VchCode !== '0') {
                        ShowCount(BaseURL, compCode, Fy, VchCode);
                        setshowModify(true)
                      } else {
                        setshowModify(false);
                        setIncCard(0)
                        ShowCount(BaseURL, compCode, Fy, 0);
                      }
                      setShippingPCode(shippingPCode);

                      if (shippingParty == '') {
                        setshippingParty('')
                      } else {
                        setshippingParty(shippingParty);
                        setShippingval('1')
                      }
                      setUserName(uname);
                      setBaseURL(BaseURL);
                      setCompCode(compCode);
                      setFy(Fy);
                      setVchCode(VchCode);
                      // callItemMasterAPI(BaseURL,compCode,Fy,6,0);
                      callItemMasterAPI(BaseURL, compCode, Fy, 5, 0)

                      if (BCN !== undefined) {
                        CallAPI(BaseURL, BCN, Icode, compCode, Fy);
                      }
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }, [isFocused]);
  // --------------------CallAPI
  const CallAPI = async (BaseURL, BCN, ItemCode, compCode, Fy) => {
    CleartData();
    try {
      setIsloading(true);
      console.log(BaseURL + '/api/Values/SearchItem?CompCode=' + compCode + '&FY=' + Fy + '&BCN=' + BCN + '&ItemCode=' + ItemCode + '&FairI=' + global.FairOrder)
      const res = await fetch(BaseURL + '/api/Values/SearchItem?CompCode=' + compCode + '&FY=' + Fy + '&BCN=' + BCN + '&ItemCode=' + ItemCode + '&FairI=' + global.FairOrder)
      const response = await res.json();
      setIsloading(false);
      if (response.Status == 1) {
        setShowImage(true);
        response.Data.forEach(element => {
          element.IColorDT.forEach(obj => {
            obj.CheckAppVal = false,
              obj.SecQty = 1,
              obj.showSizeData = false,
              obj.SizeDT.forEach(function (sizeData) {
                sizeData.checkVal = false
              })
          });
        });
        setItemGroupData(response.Data);
        // console.log(response.Data)
        // if (response.Data.IColorDT.length > 0) {
        //   if (response.Data.ItemName !== null) {
        //     setItemName(response.Data.ItemName);
        //     setItemCode(response.Data.ItemCode);
        //     setColor(response.Data.IColor);
        //     setSize(response.Data.ISize);
        //     setstock(response.Data.IPrice);
        //     response.Data.IColorDT.forEach(function (obj) {
        //       obj.CheckAppVal = false,
        //         obj.SecQty = 1,
        //         obj.showSizeData = false,
        //         obj.SizeDT.forEach(function (sizeData) {
        //           sizeData.checkVal = false
        //         })
        //     });
        //     setData(response.Data.IColorDT);
        //   } else {
        //     setshowModal(true);
        //     setShowAlertMsg('Color Not Found..');
        //     setTimeout(() => {
        //       setshowModal(false);
        //     }, 4000);
        //   }
        // } else {
        //   setshowModal(true);
        //   CleartData();
        //   setShowAlertMsg('Item Not Found..');
        //   setTimeout(() => {
        //     setshowModal(false);
        //   }, 2000);
        // }

      }
    } catch (e) {
      setIsloading(false);
      alert('Catch Error', +e)
    }
  }
  const CleartData = () => {
    setItemName('');
    setItemCode('')
    setColor('');
    setSize('');
    setstock('');
    setData([])
  }
  // ---------------------Call Item  Master API 
  const callItemMasterAPI = async (BaseURL, compCode, Fy, MasterType, DepartmentCode) => {
    //  setIsloading(true)
    console.log(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode);
    const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode)
    const response = await res.json();
    setIsloading(false)
    if (response.Status == 1) {
      const months = ['March', 'Jan', 'Feb', 'Dec'];
      months.sort();
      let data = response.Data;
      response.Data.sort((firstItem, secondItem) => firstItem.Name - secondItem.Name);
      if (MasterType == 5) {
        setDepartmentObj({ ...DepartmentObj, DepartmentMasterData: response.Data })
        // setItemData([])
      }
      if (MasterType == 6) {
        setItemData(response.Data)
      }
    } else {
      alert(response.Message)
    }

  }
  const itemqtyIncrement = (ind, index, inc, color, size, colorData, index1) => {
    // console.log(ind, index, inc, color, size,colorData,index1)
    let TotalQty = ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['GStock'] +
      ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['SStock']
    // console.log('Totla Qty' + TotalQty)
    switch (inc) {
      case 'ADD':
        if (global.FairOrder == 1) {
          ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] = ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] + 1
          setItemGroupData(ItemGroupData);
        } else {
          if (ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] < TotalQty) {
            ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] = ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] + 1
            setItemGroupData(ItemGroupData);

          }
        }

        

        var clearintrvl = setRefreshing(true)
        setTimeout(() => {
          setRefreshing(false)
        }, 10, () => clearTimeout(clearintrvl))

        break;
      case 'SUB':
        if (ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] == 0) {
          return;
        }
        ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] = ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty'] - 1
        obj = {
          ItemCode: ItemCode,
          Color: ItemGroupData[index1]['IColorDT'][ind].Color,
          Size: size,
          Qty: ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]['Qty']
        }

        setItemGroupData(ItemGroupData);
      
        var clearintrvl = setRefreshing(true)
        setTimeout(() => {
          setRefreshing(false)
        }, 10, () => clearTimeout(clearintrvl))

        break;
      default:
        null
        break;
    }


  }
  // ----------------Search Function
  searchFilterFunction = text => {
    setDepartmentObj({ ...DepartmentObj, Departmentname: text })
    const newData = DepartmentObj.DepartmentMasterData.filter(
      function (item) {
        const itemData = item.Name.toUpperCase()
          ? item.Name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    if (newData.length == 0) {
      setDepartmentObj({ ...DepartmentObj, DepartmentData: newData })
      // setShowCustList(3)
    } else {
      setDepartmentObj({ ...DepartmentObj, DepartmentData: newData })
      // setShowCustList(1),
      // setData(newData);
    }
  };

  const itemDetailsFunc = (ind, color, checkValue, colorData, index1) => {
    // console.log('====================================');
    // console.log(index1);
    // console.log('====================================');
    return <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={itemqtyIncrement}
        />
      }
    
      keyExtractor={(item, index) => {
        index.toString()
      }}
      contentContainerStyle={{
        flexDirection: 'row',
      }}

      numColumns={2}
      data={colorData[ind]['SizeDT']} renderItem={({ item, index }) => {
        return <>
          <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ height: 150, borderBottomWidth: 0.6, borderRightWidth: 0.5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={style.StockBtnSty}>
                  <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{item.GStock}</Text>
                </View>
                <View style={style.StockBtnSty}>
                  <Text style={{ fontSize: 15, color: 'green', fontWeight: 'bold' }}>{item.SStock}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 25, fontWeight: '300' }}>{item.Size}</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', }}>
                  <View style={{ height: 30, width: 30 }}>
                    <RNBounceable
                      onPress={() => {
                        itemqtyIncrement(ind, index, 'ADD', color, item.Size, colorData, index1)
                      }}
                      style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 2, backgroundColor: '#000' }}
                    >
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828925.png' }} style={{ height: 17, width: 17, tintColor: '#fff' }} />
                    </RNBounceable>
                    {/* <Button
        title='+'
        color="#929591"
        onPress={()=> {
          itemqtyIncrement(ind,index,'ADD',color,item.Size)
      }}
        style={{backgroundColor:'white',elevation:6,justifyContent:'center',alignItems:'center'}}>
        </Button> */}
                  </View>
                  <View style={{ width: '10%' }}>
                    <Text style={{ alignSelf: 'center', }}>{item.Qty}</Text>
                  </View>

                  <View style={{ height: 30, width: 30 }}>
                    {/* <Button
        title='-'
        color="#929591"

        onPress={()=>itemqtyIncrement(ind,index,'SUB',color,item.Size,)}
        style={{fontSize:20}}
        >
        </Button> */}
                    <RNBounceable
                      onPress={() => {
                        itemqtyIncrement(ind, index, 'SUB', color, item.Size, colorData, index1)
                        // itemqtyIncrement(ind, index, 'SUB', color, item.Size,)
                      }}
                      style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 2, backgroundColor: '#000' }}
                    >
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9061/9061433.png' }} style={{ height: 15, width: 15, tintColor: '#fff' }} />
                    </RNBounceable>
                  </View>

                </View>
              </View>
              <View style={{ alignItems: 'center', paddingTop: 10 }}>
                {item.checkVal == true ?
                  <RNBounceable
                    onPress={() => {
                      Alert.alert(
                        "Do You Want To Remove This Color?",
                        "",
                        [
                          {
                            text: "No",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "Yes", onPress: () => {
                              // console.log(ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]["checkVal"])
                              ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]["checkVal"] = !ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]["checkVal"]
                              ItemGroupData[index1]['IColorDT'][ind]['SizeDT'][index]["Qty"] = 0
                            
                              var clearintrvl = setRefreshing(true);
                              setTimeout(() => {
                                setRefreshing(false)
                              }, 10, () => clearTimeout(clearintrvl))

                            }
                          }
                        ]
                      );

                    }}
                  >

                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5290/5290058.png' }} style={{ height: 30, width: 30 }} />
                  </RNBounceable> : <></>
                }
              </View>
            </View>
          </View>
        </>
      }} />
  }


  // function increment add to cart
  const AddToCart = async () => {
    setNegativestockData([]);
    KartList = []
    ItemGroupData.forEach(element => {
      element.IColorDT.forEach(obj => {
        obj.SizeDT.forEach(item => {
          if (item.Qty > 0) {
            let Newobj = {
              'ItemCode': element.ItemCode,
              'Color': obj.Color,
              'Size': item.Size,
              'Qty': item.Qty
            }
            KartList.push(Newobj)
          }
        });
      });
    });

    if (KartList.length > 0) {

      Alert.alert('Wait', 'Do You Want To Save Order With Remarks', [
        {
          text: 'NO',
          onPress: () => SaveOrder(),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => setVisibleItemRemark(true) },
      ]);
    }




  }
  const SaveOrder = async () => {
    // console.log(KartList);
    KartList = []
    ItemGroupData.forEach(element => {
      element.IColorDT.forEach(obj => {
        obj.SizeDT.forEach(item => {
          if (item.Qty > 0) {
            let Newobj = {
              'ItemCode': element.ItemCode,
              'Color': obj.Color,
              'Size': item.Size,
              'Qty': item.Qty
            }
            KartList.push(Newobj)
          }
        });
      });
    });
    if (KartList.length > 0) {
      setCartBtnDisable(true)
      const JSONdata = {
        UserName: userName,
        VchCode: VchCode,
        AccCode: custCode,
        AccName: coustName,
        Shipping: shippingval,
        SAccCode: shippingPCode,
        SAccName: shippingParty,
        Transport: Transporter,
        FairOrder: global.FairOrder,
        Remarks: Remark,
        IRemarks: ItemRemark,
        BStation: BStation,
        KartList: KartList,
      }
    
      setIsloading(true);
      try {

        const response = await fetch(BaseURL + '/api/Values/AddToKart?CompCode=' + CompCode + '&FY=' + Fy + '&OType=' + OType, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(JSONdata)
        });
        const json = await response.json();
        setIsloading(false);
        KartList = []
        if (json.Status == 1) {
          setItemRemark('');
          setCartBtnDisable(false);
          setVchCode(json.VchCode.toString());
          DefaultPreference.set('VchCode', json.VchCode.toString());
          ShowCount(BaseURL, CompCode, Fy, json.VchCode);
          CallAPI(BaseURL, BCN, Icode, CompCode, Fy);
          setIsloading(false)
          setAddCartGif(true);
          setTimeout(() => {

            setAddCartGif(false)
          }, 3000);
        }
        if (json.Status == -1) {
          setNegativestockData(json.KartList);
          setNegativeStockMsg(true)
          setCartBtnDisable(false)
          setIsloading(false)
          // Alert.alert()
        }
        if (json.Status == 0) {
          Alert.alert(json.Msg)
          setCartBtnDisable(false)
          setIsloading(false)
        }

      } catch (e) {
        setIsloading(false)
        Alert.alert(e.message)
      }

    } else {
      return;
    }
  }
  const sendNotification = async (total) => {
    let data = {
      StageID: 1,
      Title: userName,
      Msg: 'Total ' + total + ' Order Pending For Approval'
    }
    const res = await fetch(BaseURL + '/api/values/SendNotification?CompCode=' + CompCode + '&FY=' + Fy, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(data)
    })

    // console.log("NOTIFICATION RESULT=>",res)

    let result = await res.json();
    console.log("NOTIFICATION RESULT WITH JSON=", result)
  }
  const ShowCount = async (BaseURL, CompCode, Fy, VchCode) => {
    setIsloading(true)
    console.log(BaseURL + '/api/Values/GetOrderKartDetail?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode);
    const res = await fetch(BaseURL + '/api/Values/GetOrderKartDetail?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode);
    const response = await res.json();
    setIsloading(false)
    if (response.Status == 1) {

      setIncCard(response.Data.Qty);

    }
  }


  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>

      <Modal style={{ flex: 1 }} visible={NegativeStockMsg} transparent={true} >
        <Pressable
          onPress={() => {
            setNegativeStockMsg(!NegativeStockMsg)
          }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Pressable onPress={() => {
            setNegativeStockMsg(true)
          }} style={{ height: 400, width: 300, backgroundColor: '#EEF7F5', alignItems: 'center' }} >
            <Image source={{ uri: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGMydzNpaGI3dHloY2x5YjMweGpzeDl3MG8weXF0cTliNnA4MHQ2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9ZQ/h4OGa0npayrJX2NRPT/giphy.gif' }} style={{ height: 80, width: 80 }} />
            <Text style={{ fontWeight: '700', }}>Negative Stock Items</Text>
            <View style={{ flexDirection: 'row', width: 300 }}>
              <View style={{ width: 120, height: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Colour</Text>
              </View>
              <View style={{ width: 100, height: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Size</Text>
              </View>
              <View style={{ width: 80, height: 30, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Qty</Text>
              </View>
            </View>
            <FlatList style={{ height: 100, }} data={NegativestockData} keyExtractor={({ item, index }) => index} renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: 'row', width: 300 }}>
                  <View style={{ width: 120, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'gray', padding: 5 }}>
                    <Text style={{ color: 'gray', fontWeight: '600' }}>{item.Color}</Text>
                  </View>
                  <View style={{ width: 100, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'gray', padding: 5 }}>
                    <Text style={{ color: 'gray', fontWeight: '600' }}>{item.Size}</Text>
                  </View>
                  <View style={{ width: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'gray', padding: 5 }}>
                    <Text style={{ color: 'gray', fontWeight: '600' }}>{item.RQty}</Text>
                  </View>
                </View>
              )
            }} />
            <RNBounceable
              onPress={() => {
                setNegativeStockMsg(false)
              }}
              style={{ backgroundColor: '#000', width: 100, height: 40, borderRadius: 7, margin: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>OK</Text>
            </RNBounceable>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={{ height: '100%' }}>
        <View style={{ padding: 5, backgroundColor: '#000', }}>
          {global.FairOrder == 1 ? <View style={{ alignItems: 'center', margin: 5 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2622/2622619.png' }} style={{ height: 20, width: 20 }} />
              <Text style={{ color: '#D89F08', fontWeight: '700', fontSize: 16, margin: 5 }}>Exhibition Order</Text>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2622/2622619.png' }} style={{ height: 20, width: 20 }} />
            </View>
          </View> : null}

          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.headerCapctionSty, showModify ? { color: '#F39C12', width: '30%' } : { color: '#3BA90B', width: '30%' }]}>{showModify ? 'Modify Order' : 'New Order'}</Text>
              <RNBounceable style={{ flexDirection: 'row', alignItems: 'center', width: '40%' }}
                onPress={() => {
                  navigation.navigate('CrateItem')
                }}

              >
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4546/4546820.png' }} style={{ height: 30, width: 30, tintColor: '#fff', marginRight: 4 }} />
                <Text style={[styles.headerCapctionSty, { width: '70%' }]}>Create Item</Text>
              </RNBounceable>


            </View>
          </View>
          {/* <View style={{alignItems:'center'}}> */}

          {/* {showModify?
          <View style={{alignItems:'center'}} >
                          <Text style={{color:'#F39C12',marginTop:5,fontWeight:'700',fontSize:16}}>Modify Order</Text>
                         </View>:<View >
                          <Text style={{color:'#3BA90B',marginTop:5,fontWeight:'700',fontSize:16}}>New Order</Text>
                         </View>} */}
          {/* </View> */}
          <View style={styles.headerViewSty}>
            <Text style={styles.headerCapctionSty}>Order Id</Text>
            <Text style={[styles.headerCapctionSty, { width: 10 }]}>:</Text>
            <Text style={[styles.headerCapctionSty, { width: '40%' }]} >{VchCode}</Text>
          </View>
          <View style={styles.headerViewSty}>
            <Text style={styles.headerCapctionSty}>Shipping Party</Text>
            <Text style={[styles.headerCapctionSty, { width: 10 }]}>:</Text>
            <Text style={[styles.headerCapctionSty, { width: '40%' }]} >{shippingParty}</Text>
          </View>
          <View style={styles.headerViewSty}>
            <Text style={styles.headerCapctionSty}>Billing Party</Text>
            <Text style={[styles.headerCapctionSty, { width: 10 }]}>:</Text>
            <Text style={[styles.headerCapctionSty, { width: '40%' }]} >{coustName}</Text>
          </View>
          {/* {OType !==2 && incCard !==0?  <View style={{alignItems:'flex-end'}}>
                      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{
                        navigation.navigate('CartList',{BCN:BCN})
                      }}
                        > 
                        <View style={{flexDirection:'row',margin:5}}>
                        <Image style={{height:30,width:30}} source={require('../assests/addtocart.png')} />
                        <View style={{justifyContent:'center',alignItems:'center',borderRadius:50,
                        backgroundColor:'white',padding:5}}>
                            <Text style={{color:'red'}}>{incCard}</Text>
                          </View>
                        </View>
     
      </TouchableOpacity>
                    </View>
                    : <></>} */}
          {/* <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
       
          </View> */}
          {/* <View style={{alignItems:'flex-start',}}>
          <View style={{flexDirection:'row',justifyContent:'space-evenly',}}><Text style={{width:100,fontSize:16,color:'#fff'}}>Order Id:</Text><Text style={{color:'#fff'}} >{VchCode}</Text></View>
          <View style={{flexDirection:'row',justifyContent:'space-evenly',color:'#fff'}}>
            <Text style={{width:150,fontSize:16,color:'#fff'}}>Shipping Party:</Text><Text style={{color:'#fff'}}>{shippingParty}</Text></View>      
          <View style={{flexDirection:'row',justifyContent:'space-evenly',color:'#fff'}}>
            <Text style={{width:150,fontSize:16,color:'#fff'}}>Billing Party:</Text><Text style={{color:'#fff',}}>{coustName}</Text></View>      

                    </View> */}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => {
            if (ItemWiseCheck == false) {
              setItemWiseCheck(true);
              setBCNWise(false)
            }
            // if(ItemWiseCheck ==true){
            //   setItemWiseCheck(false);
            //   setBCNWise(true);
            //   setIcode('')
            // }else{
            //   setItemWiseCheck(true);
            //   setBCNWise(false);
            // }
          }}  >
            <RedioBtn BtType={'Item Wise'} CheckType={ItemWiseCheck} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if (BCNWise == false) {
              setBCNWise(true)
              setItemWiseCheck(false);
              setIcode('')
            }
            // if(BCNWise ==true){
            //   setBCNWise(false);
            //   setItemWiseCheck(true);

            // }else{
            //   setBCNWise(true);
            //   setItemWiseCheck(false);
            //   setIcode('')
            // }
          }}  >
            <RedioBtn BtType={'BCN Wise'} CheckType={BCNWise} />
          </TouchableOpacity>
        </View>
        {ItemWiseCheck == true ? <View >
          <View style={{}}>
            <View style={{
              marginTop: 10, width: '100%', backgroundColor: '#ADB0B0',
              height: 60, justifyContent: 'center'
            }}>
              <SearchBar
                style={{ height: 40, width: '90%', backgroundColor: '#fff', borderWidth: 1, borderRadius: 5 }}
                placeholder="Search Department"
                defaultValue={searchValue}
                onChangeText={text => { searchFilterFunction(text) }}
                onClearPress={() => {
                  setSearchValue('')
                  setDepartmentObj({ ...DepartmentObj, DepartmentData: [], Departmentname: '', DepartmentCode: '' })
                  // setShipingDT([]),setCustomerName(''),setCustCode('')
                }}
                onClear={text => {
                  setSearchValue('')
                  searchFilterFunction('');
                  setDepartmentObj({ ...DepartmentObj, DepartmentData: [], Departmentname: '', DepartmentCode: '' })
                  // searchFilterFunction(''),setCustomerName(''),setCustCode('')
                }}
              />


            </View>
            {DepartmentObj.DepartmentData.length > 0 ?
              <View style={{ maxHeight: 250 }}>
                <FlatList keyboardShouldPersistTaps={'handled'}
                  data={DepartmentObj.DepartmentData} renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          Keyboard.dismiss();
                          setSearchValue(item.Name)
                          callItemMasterAPI(BaseURL, CompCode, Fy, 6, item.Code)
                          setDepartmentObj({
                            ...DepartmentObj, DepartmentCode: item.Code, Departmentname: item.Name,
                            DepartmentData: [], SearchDepartment: item.Name
                          })
                        }}
                        style={{ borderBottomWidth: 1, justifyContent: 'center', marginTop: 5 }}>
                        <Text style={{ fontSize: 18, padding: 5 }}>{item.Name}</Text>
                      </TouchableOpacity>
                    )
                  }} />
              </View>
              : null}

          </View>
          {/* <SerchComponent PlacHolder={'Search Item Here...'} data={ItemData} masterDataSource={ItemData} 
                    value={Iname} setname={(text)=>{setIname(text)}} setIcode={(Icode)=>{setIcode(Icode)}} /> */}
          {DepartmentObj.DepartmentCode !== '' ? <SerchComponent PlacHolder={'Search Item Here...'} data={ItemData} masterDataSource={ItemData}
            value={Iname} setname={(text) => { setIname(text) }} setIcode={(Icode) => { setIcode(Icode) }} /> : null}

          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <TouchableOpacity style={{ width: '50%', backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}
              onPress={() => {
                CleartData()
              }}
            >
              <ButtonComponent type={'Cancel'} style={{}} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '50%', backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}
              onPress={() => {
                CallAPI(BaseURL, 0, Icode, CompCode, Fy);
              }}
            >
              <ButtonComponent type={'Load'} style={{}} />
            </TouchableOpacity>
          </View>
        </View> : <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', }}>

          <TouchableOpacity style={{ margin: 10 }} onPress={() => { navigation.replace('ScanItem', { Id: 1, OType: OType, BStation: BStation }) }}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1341/1341632.png' }} style={{ height: 25, width: 25, tintColor: '#000', height: 30, width: 30 }} />
          </TouchableOpacity>
        </View>}


        <ScrollView>
          <View style={{}}>
            <FlatList data={ItemGroupData} keyExtractor={(item, index) => item.ItemCode} renderItem={(Item) => {
              // console.log(item)
              return (
                <>
                  <View style={{ flexDirection: 'row', padding: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: '300', width: 100 }}>Item Name:</Text>
                    <Text style={{ margin: 4 }}>{Item.item.ItemName}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', borderWidth: 0.3, borderColor: '#6F716E' }}>
                    <View style={{ width: '60%', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '300', width: 100 }}>Color:</Text>
                        <Text style={{ margin: 4 }}>{Item.item.IColor}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '300', width: 100 }}>Size:</Text>
                        <Text style={{ margin: 4 }}>{Item.item.ISize}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '300', width: 100 }}>Price:</Text>
                        <Text style={{ margin: 4 }}>{parseFloat(Item.item.IPrice).toFixed(2)}</Text>
                      </View>
                    </View>
                    {showImage ? <View style={{ width: '40%', height: 100, borderWidth: 0.3, borderColor: '#999B97' }}>
                      <Image source={{ uri: 'https://www.pngkit.com/png/detail/259-2599990_mens-kurta-with-churidar-royal-blue-mens-kurta.png' }} style={{ height: '100%', width: '100%', paddingTop: 5 }} />
                    </View> : null}

                  </View>
                  <FlatList
                    data={Item.item.IColorDT}
                    // extraData={exData}
                    renderItem={({ item, index }) => {
                      // console.log(item)
                      return (
                        <View style={{ width: '100%', }}>
                          <TouchableOpacity
                            onPress={() => {
                              if (Item.item.IColorDT[index]["showSizeData"] == false) {
                                Item.item.IColorDT[index]["showSizeData"] = true;
                              } else {
                                Item.item.IColorDT[index]["showSizeData"] = false;

                              }
                              setChecked(!checked);
                            }}
                            style={{
                              alignItems: 'center', justifyContent: 'space-between', height: 50,
                              borderBottomWidth: 1, flexDirection: 'row', padding: 5, backgroundColor: '#929591', marginTop: 5
                            }}>
                            <Text style={style.itemSty}>{item.Color}</Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={[style.itemSty, { margin: 3 }]}>Select All</Text>
                              <Checkbox
                                color='#F39505'
                                uncheckedColor='#fff'
                                status={Item.item.IColorDT[index]["CheckAppVal"] ? 'checked' : 'unchecked'}
                                onPress={() => {
                                  // console.log(Item.item.IColorDT[index]["CheckAppVal"] )
                                  if (Item.item.IColorDT[index]["CheckAppVal"] == false) {
                                    Item.item.IColorDT[index]["CheckAppVal"] = true;
                                    Item.item.IColorDT[index]["SizeDT"].forEach(function (obj) {
                                      obj.checkVal = true
                                      obj.Qty = 1


                                    })
                                  } else {
                                    Item.item.IColorDT[index]["CheckAppVal"] = false;
                                    Item.item.IColorDT[index]["SizeDT"].forEach(function (obj) {
                                      obj.checkVal = false
                                      obj.Qty = 0


                                    })
                                  }
                                  setChecked(!checked);
                                }}
                              />
                            </View>
                            {Item.item.IColorDT[index]["CheckAppVal"] == true ? <View style={{ flexDirection: 'row' }}>
                              <Text style={style.itemSty}>Qty:</Text>
                              <TextInput keyboardType={'numeric'} defaultValue={Item.item.IColorDT[index]["SecQty"].toString()}
                                value={Item.item.IColorDT[index]["SecQty"]}
                                style={{ height: 30, width: 40, borderWidth: 1, padding: 5, borderColor: '#fff' }}
                                onChangeText={(text) => {
                                  setQty(text);
                                  Item.item.IColorDT[index]["SizeDT"].forEach(function (obj) {
                                    if (text == '') {
                                      obj.Qty = 0;
                                      obj.checkValue = true
                                    } else {
                                      if (global.FairOrder == 0) {
                                        if (text > obj.GStock + obj.SStock) {
                                          alert('Stock is less in Some Size ');
                                          // setQty('');
                                          // obj.Qty=parseInt(text);
                                          obj.checkValue = true
                                          obj.Qty = obj.GStock + obj.SStock
                                        } else {
                                          obj.Qty = parseInt(text);
                                          obj.checkValue = true
                                        }
                                      } else {
                                        obj.Qty = parseInt(text);
                                        obj.checkValue = true
                                      }

                                    }

                                  })
                                }}
                              />
                            </View> : <></>}
                          </TouchableOpacity>
                          {item.showSizeData == true ? itemDetailsFunc(index, item.Color, Item.item.IColorDT[index]["CheckAppVal"], Item.item.IColorDT, index1 = Item.index) : null
                          }
                        </View>
                      )

                    }} />

                </>

              )
            }} />

          </View>


          {/* <View style={{}}> */}

          {/* </View> */}
        </ScrollView>

        <View style={{ justifyContent: 'flex-end' }}>
          {incCard > 0 ? <View style={{ alignItems: 'flex-end' }}>
            <RNBounceable onPress={() => {
              sendNotification(1)
            }} style={{ paddingRight: 10 }}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9418/9418084.png' }} style={{ height: 35, width: 35 }} />
            </RNBounceable>
          </View> : null}

          <View style={{ flexDirection: 'row' }}>
            {OType !== 2 && incCard !== 0 ?
              <TouchableOpacity onPress={() => {
                navigation.navigate('CartList', { BCN: BCN })
              }} style={{ alignItems: 'center', width: '50%', backgroundColor: '#F0B91C', borderWidth: 1, borderColor: '#fff', padding: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'red' }}>{incCard}</Text>

                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1008/1008010.png' }} style={{ height: 30, width: 30, tintColor: '#fff' }} />
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, padding: 5 }}>Go To Cart</Text>
                </View>
              </TouchableOpacity> : <></>}
            <TouchableOpacity disabled={CartBtnDisable} onPress={() => {
              AddToCart()
            }} style={{ alignItems: 'center', width: '50%', backgroundColor: 'green', borderWidth: 1, borderColor: '#fff', padding: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4556/4556018.png' }} style={{ height: 30, width: 30, tintColor: '#fff' }} />
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, padding: 5 }}>Add To Cart</Text>
              </View>
            </TouchableOpacity>
          </View>


        </View>

        <Modal visible={VisibleItemRemark} transparent={true} >
          <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              setVisibleItemRemark(!VisibleItemRemark)
            }}
          >
            <Pressable style={{ backgroundColor: '#EDECEB', minHeight: 200, width: '95%', elevation: 5 }} >
              <Text style={{ marginTop: 10, marginLeft: 10, fontWeight: '700', fontSize: 16 }}>Item Remarks</Text>
              <TextInput maxLength={50} placeholder='Enter Remarks' style={[styles.textInputsty, { height: Math.max(10, height), minHeight: 50, fontSize: 15 }]} multiline={true}
                value={ItemRemark}
                onContentSizeChange={(event) =>
                  setHeight(event.nativeEvent.contentSize.height)}
                onChangeText={(text) => {
                  setItemRemark(text)
                }}
              />
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => {
                  setVisibleItemRemark(!VisibleItemRemark)
                  SaveOrder()
                }} style={{ alignItems: 'center', width: '50%', backgroundColor: '#000', borderWidth: 1, borderColor: '#fff', padding: 5 }}>
                  <View style={{ flexDirection: 'row' }}>
                    {/* <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/4556/4556018.png'}} style={{height:30,width:30,tintColor:'#fff'}} /> */}
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, padding: 5 }}>Save Order</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </Pressable>
          </Pressable>
        </Modal>
        <Modal visible={AddCartGif} transparent={true}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: 'https://i.pinimg.com/originals/66/22/ab/6622ab37c6db6ac166dfec760a2f2939.gif' }} style={{ height: 80, width: 80, }} />
          </View>
        </Modal>
        <Modal visible={showModal} transparent={true} animationType={'slide'}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ height: 40, backgroundColor: '#fff', alignItems: 'center', width: '50%', justifyContent: 'center', elevation: 5, borderRadius: 5 }}>
              <Text>{showAlertMsg}</Text>
            </View>
          </View>
        </Modal>
        <Modal visible={isLoading}  >
          <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} transparent={true} >
            <ActivityIndicator size={'large'} />
            <Text style={{ fontSize: 15 }}>Please Wait..</Text>
          </View>
        </Modal>
      </View>


    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  headerViewSty: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerCapctionSty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    width: '30%'
  },
  textInputsty: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: 'gray'
    // backgroundColor: '#A2A7A8', 


  }

});

export default ScanItemScreen;