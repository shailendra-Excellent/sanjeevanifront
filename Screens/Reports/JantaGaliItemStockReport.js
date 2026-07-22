import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, Image, TextInput, TouchableOpacity, FlatList, Keyboard, ScrollView, Modal, useWindowDimensions } from 'react-native';
import { Checkbox } from 'react-native-paper';
import DefaultPreference from 'react-native-default-preference';
import SerchComponent from "../Components/SearchDepartment";
import CustomSearch from "../Components/CustomSearch";
import RNBounceable from "@freakycoder/react-native-bounceable";
import MainRenderList from "../Components/JantaGaliMainRenderView";
import moment from "moment";

// const MainRenderList=({Item,index,sizeWise})=>{
//   return(
//     <View style={{flexDirection:'row',borderBottomWidth:1}}>
//       <Text style={{width:'35%',borderRightWidth:1,padding:7 }}>{Item.ItemName}</Text>
//       <Text style={{width:'30%',borderRightWidth:1,padding:7 }}>{sizeWise ==true?Item.Qty:Item.Color}</Text> 
//        <View style={{flexDirection:'row'}}>
//         <FlatList horizontal={true} data={Item.ItemParamDT} renderItem={({item,index})=>{
//          return(
//           <SecondRenderComponent item={item} index={index} Color={Item.Color} />
//          ) 
//         }} />
//        </View>
//       {/* <Text style={{width:'35%',borderRightWidth:1,padding:7 }}>{sizeWise ==true?item.Color +'/'+item.ItemParamDT[index].Size:item.Qty}</Text> */}
//     </View>
//   )
// }
const SecondRenderComponent = ({ item, index, Color }) => {
  // console.log(index, item) 
  return (
    <View style={{ flexDirection: 'row', padding: 5 }}>
      <Text style={{ fontWeight: '600', fontSize: 14, color: 'red' }}>{Color + ' '}</Text>
      <Text style={{ fontWeight: '600', fontSize: 14 }}>/</Text>
      <Text style={{ fontWeight: '600', fontSize: 14, color: 'green' }}>{' ' + item.Qty}</Text>
      {/* <Text>{Color + ' '+ '/'+' '+item.Qty}</Text> */}
    </View>
  )
}
const JantaGaliStockReport = () => {
  const [CheckItemWise, setItemWise] = useState(true);
  const [checkDepartmentWise, setcheckDepartmentWise] = useState(false);
  const [Speenar, setSpeenar] = useState(false);
  const [Search, setSearch] = useState('');
  const [PlaceHolder, setPlaceHolder] = useState('Search Item');
  const [ItemData, setItemData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [Data, setData] = useState([]);
  const [MAsterCode, setMasterCode] = useState(6);
  const [BaseURL, setBaseURL] = useState('')
  const [CompCode, setCompCode] = useState('');
  const [FY, setFy] = useState('');

  const [isLoading, setIsloading] = useState(true);
  const { height, width } = useWindowDimensions();
  const [Iname, setIname] = useState('');
  const [Icode, setIcode] = useState('0');
  const [minQty, setminQty] = useState('');
  const [SizeWise, setSizeWise] = useState(true);
  const [ReportData, setReportData] = useState([]);
  const [checkSize, setCheckSize] = useState(true)
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          setBaseURL(BaseURL), setCompCode(compCode), setFy(Fy)

          callMasterData(BaseURL, compCode, Fy, 6, 0)

        })
      })
    })

  }, []);

  const callMasterData = async (BaseURL, compCode, Fy, MasterType, PartyGrp) => {
    setIsloading(true);
    setData([])
    try {
      console.log(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + PartyGrp)
      const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + PartyGrp)
      const response = await res.json();
      if (response.Status == 1) {
        setIsloading(false);
        if (MasterType == 6) {
          setData(response.Data);
          setItemData(response.Data)
        } else {
          setIsloading(false)
          setDepartmentData(response.Data);
          setData(response.Data)
        }
      }
    } catch (e) {
      setIsloading(false)
      alert('Catch Error ' + e)
    }

  }
  const CallReportAPI = async (MasterType, Mastercode) => {
    setIsloading(true);
    try {
      let mQty = parseInt(minQty) - 1
      let AsOnDate = moment(new Date()).format('DD/MMM/YYYY')
      setReportData([])
      console.log(BaseURL + '/api/Values/GetSampleMCReqStockStatus?CompCode=' + CompCode + '&FY=' + FY + '&MasterCode=' + Mastercode + '&MasterType=' + MasterType + '&SDate=' + AsOnDate + '&MinQty=' + mQty)
      const res = await fetch(BaseURL + '/api/Values/GetSampleMCReqStockStatus?CompCode=' + CompCode + '&FY=' + FY + '&MasterCode=' + Mastercode + '&MasterType=' + MasterType + '&SDate=' + AsOnDate + '&MinQty=' + mQty)
      const response = await res.json();
      if (response.Status == 1) {
        setIsloading(false);
        console.log(response)
        // if(MasterType ==6){
        setSizeWise(checkSize);
        let data = [];
        response.Data.sort((a, b) => b.Qty - a.Qty)
        // response.Data.map((item)=>{
        //   if(checkSize ==true){
        //     item.ItemParamDT.map((ItemParam)=>{
        //   if(ItemParam.Qty>= minQty){
        //     data.push(item);  
        //   }
        //     })
        //     return;
        //   } 

        //     if(item.Qty >=minQty){

        //       data.push(item)


        //     }
        //     // setReportData(data)

        // });
        setReportData(response.Data);
        // console.log(JSON.stringify(ReportData))
      }
    } catch (e) {
      setIsloading(false)
      alert('Catch Error ' + e)
    }

  }

  return <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', width: '50%' }}>
        <Checkbox
          color='red'
          uncheckedColor='#000'
          status={CheckItemWise ? 'checked' : 'unchecked'}
          onPress={() => {
            if (CheckItemWise == false) {
              setItemWise(true);
              setcheckDepartmentWise(false);
              setSearch('')
              setPlaceHolder('Search Item');
              setMasterCode(6);
              callMasterData(BaseURL, CompCode, FY, 6, 0)
            }
          }}
        />
        <Text style={{ marginTop: 7, fontWeight: '700', fontSize: 16 }}>Item Wise</Text>
      </View>
      <View style={{ flexDirection: 'row', width: '50%' }}>
        <Checkbox
          color='red'
          uncheckedColor='#000'
          status={checkDepartmentWise ? 'checked' : 'unchecked'}
          onPress={() => {
            if (checkDepartmentWise == false) {
              setItemWise(false);
              setcheckDepartmentWise(true);
              setSearch('');
              setPlaceHolder('Search Department');
              // setItemData(DepartmentData);
              setData(DepartmentData);
              setMasterCode(5);
              callMasterData(BaseURL, CompCode, FY, 5, 0);
            }
          }}
        />
        <Text style={{ marginTop: 7, fontWeight: '700', fontSize: 16 }}>Department Wise</Text>
      </View>
    </View>


    <View style={{ paddingRight: 10, paddingLeft: 10 }}>
      <CustomSearch data={Data} placeholder={'Search Item...'} setvalue={(item) => {
        setIcode(item.Code)
        setIname(item.Name);
      }} setcrosValue={() => {
        setIcode(0)
      }} setitemDetails={() => { }} />
    </View>
    <View style={{ flexDirection: 'row', padding: 5, paddingTop: 10, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Checkbox
          color='red'
          uncheckedColor='#000'
          status={checkSize ? 'checked' : 'unchecked'}
          onPress={() => {
            setCheckSize(!checkSize)

          }}
        />
        <Text style={{ fontWeight: '700', fontSize: 16 }} >Size </Text>

        {/* <TextInput style={{height:40,width:70,borderWidth:1}} value={minQty} onChangeText={(text)=>{setminQty(text)}} /> */}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>Min Qty </Text>
        <TextInput keyboardType={'numeric'} style={{ height: 40, width: 60, borderWidth: 1 }} value={minQty} onChangeText={(text) => { setminQty(text) }} />
      </View>
      <RNBounceable
        onPress={() => {
          if (Icode == 0) {
            alert(' Search Item Or Department First');
            return;
          }
          if (minQty == '') {
            alert('Enter Minimum Qty ');
            return;
          }
          CallReportAPI(MAsterCode, Icode)

        }}
        style={{ height: 40, width: 60, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', }}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Load</Text>
      </RNBounceable>

    </View>
    <ScrollView horizontal={true}>
      <View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ width: 150, alignItems: 'center', backgroundColor: '#000', padding: 10, borderRightWidth: 1, borderColor: '#fff' }}>
            <Text style={{ color: '#fff' }}>Design</Text>
          </View>
          <View style={{ width: 100, alignItems: 'center', backgroundColor: '#000', padding: 10, borderRightWidth: 1, borderColor: '#fff' }}>
            <Text style={{ color: '#fff' }}>{SizeWise == true ? 'Qty' : 'Color'}</Text>
          </View>
          {SizeWise == true ? <View style={{ width: 100, alignItems: 'center', backgroundColor: '#000', padding: 10, borderRightWidth: 1, borderColor: '#fff' }}>
            <Text style={{ color: '#fff' }}>{'Color'}</Text>
          </View> : null}

          <View style={{ width: 440, backgroundColor: '#000', padding: 10, }}>
            <Text style={{ color: '#fff' }}>{SizeWise == true ? 'Size / Qty' : 'Qty'}</Text>
          </View>
        </View>
        <FlatList data={ReportData} keyExtractor={({ item, index }) => index}
          renderItem={({ item, index }) => {
            // console.log(item)
            item.ItemParamDT.map((Item) => {

            })
            return (
              <View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                  <Text style={{ width: 150, borderRightWidth: 1, padding: 7 }}>{item.ItemName}</Text>
                  <Text style={{ width: 100, borderRightWidth: 1, padding: 7 }}>{SizeWise == true ? item.Qty : item.Color}</Text>
                  {SizeWise == true ? <View style={{ width: 100, alignItems: 'center', padding: 10, borderRightWidth: 1, }}>
                    <Text style={{}}>{item.Color}</Text>
                  </View> : null}
                  <View style={{ width: 300, padding: 5 }}>
                    <FlatList data={item.ItemParamDT} horizontal={true} renderItem={(Item) => {
                      // console.log(Item)

                      return (
                        <View>
                          <Text>{Item.item.Size + '/' + Item.item.Qty + ' , '}</Text>
                        </View>

                      )
                    }} />
                  </View>

                </View>
              </View>

            )
          }}
        />
      </View>
    </ScrollView>


    <Modal visible={isLoading}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
        <Text>Please Wait..</Text>
      </View>
    </Modal>
  </View>

}
export default JantaGaliStockReport