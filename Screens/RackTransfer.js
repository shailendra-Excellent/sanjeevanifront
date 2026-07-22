import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, ImageBackground, ScrollView, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import {AsyncStorage} from "@react-native-async-storage/async-storage";
import { Dropdown } from 'react-native-element-dropdown';
import DefaultPreference from 'react-native-default-preference';

const RackTransfer = ({ navigation }) => {
  const scanRef = useRef(null);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [RackData, setRackData] = useState([])
  const [baseURL, setbaseURL] = useState('')
  const [compcode, setcompcode] = useState('')
  const [RTCodeFrom, setRTCodeFrom] = useState(0)
  const [fy, setfy] = useState('')
  const [RTNameFrom, setRTNameFrom] = useState('')
  const [BcnVal, setBcnVal] = useState('');
  const [showAddItem, setshowAddItem] = useState(false)
  const [RTNameTo, setRTNameTo] = useState('')
  const [RTCodeTo, setRTCodeTo] = useState('')
  const [isLoading, setisLoading] = useState(true)
  const [List, setList] = useState([])

  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (BaseURL) {
      DefaultPreference.get('CompCode').then(function (compCode) {
        DefaultPreference.get('FY').then(function (Fy) {
          DefaultPreference.get('RackData').then(function (RackData) { 
            // console.log('Reack Data');
            // if(RackData !==null){
            //   // console.log(RackData)
            //   setList(JSON.parse(RackData));
            //   setshowAddItem(true)  
            // }
          setbaseURL(BaseURL);
          setcompcode(compCode);
          setfy(Fy);
          getRackMaster(BaseURL, compCode, Fy);
          // getRackTransferData()
        })
      })
      })
    })
  }, [])

   const getRackTransferData=async()=>{
    const myArray = await AsyncStorage.getItem('RackData');
    // console.log('my Array');
    // console.log(myArray)
    if(myArray !==null){
      setList(JSON.parse(myArray))
    }

   }
  const getRackMaster = async (BaseURL, compCode, Fy) => {
    setisLoading(true)
    try {
      const res = await fetch(BaseURL + '/api/Values/GetRackMaster?CompCode=' + compCode + '&FY=' + Fy)
      const response = await res.json();
      // console.log(response)
      if (response.Status == 1) {
        setRackData(response.Data)
        // console.log(materialcenter)
        setisLoading(false)
      } else {
        setisLoading(false)
        alert(response.Message)
      }
    } catch (err) {
      setisLoading(false)
      alert(err)
    }
  }

  // const getCallAPI = async () => {
  //   try {
  //     console.log(baseURL + '/api/Values/SerachBCN?CompCode=' + compcode + '&FY=' + fy + '&BCN=' + BcnVal)
  //     const res = await fetch(baseURL + '/api/Values/SerachBCN?CompCode=' + compcode + '&FY=' + fy + '&BCN=' + BcnVal)
  //     const response = await res.json();
  //     console.log('******', response)

  //     if (response.Status == 1) {
  //       setItemColor(response.Color)
  //       setItemSize(response.Size)
  //       setItemName(response.ItemName)
  //       setItemQty(response.Stock)
  //       setItemCode(response.ItemCode);
  //       setQty(1)
  //       setshowAddItem(true)
  //       // console.log(stock)
  //     } else {

  //       alert(response.Message)
  //     }
  //   } catch (err) {
  //     alert(err)
  //   }
  // }

  const RackItemScan = async () => {
    try {
      console.log(baseURL + '/api/Values/RackItemSacn?CompCode=' + compcode + '&FY=' + fy + '&RackCode=' + RTCodeFrom + '&BCN=' + BcnVal)
      const res = await fetch(baseURL + '/api/Values/RackItemSacn?CompCode=' + compcode + '&FY=' + fy + '&RackCode=' + RTCodeFrom + '&BCN=' + BcnVal)
      const response = await res.json();
      // console.log('$$$$$$', response)
      if (response.Status == 1) {

        // console.log('$$$$$$', response.Data)

        // console.log(response.Data)
        // response.Data.forEach(element => {
        //   element.mainQty=element.Qty
        // });
        // var Custom_Qty = "QTY"
        // response[Custom_Qty] = "1"
        let checkBCN = List.find(item =>
          item.BCN.toLocaleUpperCase() == BcnVal.toLocaleUpperCase(),
        );

        if (checkBCN == undefined) {

          response.Data.mainQty = "1";
          response.Data.Qty="1"
          List.push(response.Data)
          let AsyncLocalData=[]
           AsyncLocalData.push(response.Data);
          //  console.log(AsyncLocalData)
          DefaultPreference.set('RackData',JSON.stringify(AsyncLocalData))
          setshowAddItem(true);
          setBcnVal('');
          scanRef.current.focus();
        } else {
          scanRef.current.focus();
          let findindex= List.indexOf(checkBCN);
          // console.log('Index Is '+ findindex);
          // console.log( "main qty "+checkBCN.mainQty)
          // console.log( "qty "+checkBCN.Qty)

          if(parseInt(checkBCN.mainQty)<parseInt(checkBCN.Qty)){
            checkBCN.mainQty=parseInt(checkBCN.mainQty)+1;
            List.slice(findindex,1,checkBCN);
            DefaultPreference.set('RackData',JSON.stringify(List))

            setshowAddItem(true)
            setBcnVal('')
            scanRef.current.focus();
          }else{
            alert('Only '+ response.Data.Qty+ ' Qty Left in '+RTNameFrom );
            setshowAddItem(true)
            setBcnVal('')
            scanRef.current.focus();
          }
         
        }


      } else {
        alert(response.Message)
        setBcnVal('')
      }
    } catch (err) {
      alert(err)
    }
  }

  const onClickSave = async () => {
    if (RTCodeFrom == "") {
      alert('Please Select Rack From')
    } else if (RTCodeTo == "") {
      alert('Please Select Rack To')
    } else {
      // const JSONData = {
      //   List: List
      // }
      console.log(JSON.stringify(List))
      setisLoading(true)
      try {
        const response = await fetch(baseURL + "/api/Values/RackTransfer?CompCode=" + compcode + "&FY=" + fy + "&RackFrom=" + RTCodeFrom + "&RackTo=" + RTCodeTo, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(List)
        });
        const json = await response.json();
        // console.log('sdfghhjhs')
        // console.log(json)
        if (json.Status == 1) {
          alert(json.Message)
          setisLoading(false);
          DefaultPreference.clear('RackData')
          navigation.goBack()
          // clearData()
        } else {
          setisLoading(false)
          // alert(json.Message)
        }
      } catch (err) {
        setisLoading(false)
        alert(err)
      }
    }
  }


  const clearData = () => {
    setBcnVal('');
    setshowAddItem(true);
    setRTCodeFrom('');
    setRTCodeTo('')
    scanRef.current.focus();
  }


  const RenderComponent = props => {
    return (
      <TextInput
        key={props.index}
        style={{ padding: 8, color: 'black', fontWeight: 'bold', backgroundColor: '#ced4da', textAlign: 'center', fontSize: 15, borderTopColor: 'white', borderTopWidth: 0.8, borderBottomWidth: 0.8, borderBottomColor: 'white' }}
        defaultValue={props.data[props.index].Qty.toString()}
        keyboardType="numeric"
        onChangeText={(text) => {
          let newArray = [...props.data];
          newArray[props.index].Qty = text;
          newArray.map(function (item) {
            if (item.Qty > item.mainQty) {
              alert('Enter Value is more than Stock Value');
            } else {
            }
          });
        }}
      />
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <View style={{ flex: 1 }}>

          {/* <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Rack Transfer From :</Text>
          </View> */}
          <View style={styles.container}>

            <Dropdown
              style={[styles.Dropdown, isFocus && { borderColor: 'red' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={RackData}
              search
              maxHeight={300}
              labelField="Name"
              valueField="Code"
              placeholder={'From Rack'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={Rack => {
                setRTNameFrom(Rack.Name)
                setRTCodeFrom(Rack.Code)
                // setIsFocus(false);
              }
              }
            />
             <Dropdown
              style={[styles.Dropdown, isFocus && { borderColor: 'red' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={RackData}
              search
              maxHeight={300}
              labelField="Name"
              valueField="Code"
              placeholder={'To Rack'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={Rack => {
                if (RTNameFrom !== Rack.Name) {
                  setRTNameTo(Rack.Name)
                  setRTCodeTo(Rack.Code)
                  setIsFocus(false);
                } else {
                  alert('You Cannot Select Same Rack')
                }
              }
              }
            />
          </View>

          {/* <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Rack Transfer To :</Text>
          </View>
          <View style={styles.container}>
            <Dropdown
              style={[styles.Dropdown, isFocus && { borderColor: 'red' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={RackData}
              search
              maxHeight={300}
              labelField="Name"
              valueField="Code"
              placeholder={'Select Rack'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={Rack => {
                if (RTNameFrom !== Rack.Name) {
                  setRTNameTo(Rack.Name)
                  setRTCodeTo(Rack.Code)
                  setIsFocus(false);
                } else {
                  alert('You Cannot Select Same Rack')
                }
              }
              }
            />
          </View> */}

          <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Scan Item To Transfer :</Text>
          </View>
          <View style={{ padding: 10 }}>
            <View style={{
              padding: 10, width: "95%", borderRadius: 10, height: 50, marginBottom: 20,
              justifyContent: "center", backgroundColor: 'white', top: 10, borderWidth: 1, left: 8, borderRadius: 15, borderColor: 'gray'
            }}>
              <TextInput
                ref={scanRef}
                style={{ maxWidth: '85%', fontSize: 15, height: 70, color: "black", left: 10 }}
                placeholder="Scan BCN Code"
                placeholderTextColor="#003f5c"
                onSubmitEditing={() => {
                  RackItemScan()
                }}
                value={BcnVal}
                autoFocus={true}
                onChangeText={(txt) => {
                  setBcnVal(txt)
                }}
              />
            </View>
          </View>

          <View style={showAddItem == true ? null : { display: "none" }} >
            <ScrollView horizontal='true' showsHorizontalScrollIndicator='false' style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>
                <View style={{ width: '26%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8, }}>
                  <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>BCN</Text>
                </View>

                <View style={{ width: '30%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                  <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>ITEM NAME</Text>
                </View>

                <View style={{ width: '18%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                  <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>COLOR</Text>
                </View>

                <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                  <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>SIZE</Text>
                </View>

                <View style={{ width: '14%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                  <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
                </View>
              </View>
              <FlatList
                data={List}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ flexDirection: 'row', backgroundColor: '#ced4da' }}>
                      <View style={{ width: '26%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8, }}>
                        <Text style={{ padding: 11, fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: 15 }}>{item.BCN}</Text>
                      </View>

                      <View style={{ width: '30%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                        <Text style={{ padding: 12, fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: 15 }}>{item.ItemName}</Text>
                      </View>

                      <View style={{ width: '18%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                        <Text style={{ padding: 12, fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Color}</Text>
                      </View>

                      <View style={{ width: '13%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                        <Text style={{ padding: 12, fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Size}</Text>
                      </View>
                      <Text style={{ padding: 8, color: 'black', fontWeight: 'bold', backgroundColor: '#ced4da', textAlign: 'center', fontSize: 15, borderTopColor: 'white', borderTopWidth: 0.8, borderBottomWidth: 0.8, borderBottomColor: 'white' }}
                      >{item.mainQty}</Text>
                      {/* <RenderComponent
                        item={item}
                        index={index}
                        data={List}
                        setData={List}
                      /> */}
                    </View>
                  )
                }}
              />
            </ScrollView>
          </View>
        </View>

      </ScrollView>
      <View style={{ width: '100%', height: '15%', position: 'relative', padding: 0 }}>
        <TouchableOpacity
          style={{ padding: 10, width: '30%', backgroundColor: 'green', left: 240, borderRadius: 10 }}
          onPress={() => {
            onClickSave()
          }}>
          <Text
            style={{ width: '100%', fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
            UPDATE
          </Text>
        </TouchableOpacity>

      </View>
      <Modal visible={isLoading} >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <ActivityIndicator size={35} />
          <Text>Please Wait...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection:'row'
  },
  Dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1.0,
    borderRadius: 7,
    paddingHorizontal: 8, 
    width:'49%',
    margin:3
  },
  placeholderinputStyle: {
    fontSize: 16,

  },
  selectedTextinputStyle: {
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },

});

export default RackTransfer