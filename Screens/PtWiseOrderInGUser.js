let TrfQty = 0
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BackHandler, View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert, Modal, TextInput, Pressable, StyleSheet } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { style } from "./style";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Tts from 'react-native-tts';
import { ActivityIndicator } from "react-native";
let datalength = false;

const RenderFirtsList = React.memo(({ item, index, refVal, setvalue }) => {

  return <View key={index} style={{ marginBottom: 10 }}>
    <Text style={[style.salesmantextsty, { fontSize: 16, fontWeight: '600' }]}> {index+1+'.  ' + item.ItemName}</Text>
    {item.IRemarks !== '' ? <Text style={[style.salesmantextsty, { fontSize: 12, fontWeight: '600', paddingLeft: 5, color: '#1b8c02' }]}>{item.IRemarks}</Text> : null}


    <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40 }}>
    <View style={{ width: '10%', borderRightWidth: 1, borderColor: '#fff' }}>
        <Text style={[style.headerText,]} >Sr No.</Text>
      </View>
      <View style={{ width: '30%', borderRightWidth: 1, borderColor: '#fff' }}>
        <Text style={[style.headerText,]} >Color</Text>
      </View>
      <View style={{ width: '25%', borderRightWidth: 1, borderColor: '#fff' }}>
        <Text style={[style.headerText,]} >Size</Text>
      </View>
      <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#fff' }}>
        <Text style={[style.headerText,]} >Qty</Text>
      </View>
      <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#fff' }}>
        <Text style={[style.headerText,]} >T-Qty</Text>
      </View>

    </LinearGradient>
    {itemData(item, refVal, setvalue)}

  </View>


})
const itemData = (Item, refVal, setvalue) => {

  return <FlatList extraData={refVal} keyExtractor={(obj,index)=>index.toString()}  data={Item.ItemParamDT}
    renderItem={({ item, index }) => {
      // console.log(item)
      return <View key={index}>
        <TouchableOpacity onPress={() => {
          let obj = { itemCode: Item.ItemCode, Color: item.Color, Size: item.Size }
          setvalue(obj)
          // ItemRackChecking(B_URL, C_Code, Fyear, Item.ItemCode, item.Color, item.Size)
        }}
        style={item.StockAvailable == 1 &&item.Stock > 1 ? { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40, backgroundColor: '#bdf39a' } 
        :item.StockAvailable == 1 && item.Stock==1 ? { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40,backgroundColor: '#f9f6ab' }:{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, height: 40, }}>
         <View style={{ width: '10%', borderRightWidth: 1, borderColor: '#000',alignItems:'center' }}>
          <Text style={style.salesmantextsty}>{index+1 }.</Text>
         </View>
          <View style={{ width: '30%', borderRightWidth: 1, borderColor: '#000', }}>
            <Text style={style.salesmantextsty} >{item.Color}</Text>
            {item.ParamBCN.length > 0 ? <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => {
                if (Item.ItemParamDT[index]["ShowBCN"] == false) {
                  Item.ItemParamDT[index]["ShowBCN"] = true;
                } else {
                  Item.ItemParamDT[index]["ShowBCN"] = false;
                }
                setChecked(!checked);
              }} >
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2985/2985150.png' }} style={{ height: 15, width: 15, margin: 5, tintColor: '#000' }} />
              </TouchableOpacity>
            </View> : null}

          </View>
          <View style={{ width: '25%', borderRightWidth: 1, borderColor: '#000' }}>
            <Text style={[style.salesmantextsty,]} >{item.Size}</Text>
          </View>
          <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#000' }}>
            <Text style={[style.salesmantextsty,]} >{item.Qty}</Text>
          </View>
          <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#000' }}>
            <Text style={[style.salesmantextsty,]} >{item.TfrQty}</Text>
          </View>


        </TouchableOpacity>
        {Item.ItemParamDT[index]["ShowBCN"] == true ? <View style={{}}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '20%', backgroundColor: '#000', borderRightWidth: 1, borderColor: '#fff', }}>
              <Text style={{ color: '#fff', padding: 5 }}>SrNo.</Text>
            </View>
            <View style={{ width: '60%', backgroundColor: '#000', borderRightWidth: 1, borderColor: '#fff', }}>
              <Text style={{ color: '#fff', padding: 5 }}>BCN</Text>
            </View>
            <View style={{ width: '20%', backgroundColor: '#000', borderRightWidth: 1, borderColor: '#fff', }}>
              <Text style={{ color: '#fff', padding: 5 }}>Qty</Text>
            </View>
          </View>
          <FlatList data={item.ParamBCN}
          keyExtractor={(item,index)=>index.toString()}
            renderItem={(Item) => {
              return (
                <View key={Item.index} style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                  <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#000', padding: 5 }}>{Item.index + 1}.</Text>
                  </View>
                  <View style={{ width: '60%', borderRightWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#000', padding: 5 }}>{Item.item.BCN}</Text>
                  </View>
                  <View style={{ width: '20%', borderRightWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#000', padding: 5 }}>{item.Qty}</Text>
                  </View>
                </View>
              )
            }}
          />
        </View>
          : null
        }
      </View>

    }}
  />

}


let arrLength = 8;
let arrLength2 = 18;
let arrLength3 = 24;
let arrLength4 = 32;
let arr1 = []
let arr2 = []
let arr3 = []
let arr4 = []
let arr5 = []

const STOCK_ERROR = 'Transfer quantity cannot exceed available stock.';

// All items of the order across List 1-5, each item object only once.
const allItems = () => [...new Set([...arr1, ...arr2, ...arr3, ...arr4, ...arr5])];

const lineKey = (itemCode, row) => itemCode + '|' + String(row.Color).toUpperCase() + '|' + row.Size;

// Source godown stock for one row; StockAvailable 0 means no stock.
const rowStock = (row) => (row.StockAvailable == 0 ? 0 : Math.max(0, parseInt(row.Stock) || 0));

// Transfer qty already entered for an item/color/size; duplicate rows of the same product share one stock.
const enteredQty = (key) => {
  let total = 0;
  allItems().forEach(item => {
    item.ItemParamDT.forEach(row => {
      if (lineKey(item.ItemCode, row) === key) {
        total = total + (parseInt(row.TfrQty) || 0);
      }
    });
  });
  return total;
};

const PtWiseOrderInGUser = ({ navigation }) => {
  // let Data=[];

  const scanRef = useRef(null);
  const submittingRef = useRef(false);
  const scansInFlight = useRef(new Set());
  const [checked, setChecked] = React.useState(false);
  const [HeaderInfo, setHeaderInfo] = useState({});
  const [Data, setData] = useState([]);
  const [ItemCode, setItemCode] = useState();
  const isFocused = useIsFocused();
  const [ind, setInd] = useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [ItemDT, setIItemDT] = useState([]);
  const [BaseURL, setBaseURL] = useState('');
  const [CompCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [BcnVal, setBcnVal] = useState('');
  const [Qty, setQty] = useState(0);
  const [Search, setSearch] = useState('');
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [voices, setVoices] = useState([]);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [ItemRackCheck, SetItemRackCheck] = useState([])
  const [isvisible, setisvisible] = useState(false)
  const [RefreshingVal, setRefreshingVal] = useState(0)
  const [checkArr1, setcheckArr1] = useState(true)
  const [checkArr2, setcheckArr2] = useState(false)
  const [checkArr3, setcheckArr3] = useState(false)
  const [checkArr4, setcheckArr4] = useState(false)
  const [checkArr5, setcheckArr5] = useState(false)

  useEffect(() => {
    DefaultPreference.get('ItemInfo').then(function (itemheaderInfo) {
      DefaultPreference.get('BaseURL').then(function (BaseUrl) {
        DefaultPreference.get('CompCode').then(function (compCode) {
          DefaultPreference.get('FY').then(function (Fy) {
            DefaultPreference.get('McCode').then(function (McCdoe) {
              DefaultPreference.get('BCNdata').then(function (BCNValue) {
                DefaultPreference.get('OneItemInfo').then(function (OneItemInfo) {
                  DefaultPreference.get('BCNdata').then(function (BCNVal) {
                    B_URL = BaseUrl, C_Code = compCode, Fyear = Fy
                    setHeaderInfo(JSON.parse(itemheaderInfo));
                    setBaseURL(BaseUrl)
                    setCompCode(compCode);
                    setFy(Fy)
                    if (BCNVal !== null) {

                      callScanAPI(BaseURL, compCode, Fy, BCNVal)

                    } else {
                      // if( BCNValue!=null){
                      // insertDataInList(JSON.parse(OneItemInfo))
                      // }else{
                      CallAPI(BaseUrl, compCode, Fy, JSON.parse(itemheaderInfo).VchCode, McCdoe);
                    }
                    //  }

                  });
                });
              });
            });
          });
        });
      });
    });
    const backAction = () => {
      if (datalength == true) {
        Alert.alert('Alert', 'you have started scanning  do you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES', onPress: () => {
              DefaultPreference.clear('GodownData')
              navigation.goBack();
            }
          },
        ]);
        return true;

      } else {

      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  // useEffect(() => {
  //   Tts.addEventListener(
  //     'tts-start',
  //     (_event) => setTtsStatus('started')
  //   );
  //   Tts.addEventListener(
  //     'tts-finish',
  //     (_event) => setTtsStatus('finished')
  //   );
  //   Tts.addEventListener(
  //     'tts-cancel',
  //     (_event) => setTtsStatus('cancelled')
  //   );
  //   Tts.setDefaultRate(speechRate);
  //   Tts.setDefaultPitch(speechPitch);
  //   Tts.getInitStatus().then(initTts);
  //   return () => {
  //     Tts.removeEventListener(
  //       'tts-start',
  //       (_event) => setTtsStatus('started')
  //     );
  //     Tts.removeEventListener(
  //       'tts-finish',
  //       (_event) => setTtsStatus('finished'),
  //     );
  //     Tts.removeEventListener(
  //       'tts-cancel',
  //       (_event) => setTtsStatus('cancelled'),
  //     );
  //   };
  // }, [])
  const ItemRackChecking = async (BaseURL, compCode, Fy, ItemCode, color, Size) => {
    // console.log(BaseURL + '/api/Values/ItemRackSearching?CompCode=' + compCode + '&FY=' + Fy + '&ItemCode=' + ItemCode + '&Color=' + color + '&Size=' + Size)
    try {
      setisLoading(true)
      console.log(BaseURL + '/api/Values/ItemRackSearching?CompCode=' + compCode + '&FY=' + Fy + '&ItemCode=' + ItemCode + '&Color=' + color + '&Size=' + Size)
      const res = await fetch(BaseURL + '/api/Values/ItemRackSearching?CompCode=' + compCode + '&FY=' + Fy + '&ItemCode=' + ItemCode + '&Color=' + color + '&Size=' + Size)
      const Response = await res.json();
      console.log(Response)
      setisLoading(false)
      if (Response.Status == 1) {

        if (Response.Data.length > 0) {
          SetItemRackCheck(Response.Data);
          setisvisible(true)

        } else {
          alert('Data Not Found')
        }
      }
    } catch (e) {
      alert('Catch Error' + e)
    }
  }
  const initTts = async () => {
    const voices = await Tts.voices();
    // console.log('Total Voice'+JSON.stringify(voices))
    const availableVoices = voices
      .filter((v) => !v.networkConnectionRequired && !v.notInstalled)
      .map((v) => {
        // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyy"+ JSON.stringify(v))
        return { id: v.id, name: v.name, language: v.language };
      });
    let selectedVoice = null;
    if (voices && voices.length > 0) {
      selectedVoice = voices[0].id;
      try {
        await Tts.setDefaultLanguage(voices[0].language);
      } catch (err) {
        //Samsung S9 has always this error:
        //"Language is not supported"
        // console.log(`setDefaultLanguage error `, err);
      }
      await Tts.setDefaultVoice(voices[0].id);
      setVoices(availableVoices);
      setSelectedVoice(selectedVoice);
      setTtsStatus('initialized');
    } else {
      setTtsStatus('initialized');
    }
  };
  useEffect(() => {
    DefaultPreference.get('BCNdata').then(function (BCNVal) {
      if (BCNVal !== null) {
        callScanAPI(BaseURL, CompCode, Fy, BCNVal)
      }
      // callScanAPI(BaseURL,CompCode,Fy,BCNVal)
    });

  }, [isFocused])

  const CallAPI = async (BaseURL, compCode, Fy, VchCode, McCdoe) => {
    console.log(BaseURL + '/api/Values/GetOrderTransferItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&IgrpCode=' + McCdoe)
    const res = await fetch(BaseURL + '/api/Values/GetOrderTransferItemDet?CompCode=' + compCode + '&FY=' + Fy + '&VchCode=' + VchCode + '&IgrpCode=' + McCdoe)
    const Resp = await res.json();
    setisLoading(false)
    if (Resp.Status == 1) {
      // Data= Resp.Data
      //  console.log(JSON.stringify(Resp.Data))
      Resp.Data.forEach(element => {
        element.ItemParamDT.forEach(BCNCheck =>
          BCNCheck.ShowBCN = false
        )
      });
      Resp.Data.map((item) => {
        // console.log(item)
        item.ItemParamDT.sort((firstItem, secondItem) => firstItem.Color - secondItem.Color);
      })

      DefaultPreference.get('GodownData').then(function (GodownData) {
        // Restore unsaved scans of this same order onto the fresh data, so stock values stay current
        // and every list is restored (saving only the open list duplicated items on submit).
        let saved = null;
        try {
          saved = GodownData !== null ? JSON.parse(GodownData) : null;
        } catch (e) {
          saved = null;
        }
        if (saved && saved.VchCode == VchCode && Array.isArray(saved.Data)) {
          Resp.Data.forEach((item, i) => {
            const savedItem = saved.Data[i];
            if (!savedItem || savedItem.ItemCode != item.ItemCode) {
              return;
            }
            item.ItemParamDT.forEach(row => {
              const savedRow = savedItem.ItemParamDT.find(r => lineKey(item.ItemCode, r) === lineKey(item.ItemCode, row));
              if (savedRow) {
                row.TfrQty = savedRow.TfrQty;
                row.ParamBCN = savedRow.ParamBCN;
              }
            });
          });
        } else if (GodownData !== null) {
          DefaultPreference.clear('GodownData');
        }

        arr1 = Resp.Data.slice(0, arrLength);
        arr2 = Resp.Data.slice(arrLength, arrLength2);
        arr3 = Resp.Data.slice(arrLength2, arrLength3);
        arr4 = Resp.Data.slice(arrLength3, arrLength4);
        arr5 = Resp.Data.slice(arrLength4, Resp.Data.length);

        setData(arr1);
        setcheckArr1(true);
        setcheckArr2(false);
        setcheckArr3(false);
        setcheckArr4(false);
        setcheckArr5(false);
      })

    } else {

    }
  }




  const callScanAPI = async (BaseURL, compCode, Fy, BCNVal) => {
    // The same scan can fire twice (onEndEditing + focus effect); count it only once.
    if (scansInFlight.current.has(BCNVal)) {
      return;
    }
    scansInFlight.current.add(BCNVal);
    try {
      await processScan(BaseURL, compCode, Fy, BCNVal);
    } catch (e) {
      alert('Catch Error' + e);
    } finally {
      scansInFlight.current.delete(BCNVal);
    }
  }

  const processScan = async (BaseURL, compCode, Fy, BCNVal) => {
    console.log(BaseURL + '/api/Values/SerachBCN?CompCode=' + compCode + '&FY=' + Fy + '&BCN=' + BCNVal)
    const res = await fetch(BaseURL + '/api/Values/SerachBCN?CompCode=' + compCode + '&FY=' + Fy + '&BCN=' + BCNVal)
    const response = await res.json();
    // console.log(response);
    // setBcnVal('')
    if (response.Status == 1) {
      let checkItemCode = Data.find(item =>
        item.ItemCode == response.ItemCode
      );
      if (checkItemCode !== undefined) {
        let checkColor = checkItemCode.ItemParamDT.find(item =>
          item.Color.toUpperCase() == response.Color.toUpperCase() && item.Size == response.Size
        )
        if (checkColor !== undefined) {
          // Prefer the stock returned with this scan (fresh) over the stock loaded with the order.
          const scanStock = parseInt(response.Stock);
          const stock = Number.isNaN(scanStock) ? rowStock(checkColor) : Math.max(0, scanStock);
          if (enteredQty(lineKey(checkItemCode.ItemCode, checkColor)) + 1 > stock) {
            alert(STOCK_ERROR);
            setBcnVal('')
            scanRef.current.focus();
            DefaultPreference.clear('BCNdata')
            return;
          }
          TrfQty = (parseInt(checkColor.TfrQty) || 0) + 1
          if (parseInt(checkColor.TfrQty) < parseInt(checkColor.Qty)) {
            checkColor.TfrQty = TrfQty;
            let obj = {
              BCN: BCNVal,
              Qty: 1,
            }
            datalength = true;

            checkColor.ParamBCN.push(obj)
            onRefresh();
            setRefreshingVal(RefreshingVal + 1)
            DefaultPreference.set('GodownData', JSON.stringify({ VchCode: HeaderInfo.VchCode, Data: allItems() }))
            DefaultPreference.clear('BCNdata');
            setBcnVal('')
            scanRef.current.focus();

            TrfQty = 0
          } else {
            TrfQty = 0
            alert('Transfer qty must be less than qty');
            setBcnVal('')
            scanRef.current.focus();
            DefaultPreference.clear('BCNdata')
          }

        }
      } else {
        // Tts.stop();
        // Tts.speak('Item Not Found');
        Alert.alert('Alert', 'Item Not Found',
          [{
            text: 'OK', onPress: () => {
              alert('Item Not Found')
              DefaultPreference.clear('BCNdata');
              setBcnVal('')
              scanRef.current.focus();
            }
          }])

      }
    } else {
      // Tts.stop();
      // Tts.speak(response.Message);
      // alert(response.Message)
      Alert.alert('Alert', response.Message,
        [{
          text: 'OK', onPress: () => {
            // alert('Item Not Found');
            DefaultPreference.clear('BCNdata');
            setBcnVal('');
            scanRef.current.focus();
          }
        }])
    }

  }

  const insertDataInList = async (OneItemInfo) => {

    let checkBCN = Data.find(item =>
      item.ItemCode == ItemCode,
    );
    checkBCN.ItemParamDT.splice(ind.index, 1, OneItemInfo);
    let ItemParamDT = []
    onRefresh();

  }
  const onRefresh = () => {
    // console.log('llll')
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 100);

  }
  const EditQtyModal = (item) => {
    setBcnVal(item.ParamBCN[0].BCN)
    setQty(item.Qty)
    // setEditModal(true)
  }
  // Re-check every product against fresh source godown stock just before posting.
  // Returns an error message, or null when the transfer is valid.
  const validateTransferStock = async () => {
    const McCdoe = await DefaultPreference.get('McCode');
    const res = await fetch(BaseURL + '/api/Values/GetOrderTransferItemDet?CompCode=' + CompCode + '&FY=' + Fy + '&VchCode=' + HeaderInfo.VchCode + '&IgrpCode=' + McCdoe)
    const Resp = await res.json();
    if (Resp.Status != 1) {
      return Resp.Message || 'Could not verify stock. Please try again.';
    }
    const freshStock = {};
    Resp.Data.forEach(item => {
      item.ItemParamDT.forEach(row => {
        freshStock[lineKey(item.ItemCode, row)] = rowStock(row);
      });
    });

    const seen = {};
    for (const item of allItems()) {
      for (const row of item.ItemParamDT) {
        const tfrQty = parseInt(row.TfrQty) || 0;
        if (tfrQty > parseInt(row.Qty)) {
          return item.ItemName + ' (' + row.Color + ' / ' + row.Size + '): Transfer qty must be less than qty';
        }
        const key = lineKey(item.ItemCode, row);
        if (seen[key] || tfrQty <= 0) {
          continue;
        }
        seen[key] = true;
        const total = enteredQty(key);
        const stock = freshStock[key] || 0;
        if (total > stock) {
          return item.ItemName + ' (' + row.Color + ' / ' + row.Size + '): ' + STOCK_ERROR
            + '\nAvailable: ' + stock + ', Entered: ' + total;
        }
      }
    }
    return null;
  }

  // ---------------------------------Transfer Save
  const ApprovalAPI = async () => {
    // Ignore repeated taps while a transfer is already being posted.
    if (submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    try {
      await saveTransfer();
    } finally {
      submittingRef.current = false;
    }
  }

  const saveTransfer = async () => {
      let ItemDT = [];
    allItems().map((item) => {

      let obj1 = {}
      let ItemParamDT = []
      item.ItemParamDT.map((Item) => {
        if (Item.ParamBCN.length > 0) {
          let obj = {
            Color: Item.Color,
            Size: Item.Size,
            Qty: Item.TfrQty,
            ParamBCN: Item.ParamBCN
          }
          ItemParamDT.push(obj)
        }
      })
      // }

      if (ItemParamDT.length > 0) {

        obj1 = {
          ItemCode: item.ItemCode,
          ItemName: item.ItemName,
          ItemParamDT: ItemParamDT
        }
        ItemDT.push(obj1)
      }
    })

    let JSONData = {
      VchCode: HeaderInfo.VchCode,
      SOrderID: HeaderInfo.OrderNo,
      SOrderDate: moment(HeaderInfo.OrderDate).format('DD/MMM/YYYY'),
      ItemDT: ItemDT
    }
    if (ItemDT.length > 0) {
      setisLoading(true)
      try {
        const stockError = await validateTransferStock();
        if (stockError) {
          setisLoading(false);
          Alert.alert('Alert', stockError);
          return;
        }
        const response = await fetch(BaseURL + '/api/Values/SaveTransfer?CompCode=' + CompCode + '&FY=' + Fy, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(JSONData)
        });
        const json = await response.json();
        setIItemDT([]);
        if (json.Status == 1) {
          sendNotification();
          DefaultPreference.clear('GodownData')
          DefaultPreference.clear('BCNdata')
          navigation.goBack();
        } else {
          alert(json.Message)
        }
        setisLoading(false);
        DefaultPreference.clear('BCNdata')

      } catch (e) {
        DefaultPreference.clear('BCNdata')
        setisLoading(false)
        alert('Catch Error' + e)
      }
    } else {
      alert('Please Scan Item First..')
    }


  }

  const sendNotification = async (total) => {
    let data = {
      StageID: 4,
      Title: userName,
      Msg: 'Total ' + HeaderInfo.TotalQty + ' Order Godown Transfer To Picking '
    }
    const res = await fetch(BaseURL + '/api/values/SendNotification?CompCode=' + CompCode + '&FY=' + Fy, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    // console.log("NOTIFICATION RESULT=>", res)

    let result = await res.json();
    // console.log("NOTIFICATION RESULT WITH JSON=", result)
  }


  return <View style={{ flex: 1 }}>
    <View style={{ backgroundColor: '#000', padding: 10 }}>
      <View style={{ padding: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={style.headerText}>Order Id:   {HeaderInfo.OrderNo}</Text>
          <Text style={[style.headerText, {}]}>Order Date:  {HeaderInfo.OrderDate}</Text>
        </View>
        {/* <Text style={style.headerText}>Party:       {HeaderInfo.AccName}</Text>
         <Text style={style.headerText}>Ship To:   {HeaderInfo.SAccName}</Text> */}
        <Text style={style.headerText}>TotalQty:  {HeaderInfo.TotalQty}</Text>
        {/* <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => {
              navigation.navigate('ScanItem', { Id: 2 })
            }}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1341/1341632.png' }} style={{ height: 20, width: 20, tintColor: '#fff', height: 30, width: 30 }} />
            </TouchableOpacity>
          </View> */}
        <View style={{ borderColor: '#fff', borderBottomWidth: 1, width: '95%', backgroundColor: '#fff', margin: 6, borderRadius: 5 }}>
          <TextInput  style={{ width: '100%' }}
            ref={scanRef}
            autoFocus={true}
            placeholder="Scan Item..." value={BcnVal} placeholderTextColor={"#000"} onChangeText={(text) => {
              setBcnVal(text)
            }} onEndEditing={() => {
              if (BcnVal !== '') {
                callScanAPI(BaseURL, CompCode, Fy, BcnVal)
                // setCameraScaning(false)
              }

            }} />
        </View>
        <View style={{ flexDirection: 'row', }}>
          {arr1.length !== 0 ? <TouchableOpacity
            onPress={() => {
              setisLoading(true);
              setTimeout(() => {
                setisLoading(false)
              }, 5000);
              setData(arr1);
              setcheckArr1(true);
              setcheckArr2(false);
              setcheckArr3(false);
              setcheckArr4(false);
              setcheckArr5(false)

            }}
            style={[styles.BtnSty, checkArr1 == true ? { backgroundColor: 'green' } : {}]}>
            <Text style={checkArr1 == true ? { color: '#fff' } : { color: '#000' }}>List 1</Text>
          </TouchableOpacity> : null}

          {arr2.length !== 0 ? <TouchableOpacity
            onPress={() => {
              setisLoading(true);
              setTimeout(() => {
                setisLoading(false)
              }, 5000);
              setData(arr2);
              setcheckArr1(false);
              setcheckArr2(true);
              setcheckArr3(false);
              setcheckArr4(false);
              setcheckArr5(false);
            }}
            style={[styles.BtnSty, checkArr2 == true ? { backgroundColor: 'green' } : {}]}>
            <Text style={checkArr2 == true ? { color: '#fff' } : { color: '#000' }}>List 2</Text>
          </TouchableOpacity> : null}
          {arr3.length !== 0 ? <TouchableOpacity
            onPress={() => {
              setisLoading(true);
              setTimeout(() => {
                setisLoading(false)
              }, 5000);
              setData(arr3);
              setcheckArr1(false);
              setcheckArr2(false);
              setcheckArr3(true);
              setcheckArr4(false);
              setcheckArr5(false);

            }}
            style={[styles.BtnSty, checkArr3 == true ? { backgroundColor: 'green' } : {}]}>
            <Text style={checkArr3 == true ? { color: '#fff' } : { color: '#000' }}>List 3</Text>
          </TouchableOpacity> : null}
          {arr4.length !== 0 ? <TouchableOpacity
            onPress={() => {
              setisLoading(true);
              setTimeout(() => {
                setisLoading(false)
              }, 5000);
              setData(arr4);
              setcheckArr1(false);
              setcheckArr2(false);
              setcheckArr3(false);
              setcheckArr4(true);
              setcheckArr5(false);

            }}
            style={[styles.BtnSty, checkArr4 == true ? { backgroundColor: 'green' } : {}]}>
            <Text style={checkArr4 == true ? { color: '#fff' } : { color: '#000' }}>List 4</Text>
          </TouchableOpacity> : null}
          {arr5.length !== 0 ? <TouchableOpacity
            onPress={() => {
              setisLoading(true);
              setTimeout(() => {
                setisLoading(false)
              }, 5000);
              setData(arr5);
              setcheckArr1(false);
              setcheckArr2(false);
              setcheckArr3(false);
              setcheckArr4(false);
              setcheckArr5(true);

            }}
            style={[styles.BtnSty, checkArr5 == true ? { backgroundColor: 'green' } : {}]}>
            <Text style={checkArr5 == true ? { color: '#fff' } : { color: '#000' }}>List 5</Text>
          </TouchableOpacity> : null}
        </View>
      </View>
    </View>
    <View style={{ height: '70%' }}>
      {/* <ScrollView  keyboardShouldPersistTaps={'handled'} > */}
        <View  >
          <FlatList 
          initialNumToRender={2}
          windowSize={5}
         ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
           ListFooterComponent={()=>{
            // setTimeout(() => {
              return<ActivityIndicator size={'large'} />

            // }, 5000);
           }}
          
          keyExtractor={(Item,index) => index.toString()} data={Data}
            renderItem={({ item, index }) => {
              return <RenderFirtsList  item={item} index={index} refVal={RefreshingVal} setvalue={(val) => {
                ItemRackChecking(BaseURL, CompCode, Fy, val.itemCode, val.Color, val.Size)
              }} />

            }
          
            // contentContainerStyle={{flexGrow: 1}}
            // ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
            // ListFooterComponent={<Footer/>}
              // renderItem={({item,index})=>{
              //   return<renderMainItem item={item} index={index} />

              // }
            }
           
          />
        </View>
      {/* </ScrollView> */}
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', }}>
      {/* --------------Remove All---------------------- */}
      {/* <TouchableOpacity style={{}}
 onPress={()=>{
  Alert.alert(
    "Do you want to transfer Order?",
    "",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Yes", onPress: () =>
      ApprovalAPI()
     }
    ]
  );
 }}
 > */}
      <View style={{ flexDirection: 'row' }}>
        <RNBounceable
          onPress={() => {
            DefaultPreference.clear('GodownData')
            // console.log(navigation)
            // navigation.goBack()
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
            Alert.alert(
              "Do you want to transfer Order?",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Yes", onPress: () =>{
                    // console.log('====================================');
                    // console.log(arr1);
                    // console.log('====================================');
                    ApprovalAPI()
                    }
                }
              ]
            );
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14, padding: 5 }}>Order Transfer</Text>
        </RNBounceable>

      </View>
      {/* <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{height:40,width:120,alignItems:'center',justifyContent:'center'}}>
    <Text style={{color:'#fff',fontSize:20}}>Transfer</Text>
 </LinearGradient> */}
      {/* </TouchableOpacity> */}
    </View>

    <Modal visible={isLoading} >
      <View style={style.content} >
        <ActivityIndicator size={35} />
        <Text>Please Wait...</Text>
      </View>
    </Modal>
    <Modal visible={editModal} transparent={true} onRequestClose={() => setEditModal(!editModal)} >
      <View style={style.content}>
        <View style={{ width: '60%', backgroundColor: '#fff', elevation: 5, borderRadius: 7 }}>
          <Text style={[style.salesmantextsty, { marginTop: 6, color: '#000', padding: 5 }]}>{BcnVal}</Text>
          <View style={{ flexDirection: 'row', marginTop: 6, padding: 5 }}>
            <Text style={[style.salesmantextsty, { borderColor: '#000', width: 50, marginTop: 7 }]}>Qty: </Text>
            <TextInput
              keyboardType={'numeric'} maxLength={4}
              style={{}} value={Qty.toString()} onChangeText={(text) => { setQty(text) }} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                if (parseInt(Qty) <= itemInfo.Qty) {
                  let CheakItemName = ScanData.find(
                    item => item.BCN.toUpperCase() === BcnVal.toUpperCase(),
                  );
                  const ind = ScanData.indexOf(CheakItemName);
                  if (CheakItemName !== undefined) {
                    let obj = {
                      BCN: BcnVal,
                      Qty: Qty
                    }
                    itemInfo.TfrQty = Qty;
                    ScanData.splice(ind, 1, obj);
                    setEditModal(false)
                  }
                } else {
                  alert('Transfer Qty is less then actual qty')
                }
              }}

              style={{
                backgroundColor: '#000', borderRadius: 5,
                alignItems: 'center', justifyContent: 'center', height: 40, width: 80, margin: 5
              }}
            >
              <Text style={{ color: '#fff' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    <Modal visible={isvisible} transparent={false} elevation='20' onRequestClose={() => setisvisible(!isvisible)}>
      <Pressable onPress={() => {
        setisvisible(false)
      }} style={{ flex: 1, backgroundColor: '#e9ecef', }}>
        <Pressable onPress={() => {
          setisvisible(true)
        }} style={{ alignContent: 'center', top: 150 }}>
          <TouchableOpacity onPress={() => {
            setisvisible(false)
          }} style={{ alignContent: 'flex-end', left: '85%' }}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9428/9428870.png' }}
              style={{ backgroundColor: '#e9ecef', width: 30, height: 30 }} />
          </TouchableOpacity>
          <View style={{ backgroundColor: '#ffffff', margin: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
            <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>
              <View style={{ width: '50%', }}>
                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>RACK</Text>
              </View>
              <View style={{ width: '50%', borderLeftColor: 'white', borderLeftWidth: 1 }}>
                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
              </View>
            </View>
            <FlatList
              data={ItemRackCheck}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1 }}>
                    <View style={{ width: '50%', borderRightColor: 'black', borderRightWidth: 1, borderLeftColor: 'black', borderLeftWidth: 1 }}>
                      <Text style={{ padding: 8, color: 'black', fontSize: 15, textAlign: 'left' }}>{item.Rack}</Text>
                    </View>

                    <View style={{ width: '50%', borderRightColor: 'black', borderRightWidth: 1, borderLeftColor: 'black', borderLeftWidth: 1 }}>
                      <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Qty}</Text>
                    </View>
                  </View>
                )
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>


    {/* <Modal visible={isvisible} transparent={false} elevation='20' onRequestClose={() => setisvisible(!isvisible)}>
        <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>
          <View style={{ width: '50%', }}>
            <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>RACK</Text>
          </View>

          <View style={{ width: '50%', borderLeftColor: 'black', borderLeftWidth: 1 }}>
            <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
          </View>
        </View>
        <FlatList
          data={ItemRackCheck}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1 }}>
                <View style={{ width: '50%', borderRightColor: 'black', borderRightWidth: 1 }}>
                  <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15, textAlign: 'left' }}>{item.Rack}</Text>
                </View>

                <View style={{ width: '50%', borderRightColor: 'black', borderRightWidth: 1 }}>
                  <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Qty}</Text>
                </View>
              </View>
            )
          }}
        />
      </Modal > */}

  </View >


}
export default PtWiseOrderInGUser;
const styles = StyleSheet.create({
  BtnSty: {
    width: 60,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginLeft: 5
  },
}
)