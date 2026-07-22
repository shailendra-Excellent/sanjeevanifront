import React, { useEffect, useState } from "react";
import { Keyboard, Image, View, ScrollView, Text, TouchableOpacity, Modal, ActivityIndicator, FlatList, TextInput } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import moment from "moment";
let GrandTotalQty = 0
import Tts from 'react-native-tts';
import { Checkbox } from 'react-native-paper'
const RenderComponent = ({ key, item, totalQty }) => {
  return (
    <View key={key} style={{ flexDirection: 'row', borderBottomWidth: 1 }}>

      <Text style={{ padding: 5, color: '#000', width: 170, borderRightWidth: 1, borderRightColor: '#000', padding: 10 }}>{item.ItemName}</Text>
      <Text style={{ padding: 5, color: '#000', width: 100, borderRightWidth: 1, borderRightColor: '#000' }}>{item.Color}</Text>
      <Text style={{ padding: 5, color: '#000', width: 80, borderRightWidth: 1, borderRightColor: '#000' }}>{totalQty.toString()}</Text>

      <View key={item.ItemCode} style={{ flexDirection: 'row' }}>
        <FlatList horizontal={true} keyboardShouldPersistTaps={'handled'} data={item.ItemParamDT} renderItem={({ index, item }) => {
          //   totalQty=totalQty+item.Qty;

          sizeQty = item.Size + '/' + item.Qty;
          if (item.Qty > 1) {
            return (
              <View key={index} style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{item.Size + ' /'}</Text>
                <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'blue' }} >{item.Qty + ','}</Text>

              </View>

            )
          } else {
            let Qty = 1
            return (
              <View style={{ flexDirection: 'row' }} >

                <Text style={{ color: '#000', fontWeight: '600', color: 'red' }} >{item.Size + ' /'}</Text>
                <Text style={{ color: '#000', fontWeight: '600', color: 'blue' }} >{Qty + ','}</Text>

              </View>
            )
          }

        }} />
        {/* {item.ItemParamDT.map((ItemParamDT,index)=>{
                            sizeQty = ItemParamDT.Size + '/'+ItemParamDT.Qty
                   if(ItemParamDT.Qty > 1 ){
                    return( 
                      <View key={index} style={{borderBottomWidth:1}}>
                                      <Text  style={{color:'#000',padding:5,fontWeight:'600',color:'red'}} >{sizeQty}</Text>
                      </View>
                 
                  )
                   }else{
                    return( 
                      <View style={{borderBottomWidth:1}}>
                       
                       <Text style={{color:'#000',padding:5,fontWeight:'600',color:'red'}} >{ItemParamDT.Size+ ', '}</Text>
         
                      </View>
                  )
                   }
                })} */}
      </View>
    </View>
  )
}
const ItemStockReport = ({ route }) => {
  const { code, MAsterCode, checkDepartmentWise, DepartmentName } = route.params;
  const [StockData, setStockData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [Search, setSearch] = useState('');
  const [checked, setChecked] = useState(0);
  const [Speenar, setSpeenar] = useState(false);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [text, setText] = useState('Hello User')
  const [ActualData, setActualData] = useState([])

  useEffect(() => {
    // DefaultPreference.get('BaseURL').then(function (BaseURL) {
    //   DefaultPreference.get('CompCode').then(function (compCode) {
    //     DefaultPreference.get('FY').then(function (Fy) {
    //       StockStatusAPI(BaseURL, compCode, Fy, code, MAsterCode, checked)
    //     })
    //   })
    // })
    Tts.addEventListener(
      'tts-start',
      (_event) => setTtsStatus('started')
    );
    Tts.addEventListener(
      'tts-finish',
      (_event) => setTtsStatus('finished')
    );
    Tts.addEventListener(
      'tts-cancel',
      (_event) => setTtsStatus('cancelled')
    );
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    return () => {
      Tts.removeEventListener(
        'tts-start',
        (_event) => setTtsStatus('started')
      );
      Tts.removeEventListener(
        'tts-finish',
        (_event) => setTtsStatus('finished'),
      );
      Tts.removeEventListener(
        'tts-cancel',
        (_event) => setTtsStatus('cancelled'),
      );
    };
  }, []);

  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          StockStatusAPI(BaseURL, compCode, Fy, code, MAsterCode, checked)
        })
      })
    })
  }, [checked]);
  
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

  const StockStatusAPI = async (BaseURL, CompCode, FY, code, MAsterCode, AvailQtyOnly) => {
    setIsloading(true)
    try {
      console.log(BaseURL + '/api/Values/GetStockStatus?CompCode=' + CompCode + '&FY=' + FY + '&MasterType=' + MAsterCode + '&MasterCode=' + code + '&SDate=' + moment(new Date()).format('DD/MMM/YYYY') + '&AvailQtyOnly=' + AvailQtyOnly)
      const res = await fetch(BaseURL + '/api/Values/GetStockStatus?CompCode=' + CompCode + '&FY=' + FY + '&MasterType=' + MAsterCode + '&MasterCode=' + code + '&SDate=' + moment(new Date()).format('DD/MMM/YYYY') + '&AvailQtyOnly=' + AvailQtyOnly)
      const response = await res.json();

      //    console.log(response)
      setIsloading(false)
      // console.log(response)
      if (response.Status == 1) {
        if (response.Data.length > 0) {
          GrandTotalQty = 0
          response.Data.map((item) => {
            item.ItemParamDT.map((paramdt) => {
              // console.log(paramdt.Qty)
              GrandTotalQty = GrandTotalQty + paramdt.Qty
            })
          });
          if (checkDepartmentWise == true) {
            Tts.stop();
            Tts.speak('Total' + GrandTotalQty.toFixed() + 'stock availavel in ' + DepartmentName + ' department  ');
          } else {
            Tts.stop();
            Tts.speak('Total' + GrandTotalQty.toFixed() + 'stock availavle in this item');
          }

          // response.Data.forEach(element => {
          //     let tQty=0
          //     element.TQty=tQty
          //     element.ItemParamDT.map((item)=>{
          //        tQty=item.Qty+tQty
          //     })
          // });
          // console.log(response.Data)
          setStockData(response.Data);
          setActualData(response.Data);
        } else {
          setIsloading(false)
          alert('Record Not Found')
        }

      } else {
        setIsloading(false)
        alert(response.Message)
      }
    } catch (e) {
      setIsloading(false);
      alert('Catch Error' + e)
    }

  }

  const searchFilter = text => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = StockData.filter(
        function (item) {
          if (MAsterCode == 6) {
            // Applying filter for the inserted text in search bar
            const itemData = item.Color
              ? item.Color.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          } else {
            // Applying filter for the inserted text in search bar
            const itemData = item.ItemName
              ? item.ItemName.toUpperCase()
              : ''.toUpperCase();

            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }

        }
      );
      setSpeenar(false);

      // console.log(newData)
      setStockData(newData)
      setSearch(text);
    } else {
      setStockData(ActualData)
      // setData(lisdata);
      setSpeenar(false)
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      // setSpeenar(false)
      // setFilterData([]);
      setSearch(text);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        {checkDepartmentWise == true ? <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 17, padding: 5 }}>Department: {DepartmentName}</Text>
        </View> : <></>}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            color="#F39505"
            uncheckedColor="#000"
            status={checked === 1 ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(checked === 1 ? 0 : 1)
            }}
          />
          <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Pending Stock</Text>
        </View>

        <View style={{ flexDirection: 'row', width: '95%', borderWidth: 1, margin: 10, borderRadius: 5, alignItems: 'center' }}>

          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/667/667434.png' }} style={{ tintColor: '#000', height: 20, width: 20, marginLeft: 4 }} />

          <TextInput style={{ width: '80%' }} value={Search}
            placeholder={MAsterCode == 6 ? 'Search Color' : 'Search Item'} onChangeText={(text) => {
              searchFilter(text)
            }} />

          <TouchableOpacity onPress={() => {
            setSearch('')
            Keyboard.dismiss()
            if (checkDepartmentWise == true) {
              setStockData(ActualData)
            } else {
              setStockData(ActualData)
            }
          }}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }} style={{ tintColor: '#000', height: 20, width: 20, }} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={true}>
          <View>
            <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
              <Text style={{ padding: 5, color: '#fff', width: 170, borderRightWidth: 1, borderRightColor: '#fff' }}>Item Name</Text>
              <Text style={{ padding: 5, color: '#fff', width: 100, borderRightWidth: 1, borderRightColor: '#fff' }}>Color</Text>
              <Text style={{ padding: 5, color: '#fff', width: 80, borderRightWidth: 1, borderRightColor: '#fff' }}>Total Qty</Text>

              {/* <ScrollView horizontal={true}> */}
              <View style={{ minWidth: 200, maxWidth: 800 }}>
                <Text style={{ padding: 5, color: '#fff', width: 'auto', borderRightColor: '#fff', }}>Size/Qty</Text>
              </View>

            </View>
            <FlatList keyboardShouldPersistTaps={'handled'} data={StockData} renderItem={({ index, item }) => {
              // console.log(item)
              let totalQty = 0
              item.ItemParamDT.map((paramDT) => {
                totalQty = paramDT.Qty + totalQty
              })
              return (
                <RenderComponent key={index} item={item} totalQty={totalQty} />
                // <View key={index} style={{flexDirection:'row',borderBottomWidth:1}}>

                //       <Text style={{padding:5,color:'#000',width:170,borderRightWidth:1,borderRightColor:'#000',padding:10}}>{item.ItemName}</Text>
                //       <Text style={{padding:5,color:'#000',width:100,borderRightWidth:1,borderRightColor:'#000'}}>{item.Color}</Text>
                //       <Text style={{padding:5,color:'#000',width:80,borderRightWidth:1,borderRightColor:'#000'}}>{totalQty.toString()}</Text>

                //     <View key={item.ItemCode} style={{flexDirection:'row'}}>
                //       <FlatList horizontal={true} data={item.ItemParamDT} renderItem={({index,item})=>{
                //   //   totalQty=totalQty+item.Qty;

                //     sizeQty = item.Size + '/'+item.Qty;
                //         if(item.Qty > 1 ){
                //          return( 
                //            <View key={index} style={{flexDirection:'row'}}>
                //                            <Text  style={{color:'#000',padding:5,fontWeight:'600',color:'red'}} >{item.Size +' /'}</Text>
                //                            <Text  style={{color:'#000',padding:5,fontWeight:'600',color:'blue'}} >{item.Qty + ','}</Text>

                //            </View>

                //        )
                //         }else{
                //           let Qty=1
                //          return( 
                //            <View style={{flexDirection:'row'}} >

                //             <Text style={{color:'#000',fontWeight:'600',color:'red'}} >{item.Size+ ' /'}</Text>
                //             <Text  style={{color:'#000',fontWeight:'600',color:'blue'}} >{Qty + ','}</Text>

                //            </View>
                //        )
                //         }

                //       }} />
                //       {/* {item.ItemParamDT.map((ItemParamDT,index)=>{
                //                   sizeQty = ItemParamDT.Size + '/'+ItemParamDT.Qty
                //          if(ItemParamDT.Qty > 1 ){
                //           return( 
                //             <View key={index} style={{borderBottomWidth:1}}>
                //                             <Text  style={{color:'#000',padding:5,fontWeight:'600',color:'red'}} >{sizeQty}</Text>
                //             </View>

                //         )
                //          }else{
                //           return( 
                //             <View style={{borderBottomWidth:1}}>

                //              <Text style={{color:'#000',padding:5,fontWeight:'600',color:'red'}} >{ItemParamDT.Size+ ', '}</Text>

                //             </View>
                //         )
                //          }
                //       })} */}
                //         </View>
                //      </View>
              )
            }} />
          </View>
        </ScrollView>



        <Modal visible={isLoading}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} />
            <Text>Please Wait..</Text>
          </View>
        </Modal>

      </ScrollView>
      <View style={{ justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#000', width: '100%', alignItems: 'center' }}>
          <Text style={{ color: '#fff', padding: 7, fontSize: 20 }}>Total Qty : {GrandTotalQty.toString()}</Text>
        </View>
      </View>
    </View>
  )
}
export default ItemStockReport