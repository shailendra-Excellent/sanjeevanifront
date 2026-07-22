import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, ImageBackground, ScrollView, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
import DefaultPreference from 'react-native-default-preference';
let TQty=0
const RackReport = () => {
    const scanRef = useRef(null);
    const [isFocus, setIsFocus] = useState(false);
    const [RackData, setRackData] = useState([]);
    const [ItemData, setItemData] = useState([])
    const [baseURL, setbaseURL] = useState('')
    const [compcode, setcompcode] = useState('')
    const [RackCode, setRackCode] = useState();
    const [fy, setfy] = useState('');
    const [ItemCode, setItemCode] = useState(0)
    const [isLoading, setisLoading] = useState(true)
    const [InventoryList, setInventoryList] = useState([])
    const [TotalQty,setTotalQty]= useState(0)
    useEffect(() => {
        DefaultPreference.get('BaseURL').then(function (BaseURL) {
            DefaultPreference.get('CompCode').then(function (compCode) {
                DefaultPreference.get('FY').then(function (Fy) {
                    setbaseURL(BaseURL);
                    setcompcode(compCode);
                    setfy(Fy);
                    getRackMaster(BaseURL, compCode, Fy)
                    callMasterData(BaseURL, compCode, Fy, 6, 0)
                })
            })
        })
    }, [])

    const callMasterData = async (BaseURL, compCode, Fy, MasterType, PartyGrp) => {
        setisLoading(true);
        try {
            console.log(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + PartyGrp)
            const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + PartyGrp)
            const response = await res.json();
            if (response.Status == 1) {
                setisLoading(false);
                if (MasterType == 6) {
                    setItemData(response.Data);
                }
            }
        } catch (e) {
            setisLoading(false)
            alert('Catch Error ' + e.message)
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

    const getRackInventory = async (code, Itemcode) => {
        setisLoading(true)
        try {
            console.log(baseURL + '/api/Values/GetRackInventory?CompCode=' + compcode + '&FY=' + fy + '&RackCode=' + code + '&ItemCode=' + Itemcode,)
            const res = await fetch(baseURL + '/api/Values/GetRackInventory?CompCode=' + compcode + '&FY=' + fy + '&RackCode=' + code + '&ItemCode=' + Itemcode,)
            const response = await res.json();
            // console.log('???????????????????',response) 
            if (response.Status == 1) {
                setInventoryList(response.Data);
                TQty=0
                response.Data.forEach(element => {
                    TQty=TQty+ element.Qty
                //   setTotalQty(TotalQty+element.Qty)
              });
              setTotalQty(TQty)
                setisLoading(false)
            }
            else {
                setisLoading(false)
                alert(response.Message)
            }
        } catch (err) {
            setisLoading(false)
            alert(err)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Rack :</Text>
                    </View>
                    <View style={styles.container}>
                        <Dropdown
                            style={[styles.Dropdown, isFocus && { borderColor: 'gray' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            ref={scanRef}
                            data={RackData}
                            search
                            maxHeight={300}
                            labelField="Name"
                            valueField="Code"
                            placeholder={'Select Rack'}
                            searchPlaceholder="Search..."
                            // value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(Rack) => {
                                getRackInventory(Rack.Code, 0)
                                setRackCode(Rack.Code);
                                setItemCode(0)
                                // setRackName(Rack.Name)
                                setIsFocus(false);
                            }
                            }
                        />
                        <Dropdown
                            style={[styles.Dropdown, { marginTop: 5 }, isFocus && { borderColor: 'gray', marginTop: 5 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            ref={scanRef}
                            data={ItemData}
                            search
                            maxHeight={300}
                            labelField="Name"
                            valueField="Code"
                            placeholder={'Select Item'}
                            searchPlaceholder="Search..."
                            // value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => {
                                getRackInventory(0, item.Code)
                                setItemCode(item.Code)
                                setRackCode(0)
                                setIsFocus(false);
                            }
                            }
                        />
                    </View>


                    {/* <View style={showAddItem == true ? null : { display: "none" }} > */}

                    <View   style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'black', borderWidth: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: 'black', }}>
                            <View style={{ width: '45%', borderRightColor: 'white', borderRightWidth: 1 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>{ItemCode !== 0 ? 'Rack' : 'ITEM NAME'}</Text>
                            </View>
                            <View style={{ width: '20%', borderRightColor: 'white', borderRightWidth: 1 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>COLOR</Text>
                            </View>

                            <View style={{ width: '20%', borderRightColor: 'white', borderRightWidth: 1 }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>SIZE</Text>
                            </View>

                            <View style={{ width: '15%', }}>
                                <Text style={{ padding: 8, fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: 15 }}>QTY</Text>
                            </View>
                        </View>
                        <FlatList 
                            data={InventoryList}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1 }}>
                                        <View style={{ width: '45%', borderRightColor: 'black', borderRightWidth: 1 }}>
                                            {ItemCode !== 0 ? <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15, textAlign: 'left' }}>{item.RackName}</Text>
                                                : <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15, textAlign: 'left' }}>{item.ItemName}</Text>
                                            }
                                        </View>
                                        <View style={{ width: '20%', borderRightColor: 'black', borderRightWidth: 1 }}>
                                            <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Color}</Text>
                                        </View>

                                        <View style={{ width: '20%', borderRightColor: 'black', borderRightWidth: 1 }}>
                                            <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Size}</Text>
                                        </View>

                                        <View style={{ width: '15%', }}>
                                            <Text style={{ padding: 8, color: 'black', textAlign: 'center', fontSize: 15 }}>{item.Qty}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                        <View style={{justifyContent:'flex-end'}}>
                            <Text style={{fontSize:16,fontWeight:'700',color:'red'}}> Total Qty : {TotalQty} </Text>
                        </View>
                    </View>
                    {/* </View> */}
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
        backgroundColor: 'white'
    },
    Dropdown: {
        height: 45,
        borderColor: 'gray',
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

});

export default RackReport