import { Pressable, View, Text, SafeAreaView, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ScrollView, Modal, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
import DefaultPreference from 'react-native-default-preference';
import RNBounceable from '@freakycoder/react-native-bounceable';
import ToasterMsg from './Components/ToasterMsg';
import Toast from 'react-native-root-toast';

let InValidBCN = [];
let TotalQty = 0;
let InvalidQty = 0
const RackEntry = ({ navigation }) => {
    const scanRef = useRef(null);
    const [value, setValue] = useState(null);
    const [RackData, setRackData] = useState([]);
    const [baseURL, setbaseURL] = useState('');
    const [compcode, setcompcode] = useState('');
    const [RackCode, setRackCode] = useState('');
    const [fy, setfy] = useState('');
    const [Rack, setRack] = useState('');
    const [BcnVal, setBcnVal] = useState('');
    const [showAddItem, setshowAddItem] = useState(false);
    const [ItemQty, setItemQty] = useState('');
    const [Qty, setQty] = useState('1')
    const [isLoading, setisLoading] = useState(true);
    const [DataEntry, setDataEntry] = useState([]);
    const [OffLineMode, setOffLineMode] = useState(true);
    const [OfLineData, setOffLineData] = useState([]);
    const [ShowInvaliddata, setShowInvaliddata] = useState(false)
    const [exData, setExData] = useState(1)
    const [TAmount, setTAmount] = useState(0);
    const [invalidQty, setInvalidQty] = useState(0);
    const [OflineExData, setoflineExData] = useState(0)
    useEffect(() => {
        DefaultPreference.get('BaseURL').then(function (BaseURL) {
            DefaultPreference.get('CompCode').then(function (compCode) {
                DefaultPreference.get('FY').then(function (Fy) {
                    DefaultPreference.get('RackEntry').then(function (RackEntry) {
                        // if (RackEntry !== null) {
                        //     setDataEntry(JSON.parse(RackEntry))
                        //     setshowAddItem(true)
                        // }
                        setbaseURL(BaseURL);
                        setcompcode(compCode);
                        setfy(Fy);
                        getRackMaster(BaseURL, compCode, Fy)
                    })
                })
            })
        })
    }, [])
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
                Alert.alert(response.Message)
            }
        } catch (err) {
            setisLoading(false)
            Alert.alert(err)
        }
    }
    const StoreOffLineData = async () => {
        // let checkIC = OfLineData.find(item =>
        //     item.BCN == BcnVal
        // );
        let obj = {
            BCN: BcnVal,
            Qty: 1,
            Status: 1
        }
        OfLineData.push(obj);
        setoflineExData(OflineExData + 1)
        TotalQty = 0
        OfLineData.forEach(element => {
            TotalQty = parseInt(TotalQty) + parseInt(element.Qty);
        });
        setTAmount(TotalQty)
        setBcnVal('');
        scanRef.current.focus();
        // if (checkIC == undefined) {
        // let obj = {
        //     BCN: BcnVal,
        //     Qty: 1,
        //     Status: 1
        // }
        //     OfLineData.push(obj);
        //     TotalQty = 0
        //     OfLineData.forEach(element => {
        //         TotalQty = parseInt(TotalQty) + parseInt(element.Qty);
        //     });
        //     setTAmount(TotalQty)
        //     setBcnVal('');
        //     scanRef.current.focus();
        // } else {
        //     checkIC["Qty"] = parseInt(checkIC.Qty) + 1;
        //     setBcnVal('');
        //     scanRef.current.focus();
        // }
    }

    const getCallAPI = async (BcnVal, index, OflineQty) => {
        setisLoading(true);
        try {
            console.log(baseURL + '/api/Values/SerachBCN?CompCode=' + compcode + '&FY=' + fy + '&BCN=' + BcnVal)
            const res = await fetch(baseURL + '/api/Values/SerachBCN?CompCode=' + compcode + '&FY=' + fy + '&BCN=' + BcnVal)
            const response = await res.json();
            setisLoading(false)
            if (response.Status == 1) {
                setBcnVal('');
                setOffLineMode(true)
                // setOffLineMode(false);
                var Custom_Bcn = "BCN"
                response[Custom_Bcn] = BcnVal
                var Custom_RackCode = "RackCode"
                response[Custom_RackCode] = RackCode
                var Custom_Qty = "QTY"
                response[Custom_Qty] = OflineQty
                // console.log(response)
                // let checkIC = DataEntry.find(item =>
                //     item.BCN == response.BCN
                // );
                const obj = {
                    RackCode: RackCode,
                    BCN: response.BCN,
                    ItemCode: response.ItemCode,
                    ItemName: response.ItemName,
                    Color: response.Color,
                    Size: response.Size,
                    Qty: response.QTY,
                }
                //    console.log(obj)
                DataEntry.push(obj);
                // setDataEntry(oldArray => [...oldArray, obj]);

                setExData(exData + 1);

                // console.log('%%%%%%%%%%%%', checkIC)
                // if (checkIC == undefined) {
                //     DataEntry.push(obj);

                //     DefaultPreference.set('RackEntry', JSON.stringify(DataEntry));
                //     setBcnVal('');
                //     setshowAddItem(true);
                //     setisLoading(false);
                //     scanRef.current.focus();
                // } else {
                //     checkIC["Qty"] = parseInt(checkIC.Qty) + 1
                //     DefaultPreference.set('RackEntry', JSON.stringify(DataEntry))
                //     setBcnVal('')
                //     setisLoading(false)
                //     scanRef.current.focus();
                // }
                setTAmount(0)
                TotalQty = 0
                DataEntry.forEach(element => {
                    TotalQty = parseInt(TotalQty) + parseInt(element.Qty);
                });
                setTAmount(TotalQty);
            } else {
                Toast.show(response.Message, {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                    backgroundColor: '#2F2F30',
                    textColor: '#fff'
                });
                setBcnVal('');
                setOffLineData([]);
                setQty(0);
                let obj = {
                    BCN: BcnVal,
                    Qty: Qty,
                    Status: 1,
                    ind: index + 1
                }
                InValidBCN.push(obj);
                InValidBCN.sort((firstItem, secondItem) => firstItem.ind - secondItem.ind);

                InValidBCN.forEach(element => {
                    InvalidQty = InvalidQty + element.Qty
                });
                setInvalidQty(InvalidQty);
                setisLoading(false);
            }
        } catch (err) {
            Alert.alert(err);
        }
    }

    const onClickSave = async () => {
        if (RackCode == '' || RackCode == undefined || RackCode == null) {
            Alert.alert('Please Select Rack Master');
            return;
        }
        if (parseInt(Qty) > parseInt(ItemQty)) {
            Alert.alert('You have only ' + ItemQty + ' Qty');
            return
        }
        // console.log(DataEntry)
        setisLoading(true);
        try {
            const response = await fetch(baseURL + "/api/Values/AddItemInRack?CompCode=" + compcode + "&FY=" + fy, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(DataEntry)
            });
            const json = await response.json();
            if (json.Status == 1) {
                setisLoading(false);
                Alert.alert('Alert', json.Message, [
                    { text: 'OK', onPress: () => clearData() },
                ]);
                // alert(json.Message);
            } else {
                setisLoading(false);
                Alert.alert(json.Message);
            }
        } catch (err) {
            setisLoading(false);
            Alert.alert(err);
        }
        // console.log('$$$$$$$$$', JSONData)

    }
    const clearData = () => {
        DefaultPreference.clear('RackEntry');
        setDataEntry([])
        setBcnVal('');
        setshowAddItem(false);
        setRackCode('')
        setQty('');
        scanRef.current.focus();
    }

    const ScanAllItem = () => {
        OfLineData.map((item, index) => {
            getCallAPI(item.BCN, index, item.Qty)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10, backgroundColor: '#ced4da', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Rack :</Text>
                        <RNBounceable
                            onPress={() => {
                                setBcnVal('');
                                InValidBCN = []
                                if (OffLineMode == true) {
                                    ToasterMsg({ msg: 'Start offLine Rack Entry' });
                                    setTAmount(0);
                                    setDataEntry([]);
                                    setExData(exData + 1)
                                    setOffLineMode(false)
                                } else {
                                    setOffLineMode(true);
                                    setTAmount(0);
                                    setOffLineData([]);
                                    setoflineExData(OflineExData + 1)
                                    ToasterMsg({ msg: 'Start Online Rack Entry' })
                                }

                            }}
                        >
                            {OffLineMode == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3287/3287922.png' }} style={{ height: 40, width: 40, tintColor: '#000' }} />
                                : <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10252/10252710.png' }} style={{ height: 40, width: 40, tintColor: '#000' }} />}
                        </RNBounceable>
                    </View>
                    <View style={styles.container}>
                        <Dropdown
                            style={[styles.Dropdown]}
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
                            // onFocus={() => setIsFocus(true)}
                            // onBlur={() => setIsFocus(false)}
                            onChange={Rack => {
                                setRack(Rack.Name)
                                setRackCode(Rack.Code)
                                // setIsFocus(false);
                            }}
                        />
                    </View>
                    <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Scan Item :</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{
                            padding: 10, width: "95%", borderRadius: 10,
                            justifyContent: "center", backgroundColor: 'white', top: 10, borderWidth: 1, left: 8, borderRadius: 15, borderColor: 'red'
                        }}>
                            <TextInput
                                ref={scanRef}
                                style={{ maxWidth: '85%', fontSize: 15, height: 35, color: "black", padding: 5 }}
                                placeholder="Scan BCN Code"
                                placeholderTextColor="#003f5c"
                                onEndEditing={() => {

                                    if (BcnVal == '') {
                                        ToasterMsg({ msg: 'Please Scan BarCode' })
                                        return;
                                    }
                                    if (OffLineMode == true) {
                                        getCallAPI(BcnVal, 0, 1);
                                        return;
                                    }
                                    if (OffLineMode == false) {
                                        StoreOffLineData()
                                        return;
                                    }
                                    // if (OffLineMode == true) {
                                    //     if (BcnVal == '') {
                                    // ToasterMsg({ msg: 'Please Scan BarCode' })
                                    // return;
                                    //     }
                                    //     StoreOffLineData()
                                    //     // getCallAPI(BcnVal, 1)
                                    // } else {
                                    //     if (BcnVal == '') {
                                    //         ToasterMsg({ msg: 'Please Scan BarCode' })
                                    //         return;
                                    //     }
                                    //     getCallAPI(BcnVal, 1)
                                    //     // StoreOffLineData()
                                    // }
                                }}
                                value={BcnVal}
                                autoFocus={true}
                                onChangeText={(txt) => {
                                    setBcnVal(txt)
                                }}
                            />
                        </View>
                    </View>
                    {InValidBCN.length > 0 ? <View style={{ alignItems: 'flex-end' }}>
                        <RNBounceable onPress={() => {
                            setShowInvaliddata(true)
                        }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: 'red', padding: 5 }}>Show Invalid BCN</Text>
                        </RNBounceable>
                    </View> : null}
                    {OffLineMode == true ? <ScrollView horizontal='true' showsHorizontalScrollIndicator='false' style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>
                            {/* <View style={{ width: '26%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8, }}>
                                    <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>BCN</Text>
                                </View> */}

                            <View style={{ width: '50%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>ITEM NAME</Text>
                            </View>

                            <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>COLOR</Text>
                            </View>

                            <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>SIZE</Text>
                            </View>

                            <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
                            </View>
                        </View>
                        <FlatList
                            // nestedScrollEnabled={true}
                            // scrollEnabled={false}
                            data={DataEntry}
                            extraData={exData}
                            renderItem={({ item, index }) => {
                                // console.log('###########', DataEntry)
                                return (
                                    <View style={{ flexDirection: 'row', backgroundColor: '#ced4da' }}>
                                        {/* <View style={{ width: '26%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8, }}>
                                                <Text style={{ padding: 11, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.BCN}</Text>
                                            </View> */}

                                        <View style={{ width: '50%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.ItemName}</Text>
                                        </View>

                                        <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Color}</Text>
                                        </View>

                                        <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Size}</Text>
                                        </View>

                                        <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Qty}</Text>
                                        </View>

                                    </View>
                                )
                            }}
                        />
                    </ScrollView> : <ScrollView horizontal='true' showsHorizontalScrollIndicator='false' style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>

                            <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>SrNo</Text>
                            </View>

                            <View style={{ width: '60%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>BCN</Text>
                            </View>

                            {/* <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                    <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>SIZE</Text>
                                </View> */}

                            <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
                            </View>
                        </View>
                        <FlatList
                            //  nestedScrollEnabled={true}
                            //     scrollEnabled={false}
                            extraData={(OflineExData)}
                            data={OfLineData}
                            renderItem={({ item, index }) => {
                                // console.log('###########', item)
                                return (
                                    <View style={{ flexDirection: 'row', backgroundColor: '#ced4da' }}>
                                        {/* <View style={{ width: '26%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8, }}>
                                                <Text style={{ padding: 11, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.BCN}</Text>
                                            </View> */}
                                        <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{index + 1}</Text>
                                        </View>
                                        <View style={{ width: '60%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.BCN}</Text>
                                        </View>
                                        {/* <View style={{ width: '15%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                                <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Size}</Text>
                                            </View> */}
                                        <View style={{ width: '20%', borderBottomWidth: 0.8, borderBottomColor: 'white', borderTopColor: 'white', borderTopWidth: 0.8 }}>
                                            <Text style={{ padding: 12, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Qty}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </ScrollView>}

                    {/* </View> */}
                </View>
            </ScrollView>
            <View style={{ height: '15%', padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: 'red' }}>Total Qty : {TAmount}</Text>
                <TouchableOpacity
                    style={{ padding: 10, width: '40%', backgroundColor: 'green', borderRadius: 10, height: 40 }}
                    onPress={() => {
                        // console.log(global.OffLineMode)
                        if (OffLineMode == true) {
                            onClickSave()
                        } else {
                            ScanAllItem()
                        }
                    }}>
                    <Text
                        style={{ width: '100%', fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                        {OffLineMode == true ? 'ADD' : 'Scan All Design'}
                    </Text>
                </TouchableOpacity>

            </View>
            <Modal visible={isLoading} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size={35} />
                    <Text>Please Wait...</Text>
                </View>
            </Modal>
            <Modal visible={global.OffLineMode} transparent={true}>
                <></>
            </Modal>
            <Modal visible={ShowInvaliddata} transparent={true} onRequestClose={() => {
                setShowInvaliddata(false)
            }}>
                <Pressable onPress={() => {
                    setShowInvaliddata(false)
                }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable onPress={() => {
                        setShowInvaliddata(true)
                    }} style={styles.InValidBcnViewSty}>
                        <View style={{ alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontSize: 16, color: 'red', fontWeight: '700' }}>Invalid BCN</Text>
                        </View>
                        <FlatList style={{}} data={InValidBCN} extraData={exData} keyExtractor={({ item, index }) => { index }}
                            renderItem={({ item, index }) => {

                                return (
                                    <View style={{ width: '100%', borderWidth: 0.5, height: 50, flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                        <Text style={{ width: 50, fontSize: 13, fontWeight: '700' }}>{item.ind}.</Text>
                                        <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.BCN}</Text>
                                    </View>
                                )
                            }}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <RNBounceable onPress={() => {
                                Alert.alert('Wait !', 'Do you want to clear Invalid BCN', [
                                    {
                                        text: 'No',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    { text: 'YES', onPress: () => { InValidBCN = []; setShowInvaliddata(false) } },
                                ]);
                            }} style={{ height: 40, width: 100, backgroundColor: '#000', borderRadius: 6, margin: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Clear Data</Text>

                            </RNBounceable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white'
    },
    Dropdown: {
        height: 50,
        borderColor: 'red',
        borderWidth: 1.0,
        borderRadius: 15,
        paddingHorizontal: 8,
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
    InValidBcnViewSty: {
        width: '90%',
        backgroundColor: '#fff',
        height: '40%',
        borderWidth: 0.5,
        borderColor: '#ABACAC'
    }

});




export default RackEntry