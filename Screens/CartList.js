import {
  ActivityIndicator, Image, StyleSheet, Text, View,
  SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, Alert, Modal, Button, Keyboard, ScrollView, Pressable
} from 'react-native'
import React, { useState, useEffect, useMemo, useRef, } from 'react';
import { filterByText } from './Components/useDebounce';
import DefaultPreference from 'react-native-default-preference';
import SearchBar from "react-native-dynamic-search-bar";
import RNBounceable from '@freakycoder/react-native-bounceable';
import ToasterMsg from './Components/ToasterMsg';

//main component Start here
const CartList = ({ navigation, route }) => {
  const [editmodalshow, setEditModalShow] = useState(false)
  const [editableData, setEditableData] = useState({})
  const [cartListData, setCartListData] = useState([]);
  const [BaseURL, setBaseURL] = useState('');
  const [CompCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [VchCode, setVchCode] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [CustName, setCustName] = useState('');
  const [ShipTo, setShipTo] = useState('');
  const [StoreQty, setStoreQty] = useState();
  const [ItemName, setItemName] = useState('');
  const [Defaultdata, setdefalutData] = useState([]);
  const [Remark, setRemark] = useState('');
  const [RemarkModal, setRemarkModal] = useState(false);
  const [Transporter, setTransporter] = useState('');
  const [GtotalAmount, setGTotalAmount] = useState(0);
  const [GtotalQty, setGtotalQty] = useState(0);
  const [CartData, setCartData] = useState([]);
  const [PriViousInd, setPriviousInd] = useState(0);
  const [newindex, setnewindex] = useState(0);
  const [ArrOnyForDelete, setArrOnyForDelete] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [exData, setExData] = useState(0);
  const [EditRemarkVal, setEditRemarkVal] = useState(0);
  const [ItemCode, setItemCode] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {

    DefaultPreference.get('Remarks').then(function (Remarks) {
      setRemark(Remarks)
    });
    DefaultPreference.get('Transport').then(function (Tran) {
      setTransporter(Tran);
    })
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('VchCode').then(function (VchCode) {
            DefaultPreference.get('ShippingParty').then(function (shippingParty) {
              DefaultPreference.get('Partyname').then(function (CustName) {
                setShipTo(shippingParty);
                setVchCode(VchCode);
                setCustName(CustName)
                setBaseURL(BaseURL);
                setCompCode(compCode);
                setFy(Fy);
                setVchCode(VchCode);
                setIsloading(true);
                CallAPI(BaseURL, compCode, Fy, VchCode);
              });
            });
          });
        });
      });
    });
    //  
  }, []);

  const ShowCount = async (BaseURL, CompCode, Fy, VchCode) => {
    console.log(BaseURL + '/api/Values/GetOrderKartDetail?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode);
    const res = await fetch(BaseURL + '/api/Values/GetOrderKartDetail?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode);
    const response = await res.json();
    if (response.Status == 1) {
      DefaultPreference.set('InCartVal', response.Data.Qty.toString())
      // setIncCard(response.Data.Qty)
    }
  }

  // --------------------------Call Api
  const CallAPI = async (BaseURL, compCode, Fy, VchCode) => {
    try {
      setIsloading(true)
      console.log(BaseURL + '/api/Values/GetCustomerOrderKartItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&FairOrder=' + global.FairOrder);
      const res = await fetch(BaseURL + '/api/Values/GetCustomerOrderKartItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&FairOrder=' + global.FairOrder);
      const response = await res.json();
      setIsloading(false);
      if (response.Status == 1) {
        setCartListData(response.Data);
        setCartData(response.Data);
        ShowCount(BaseURL, compCode, Fy, VchCode);
        setdefalutData(response.Data);
        let totalQty = 0;
        let TotalAmount = 0
        response.Data.map((Datamap) => {
          Datamap.OKartItemDT.map((ItemMap) => {
            totalQty = totalQty + ItemMap.Qty
            TotalAmount = TotalAmount + ItemMap.Amount
            // setGTotalAmount(GtotalAmount+ItemMap.Amount);
            // setGtotalQty(GtotalQty+ItemMap.Qty)
          })
        })

        setGtotalQty(totalQty);
        setGTotalAmount(TotalAmount);
      }
    } catch (e) {
      setIsloading(false);
      Alert.alert('catch Error' + e);
    }
  }
  // ----------------------------Update Item Remarks
  const ChangeItemRemark = async (Remark) => {
    try {
      // console.log(BaseURL + '/api/Values/UpdateOrderItemRemarks?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&ItemCode=' + ItemCode + '&IRemarks=' + Remark,)
      const res = await fetch(BaseURL + '/api/Values/UpdateOrderItemRemarks?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&ItemCode=' + ItemCode + '&IRemarks=' + Remark,);
      const response = await res.json();
      if (response.Status == 1) {
        setRemarkModal(false);
        setRemark('');
        CallAPI(BaseURL, CompCode, Fy, VchCode);
        ToasterMsg(response.Msg)
        // alert(response.Msg);
      } else {
        alert(response.Msg);
      }
    } catch (e) {
      alert('Catch Error' + e)
    }




  }
  const UPdateRemarks = async () => {
    try {
      // console.log(BaseURL+'/api/Values/UpdateSalesmanOrdDT?CompCode='+CompCode+'&FY='+Fy+'&VchCode='+VchCode+'&Remarks='+Remark+'&Transport='+Transporter)
      const res = await fetch(BaseURL + '/api/Values/UpdateSalesmanOrdDT?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&Remarks=' + Remark + '&Transport=' + Transporter);
      const response = await res.json();
      if (response.Status == 1) {
        setRemarkModal(false);

        alert(response.Msg);
      } else {
        alert(response.Msg);
      }
    } catch (e) {
      alert('Catch Error' + e)
    }




  }
  // --------------------------Remove Order Api Call
  const RemoveOrderApi = async () => {
    try {
      setIsloading(true)
      // console.log(BaseURL+'/api/Values/RemoveOrder?CompCode='+CompCode+'&FY='+Fy+'&VchCode='+VchCode);
      const resp = await fetch(BaseURL + '/api/Values/RemoveOrder?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + VchCode);
      const response = await resp.json();
      setIsloading(false)
      if (response.Status == 1) {
        CallAPI(BaseURL, CompCode, Fy, VchCode);
      } else {
        alert(response.Msg)
      }


    } catch (e) {
      alert('Catch Error: ' + e)
    }
  }

  // Filter after the user pauses typing (setState must not run inside useMemo)
  const isFirstSearch = useRef(true);
  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (ItemName) {
        setCartListData(filterByText(CartData, ItemName, item => item.ItemName))
      } else {
        setCartListData(Defaultdata)
      }
    }, ItemName ? 250 : 0);
    return () => clearTimeout(timer);
  }, [ItemName]);
  //cart list details function

  // --------------------------Update List Api Call
  const UpdateOrderAPI = async (editableVal, Rtype) => {
    let obj = {}
    if (Rtype == 4) {
      obj = {
        VchCode: parseInt(VchCode),
        ItemCode: editableVal,
        Color: '',
        Size: '0',
        Qty: '',
      }
    } else {
      obj = {
        VchCode: parseInt(editableVal.VchCode),
        ItemCode: editableVal.ItemCode,
        Color: editableVal.Color,
        Size: editableVal.Size,
        Qty: editableVal.Qty,
        Amount: editableVal.Price * parseInt(editableVal.Qty),
        Price: editableVal.Price
      }

      cartListData[PriViousInd]['OKartItemDT'][newindex] = obj
    }

    // console.log(obj)
    const response = await fetch(BaseURL + '/api/Values/RemoveKartItem?CompCode=' + CompCode + '&FY=' + Fy + '&RType=' + Rtype, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
    const json = await response.json();
    setEditModalShow(false);
    // console.log(json)
    if (json.Status == 1) {
      if (Rtype == 4) {
        CallAPI(BaseURL, CompCode, Fy, VchCode)
      }
    }
  }
  // ---------------------------
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)

    }, 1000);
  }
  const cartListDetailsFunc = (ind, ItemCode, TAmount, TQty) => {
    //edit item function
    setArrOnyForDelete(cartListData[ind]);

    const EditItemDetails = (ind, index) => {
      setStoreQty(editableData.Qty);
      setEditModalShow(true)
      var locArr = cartListData

      setEditableData({
        Color: locArr[ind]['OKartItemDT'][index]['Color'],
        Size: locArr[ind]['OKartItemDT'][index]['Size'],
        Qty: locArr[ind]['OKartItemDT'][index]['Qty'].toString(),
        Amount: locArr[ind]['OKartItemDT'][index]['Amount'],
        Price: locArr[ind]['OKartItemDT'][index]['Price'],
        ItemCode: ItemCode,
        VchCode: VchCode
      })
    }

    //delete item function
    const DeleteItemDetails = (ind, index, item) => {
      const obj = {
        Color: item.Color,
        Size: item.Size,
        Qty: item.Qty,
        ItemCode: ItemCode,
        VchCode: VchCode
      }
      UpdateOrderAPI(obj, 2)


    }

    const RenderComponent1 = props => {
      return (
        <TextInput
          key={props.index}
          // style={style.EditInputSty}
          value={props.data[props.index].Qty.toString()}
          keyboardType="numeric"
          maxLength={7}
          onChangeText={(text) => {
            let newArray = [...props.data];
            if (parseInt(text) > newArray[props.index].Qty) {
              Alert.alert('Alert', 'Please Enter Qty is leass then Pending Qty', [
                {
                  text: 'OK',
                  onPress: () => newArray[props.index].Qty = '0',
                }

              ]);

              // alert('Please Enter Qty is leass then Pending Qty')
              // newArray[props.index].CCQty=0
              // text=''
              // newArray[props.index].CCQty= '0'
            } else {
              newArray[props.index].CCQty = text;
            }
          }}
        />
      );
    };


    return <FlatList
      keyboardShouldPersistTaps={'handled'}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      extraData={exData}
      keyExtractor={(item, index) => `_key${index.toString()}`}
      data={cartListData[ind]['OKartItemDT']}
      renderItem={({ item, index }) => {
        TAmount = item.Amount + TAmount;
        return (<TouchableWithoutFeedback onLongPress={() => {
          Alert.alert(
            "Are you sure for delete this item?",
            "",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Yes", onPress: () => {
                  DeleteItemDetails(ind, index, item);
                  ArrOnyForDelete.OKartItemDT.splice(index, 1);
                  setExData(exData + 1)
                  // handleRefresh();
                }
              }
            ]
          );
        }}


        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 1, borderWidth: 1, borderTopWidth: 0 }}>

            <View style={{ width: '25%', borderEndWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.Color}</Text>
            </View>

            <View style={{ width: '20%', borderEndWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{}}>{item.Size}</Text>
            </View>

            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'flex-end', borderEndWidth: 1, padding: 5 }}>
              <Text style={{ textAlign: 'right' }}>{item.Qty}</Text>
            </View>
            <View style={{ width: '25%', padding: 5, justifyContent: 'center', alignItems: 'flex-end', borderEndWidth: 1 }}>
              <Text style={{}}>{item.Amount}</Text>
            </View>
            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                // Keyboard.dismiss();
                setPriviousInd(ind);
                setnewindex(index)
                EditItemDetails(ind, index)
              }}>
                <Image
                  style={{ height: 25, width: 25, padding: 5 }}
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/128/61/61456.png' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>)

      }}
    />
  }




  //main component return data here
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{}}>
        <View style={{ backgroundColor: '#000', width: '100%', alignItems: 'flex-start', padding: 5, }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}><Text style={{ width: 100, fontSize: 16, color: '#fff' }}>Order Id:</Text><Text style={{ color: '#fff' }} >{VchCode}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', color: '#fff' }}><Text style={{ width: 100, fontSize: 16, color: '#fff' }}>Party Name:</Text><Text style={{ color: '#fff' }}>{CustName}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', color: '#fff' }}><Text style={{ width: 100, fontSize: 16, color: '#fff' }}>Ship To:</Text><Text style={{ color: '#fff' }}>{ShipTo}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', color: '#fff' }}><Text style={{ width: 100, fontSize: 16, color: '#fff' }}>Total Qty:</Text><Text style={{ color: '#fff' }}>{GtotalQty}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', color: '#fff' }}><Text style={{ width: 100, fontSize: 16, color: '#fff' }}>Total Amount:</Text><Text style={{ color: '#fff', margin: 3 }}>{GtotalAmount}</Text></View>

          {/* <View style={{alignItems:'flex-end',margin:5,width:'95%'}}>
<TouchableOpacity style={{backgroundColor:'#fff',padding:10,borderRadius:7,}} onPress={()=>{
           Alert.alert(
            "Are you sure for delete All Order?",
            "",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Yes", onPress: () =>RemoveOrderApi() }
            ]
          );
            
           }}>
        <Text style={{color:'#000'}}>Remove All Order</Text>
        </TouchableOpacity>
        </View> */}
          <View style={{ alignItems: 'flex-end', width: '95%', }}>
            <TouchableOpacity
              onPress={() => {
                setEditRemarkVal(0);
                setRemarkModal(true)
              }}
              style={{ backgroundColor: '#fff', padding: 7, borderRadius: 5 }}>
              <Text style={{ color: '#000', fontSize: 15 }}>Edit Remarks</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          marginTop: 7, width: '100%', backgroundColor: '#ADB0B0',
          height: '8%', justifyContent: 'center'
        }}>
          <SearchBar style={{ width: '90%', backgroundColor: '#fff', borderWidth: 1, borderRadius: 5 }}
            placeholder={"Search Item..."}
            value={ItemName}
            onChangeText={text => {
              setItemName(text)
              // searchFilterFunction(text)
            }}
            onClearPress={() => {
              setItemName('')
              setCartListData(cartListData)
              setCartListData(CartData)
              // Keyboard.dismiss();
            }}
            keyboardShouldPersistTaps='handled'
            onClear={text => {
              setItemName(text);
              setCartListData(cartListData);
            }}
          />
        </View>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          style={{
            height: '65%',
            flexGrow: 0
          }}
          keyExtractor={(item, index) => `_key${index.toString()}`}

          data={cartListData}
          renderItem={({ item, index }) => {
            let TAmount = 0;
            let TQty = 0
            {
              item.OKartItemDT.map((ColorData) => {
                TAmount = ColorData.Amount + TAmount;
                TQty = parseInt(ColorData.Qty) + TQty
              })
            }
            return <View style={{}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <View style={{ width: '70%' }} >
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>Item Name: </Text>
                    <Text style={{ width: "80%", padding: 2, alignSelf: 'center', color: 'red', fontSize: 13, fontWeight: 'bold' }}>{item.ItemName}</Text>
                  </View>
                  <RNBounceable
                    onPress={() => {
                      setItemCode(item.ItemCode);

                      Alert.alert('Hold !', 'Do You Want To Remove Remark on This Item', [
                        {
                          text: 'No',
                          onPress: () => {
                            console.log('Cancel Pressed'),
                              setRemark('')
                          },
                          style: 'cancel',
                        },
                        { text: 'YES', onPress: () => ChangeItemRemark('.') },
                      ]);
                    }}
                    style={{ backgroundColor: '#000', width: '50%', height: 30, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}> Remove Remark</Text>

                  </RNBounceable>

                </View>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Are you sure for delete item?",
                      "",
                      [
                        {
                          text: "No",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        { text: "Yes", onPress: () => UpdateOrderAPI(item.ItemCode, 4) }
                      ]
                    );
                  }}
                  style={{ padding: 5, backgroundColor: 'red', borderRadius: 5, margin: 5 }} >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>Remove</Text>
                </TouchableOpacity>
                <View>
                  <RNBounceable
                    onPress={() => {
                      if (item.IRemarks !== '.') {
                        setRemark(item.IRemarks)
                      }
                      setEditRemarkVal(1);
                      setItemCode(item.ItemCode);

                      setRemarkModal(true);
                    }}
                  >
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828911.png' }} style={{ height: 20, width: 20 }} />
                  </RNBounceable>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5, borderWidth: 1, backgroundColor: 'black', width: '100%' }}>
                <View style={{ width: '25%', borderEndWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Color</Text>
                </View>
                <View style={{ width: '15%', borderEndWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Size</Text></View>
                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Qty</Text></View>
                <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Amount</Text></View>
                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Edit</Text></View>
              </View>

              {
                cartListDetailsFunc(index, item.ItemCode, TAmount, TQty)
              }
              <View style={{ backgroundColor: '#CCD1D1', flexDirection: 'row', borderBottomWidth: 1, borderRightWidth: 1, borderLeftWidth: 1 }}>
                <Text style={{ padding: 7, width: '25%', borderRightWidth: 1, fontSize: 18, fontWeight: '700', color: '#000' }}>Total</Text>
                <View style={{ width: '20%', borderRightWidth: 1 }}>

                </View>
                <View style={{ width: '15%', borderRightWidth: 1, alignItems: 'flex-end', padding: 5, }}>
                  {/* {setGtotalQty(TQty+GtotalQty)} */}
                  <Text style={{ color: '#873600', fontSize: 15, fontWeight: '600' }}>{TQty}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', padding: 5, width: '25%', borderRightWidth: 1, }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#873600', }}>{TAmount}</Text>
                </View>
              </View>
            </View>

          }}
        />
        <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', }}>
          <View style={{ bottom: 10, padding: 8, right: 10, backgroundColor: 'black', borderRadius: 5, marginTop: 10 }}>
            <TouchableOpacity onPress={() => {
              Alert.alert(
                "Are you sure for delete All Order?",
                "",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => RemoveOrderApi() }
                ]
              );

            }}>
              <Text style={{ color: 'white' }}>Remove All Order</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>


      {/* edit item details modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editmodalshow}
        onRequestClose={() => {
          setEditModalShow(!editmodalshow)
        }}
      >

        <Pressable onPress={() => {
          setEditModalShow(!editmodalshow)
        }} style={styles.centeredView}>
          <Pressable onPress={() => {
            setEditModalShow(editmodalshow)
          }} style={styles.modalView}>
            <View style={{ flexDirection: 'row', margin: 5 }}>
              <Text style={{ alignSelf: 'center' }}>Color:</Text>
              <Text style={{ padding: 0, paddingHorizontal: 5, borderWidth: .2, width: 100, marginHorizontal: 10 }}>{editableData.Color}</Text>
            </View>
            <View style={{ flexDirection: 'row', margin: 5 }}>
              <Text style={{ alignSelf: 'center' }}>Size:</Text>
              <Text style={{ padding: 0, paddingHorizontal: 5, borderWidth: .2, width: 100, marginHorizontal: 10 }} >{editableData.Size}</Text>
            </View>
            <View style={{ flexDirection: 'row', margin: 5 }}>
              <Text style={{ alignSelf: 'center' }}>Qty:</Text><TextInput
                // editable={editable}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  setEditableData({ ...editableData, Qty: text })
                  // setStoreQty(editableData.Qty);

                }}
                value={editableData.Qty} style={{ padding: 0, paddingHorizontal: 5, borderWidth: .2, width: 100, marginHorizontal: 10 }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button title='Update' color={'#000'} onPress={() => {
                UpdateOrderAPI(editableData, 1)
              }} />
            </View>
          </Pressable>
        </Pressable>


      </Modal>
      <Modal visible={RemarkModal} transparent={true} onRequestClose={() => {
        setRemarkModal(false);
        setRemark('')
      }}>
        <Pressable onPress={() => {
          setRemarkModal(false);
          setRemark('')
        }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => {
            setRemarkModal(true)
          }} style={{ backgroundColor: '#CCD1D1', width: '80%', borderRadius: 10, elevation: 10,height:'50%' }}>
            <View style={{ alignItems: 'center', backgroundColor: '#000', borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: '500', padding: 5 }}>{EditRemarkVal == 0 ? 'Edit Party Remarks' : 'Edit Item Remarks'}</Text>
            </View>
            <ScrollView>
              {EditRemarkVal == 0 ? <>
                <View style={{ flexDirection: 'row', paddingLeft: 10, marginTop: 10 }}>
                  <Text style={{ color: '#000' }}>Party Name:</Text>
                  <Text style={{ width: '60%', marginLeft: 7, color: '#000' }}>{CustName}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 10, marginTop: 10 }}>
                  <Text style={{ color: '#000' }}>Ship To:</Text>
                  <Text style={{ width: '60%', marginLeft: 7, color: '#000' }}>{ShipTo}</Text>
                </View>
                <Text style={{ color: '#000', paddingLeft: 10, marginTop: 10 }}>Transporter:</Text>
                <View style={{ alignItems: 'center' }}>
                  <TextInput placeholder='Transporter' value={Transporter} onChangeText={(text) => {
                    setTransporter(text)
                  }}
                    style={{ width: '95%', borderRadius: 10, borderWidth: 1, minHeight: 30, maxHeight: 100 }} multiline={true} numberOfLines={2} />
                </View>
              </> : null}



              <Text style={{ color: '#000', paddingLeft: 10, marginTop: 10 }}>Remark:</Text>
              <View style={{ alignItems: 'center' }}>
                {/* <TextInput placeholder='Remark' value={Remark} onChangeText={(text) => {
                  setRemark(text)
                }}
                  style={{ width: '95%', borderRadius: 10, borderWidth: 1 }} multiline={true} numberOfLines={2} /> */}
                <TextInput placeholder='Remarks' style={[styles.textInputsty, { height:100,  fontSize: 15 ,}]}
                  maxLength={100}
                  multiline={true}
                  value={Remark}
                  onContentSizeChange={(event) =>
                    setHeight(event.nativeEvent.contentSize.height)}
                  onChangeText={(text) => {
                    setRemark(text)
                  }}
                />
              </View>
            </ScrollView>

            <View style={{ alignItems: 'center', padding: 5 }}>
              <TouchableOpacity
                onPress={() => {

                  if (EditRemarkVal == 1) {
                    ChangeItemRemark(Remark)
                  } else {
                    DefaultPreference.set('Transport', Transporter)
                    DefaultPreference.set('Remarks', Remark);
                    UPdateRemarks()
                  }
                }}
                style={{ backgroundColor: '#000', padding: 7, marginTop: 5, borderRadius: 5 }}>
                <Text style={{ color: '#fff' }}>{EditRemarkVal == 0 ? 'Save Details' : 'Update Remarks'} </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={isLoading} >
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} transparent={true} >
          <ActivityIndicator size={35} />
          <Text>Please Wait...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default CartList

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  textInputsty: {
    width: '80%',
    backgroundColor: '#A2A7A8', margin: 5,
    borderRadius: 10, padding: 10,

  }

})