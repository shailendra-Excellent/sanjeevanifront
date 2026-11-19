import React, { useState } from "react";
import { useEffect } from "react";
import { ActivityIndicator, View, Text, Image, TextInput, TouchableOpacity, FlatList, Keyboard, ScrollView, Modal, useWindowDimensions } from 'react-native';
import { Checkbox } from 'react-native-paper';
import DefaultPreference from 'react-native-default-preference';
import moment from "moment";
import { filterByText, useDebouncedCallback } from './Components/useDebounce';


const RenderComponent = ({ key, item }) => {
  return (
    <TouchableOpacity key={key} style={{ width: '100%', borderBottomWidth: 1 }}
      onPress={() => {
        navigation.navigate('ItemStockReport', { code: item.Code, MAsterCode: MAsterCode, checkDepartmentWise: checkDepartmentWise, DepartmentName: item.Name })
        setDepartmentName(item.Name)
        Keyboard.dismiss();

      }}
    >
      <Text key={item.Code} style={{ padding: 10, fontSize: 15 }}>{item.Name}</Text>
    </TouchableOpacity>
  )

}

const ItemStock = ({ navigation }) => {
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
  const [StockData, setStockData] = useState([]);
  const [showStockReport, setshowStockReport] = useState(false);
  const [DepartmentName, setDepartmentName] = useState('');
  const [isLoading, setIsloading] = useState(true);
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          setBaseURL(BaseURL), setCompCode(compCode), setFy(Fy)
          callMasterData(BaseURL, compCode, Fy, 5, 0)
          callMasterData(BaseURL, compCode, Fy, 6, 0)

        })
      })
    })

  }, []);
  const callMasterData = async (BaseURL, compCode, Fy, MasterType, PartyGrp) => {
    setIsloading(true);
    try {
      // console.log(BaseURL+'/api/Values/GetBusyMaster?CompCode='+compCode+'&FY='+Fy+'&MasterType='+MasterType+'&ParentGrp='+PartyGrp)
      const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + PartyGrp)
      const response = await res.json();
      if (response.Status == 1) {
        setIsloading(false);
        if (MasterType == 6) {
          setData(response.Data);
          setItemData(response.Data)
        } else {
          setIsloading(false)
          setDepartmentData(response.Data)
        }
      } else {
        setIsloading(false)
        alert(response.Message)
      }
    } catch (e) {
      setIsloading(false)
      alert('Catch Error ' + e)
    }

  }
  // Always filter the full list (not the already-filtered Data) so backspace brings results back
  const runSearchFilter = useDebouncedCallback((text) => {
    const source = checkDepartmentWise == true ? DepartmentData : ItemData;
    setData(filterByText(source, text, item => item.Name));
    setSpeenar(false);
  });
  const searchFilter = (text) => {
    setSearch(text);
    setSpeenar(true);
    runSearchFilter(text);
  };
  const StockStatusAPI = async (code) => {
    setIsloading(true)
    try {
      // console.log(BaseURL+'/api/Values/GetStockStatus?CompCode='+CompCode+'&FY='+FY+'&MasterType='+MAsterCode+'&MasterCode='+code+'&SDate='+moment(new Date()).format('DD/MMM/YYYY'))
      const res = await fetch(BaseURL + '/api/Values/GetStockStatus?CompCode=' + CompCode + '&FY=' + FY + '&MasterType=' + MAsterCode + '&MasterCode=' + code + '&SDate=' + moment(new Date()).format('DD/MMM/YYYY'))
      const response = await res.json();
      setIsloading(false)
      // console.log(response)
      if (response.Status == 1) {
        setStockData(response.Data);
        if (response.Data.length > 0) {
          setshowStockReport(true)
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
  return (
    <View style={{ flex: 1 }}>

      <View>
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
                  setData(ItemData);
                  setSearch('')
                  setPlaceHolder('Search Item');
                  setMasterCode(6)
                }
              }}
            />
            <Text style={{ marginTop: 5, fontSize: 15, color: '#000' }}>Item Wise</Text>
          </View>
          <View style={{ flexDirection: 'row', width: '50%' }}>
            <Checkbox
              color='red'
              uncheckedColor='#000'
              status={checkDepartmentWise ? 'checked' : 'unchecked'}
              onPress={() => {
                if (checkDepartmentWise == false) {
                  setItemWise(false)
                  setcheckDepartmentWise(true);
                  setSearch('')
                  setPlaceHolder('Search Department');
                  setData(DepartmentData);
                  setMasterCode(5)
                }
              }}
            />
            <Text style={{ marginTop: 5, fontSize: 15, color: '#000' }}>Department Wise</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '95%', borderWidth: 1, margin: 10, borderRadius: 5, alignItems: 'center' }}>
          {Speenar == true ? <ActivityIndicator
            color={'#000'} /> :
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/667/667434.png' }} style={{ tintColor: '#000', height: 20, width: 20, marginLeft: 4 }} />
          }
          <TextInput style={{ width: '80%' }} value={Search}
            placeholder={PlaceHolder} onChangeText={(text) => {
              searchFilter(text)
            }} />
          <TouchableOpacity onPress={() => {
            searchFilter('')
            if (checkDepartmentWise == true) {
              setData(DepartmentData)
            } else {
              setData(ItemData)
            }

          }}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }} style={{ tintColor: '#000', height: 20, width: 20, }} />
          </TouchableOpacity>

        </View>

        <FlatList style={{ height: height }} data={Data} keyboardShouldPersistTaps={'handled'}
          renderItem={({ item }) => {
            return (
              // <RenderComponent key={item.Code} item={item} />
              <TouchableOpacity key={item.Code} style={{ width: '100%', borderBottomWidth: 1 }}
                onPress={() => {
                  navigation.navigate('ItemStockReport', { code: item.Code, MAsterCode: MAsterCode, checkDepartmentWise: checkDepartmentWise, DepartmentName: item.Name })
                  setDepartmentName(item.Name)
                  Keyboard.dismiss();
                }}
              >
                <Text key={item.Code} style={{ padding: 10, fontSize: 15 }}>{item.Name}</Text>
              </TouchableOpacity>
            )
          }} />

      </View>

      <Modal animationType={'slide'} visible={showStockReport} onRequestClose={() => {
        setshowStockReport(false);
        setDepartmentName('')
      }} >
        <ScrollView>
          {checkDepartmentWise == true ? <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'red', fontSize: 17, padding: 5 }}>Department: {DepartmentName}</Text>
          </View> : <></>}
          <View></View>
          <ScrollView horizontal={true}>
            <View>
              <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
                <Text style={{ padding: 5, color: '#fff', width: 150, borderRightWidth: 1, borderRightColor: '#fff' }}>Item Name</Text>
                <Text style={{ padding: 5, color: '#fff', width: 100, borderRightWidth: 1, borderRightColor: '#fff' }}>Color</Text>
                <ScrollView horizontal={true}>
                  <View style={{ minWidth: 100 }}>
                    <Text style={{ padding: 5, color: '#fff', width: 'auto', borderRightColor: '#fff', }}>Size/Qty</Text>

                  </View>

                </ScrollView>

              </View>
              {StockData.length > 0 ? StockData.map((item, index) => {
                let sizeQty = ''
                return (
                  <View style={{}}>


                    <ScrollView horizontal={true}>
                      <View>

                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, width: 400 }}>

                          <Text style={{ padding: 5, color: '#000', width: 150, borderRightWidth: 1, borderRightColor: '#000', padding: 10 }}>{item.ItemName}</Text>
                          <Text style={{ padding: 5, color: '#000', width: 100, borderRightWidth: 1, borderRightColor: '#000' }}>{item.Color}</Text>
                          <View style={{ flexDirection: 'row' }}>

                            {item.ItemParamDT.map((ItemParamDT) => {
                              sizeQty = ItemParamDT.Size + '/' + ItemParamDT.Qty
                              if (ItemParamDT.Qty > 1) {
                                return (
                                  <View style={{ borderBottomWidth: 1 }}>
                                    <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{sizeQty}</Text>
                                  </View>

                                )
                              } else {
                                return (
                                  <View style={{ borderBottomWidth: 1 }}>

                                    <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{ItemParamDT.Size + ', '}</Text>

                                  </View>
                                )
                              }
                            })}
                          </View>
                        </View>

                      </View>
                    </ScrollView>



                  </View>
                )

              }) : <></>}
            </View>
          </ScrollView>


        </ScrollView>
      </Modal>
      <Modal visible={isLoading}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
          <Text>Please Wait..</Text>
        </View>
      </Modal>

    </View>
  )
}
export default ItemStock