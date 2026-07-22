import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image, ImageBackground, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox, Button } from 'react-native-paper';
import DefaultPreference from 'react-native-default-preference';
import RackMaster from './RackMaster';




const RackModify = ({ navigation }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [showMaterialCenter, setShowMaterialCenter] = useState(false);
    const [showSave, setShowSave] = useState(false);
    const [showRack, setShowRack] = useState(false);
    const [showRackDrop, setShowRackDrop] = useState(true);
    const [showcheckbox, setShowcheckbox] = useState(false);
    const [showtextinput, setShowtextinput] = useState(false);
    const [text, setText] = React.useState("");
    const [materialcenter, setMaterialCenter] = useState([])
    const [RackData, setRackData] = useState([])
    const [mcname, setmcname] = useState('')
    const [mccode, setmccode] = useState(0)
    const [baseURL, setbaseURL] = useState('')
    const [compcode, setcompcode] = useState('')
    const [RackCode, setRackCode] = useState(0)
    const [fy, setfy] = useState('')
    const [showsavebtn, setshowsavebtn] = useState(false)
    const [Rack, setRack] = useState('')
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        DefaultPreference.get('BaseURL').then(function (BaseURL) {
            DefaultPreference.get('CompCode').then(function (compCode) {
                DefaultPreference.get('FY').then(function (Fy) {
                    setbaseURL(BaseURL);
                    setcompcode(compCode);
                    setfy(Fy);
                    getBusyMaster(BaseURL, compCode, Fy)
                    getRackMaster(BaseURL, compCode, Fy)

                })
            })
        })
    }, [])


    const getBusyMaster = async (BaseURL, compCode, Fy) => {
        try {
            const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + 11 + '&ParentGrp=' + 0)
            const response = await res.json();
            if (response.Status == 1) {
                setisLoading(false)
                setMaterialCenter(response.Data)
                // console.log(materialcenter)
            } else {
                setisLoading(false)
                // console.log(response.Message)
            }
        } catch (err) {
            setisLoading(false)
            alert(err)

        }
    }

    const getRackMaster = async (BaseURL, compCode, Fy) => {
        try {
            const res = await fetch(BaseURL + '/api/Values/GetRackMaster?CompCode=' + compCode + '&FY=' + Fy)
            const response = await res.json();
            // console.log("********", response)
            if (response.Status == 1) {
                setisLoading(false)
                setRackData(response.Data)
                // console.log(materialcenter)
            } else {
                setisLoading(false)
                alert(response.Message)
            }
        } catch (err) {
            setisLoading(false)
            alert(err)
        }
    }


    const onClickSave = async () => {
        if (Rack !== "") {
            if (checked == true) {
                if (mccode == 0) {
                    alert('Select Material Center')
                }
                else {
                    let TagMC = 0
                    let MCCode = 0
                    if (showMaterialCenter == true) {
                        TagMC = 1,
                            MCCode = mccode
                    }
                    let jsondata = {
                        Name: Rack,
                        Code: RackCode,
                        MCCode: mccode,
                        TagMC: TagMC,
                    }
                    // console.log('r4try', jsondata)
                    setisLoading(true)
                    try {
                        const response = await fetch(baseURL + "/api/Values/SaveRackMaster?CompCode=" + compcode + "&FY=" + fy, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(jsondata)
                        });
                        const json = await response.json();
                        alert(json.Msg)
                        getRackMaster(baseURL, compcode, fy)
                        navigation.navigate(RackMaster)
                    } catch (err) {
                        setisLoading(false)
                        alert(err)
                    }
                }
            }
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Rack :</Text>
                </View>
                <View style={styles.container}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'red' }]}
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
                            setRack(Rack.Name)
                            setRackCode(Rack.Code)
                            setIsFocus(false);
                            setShowRack(true)
                            setshowsavebtn(true)
                            setShowcheckbox(true)
                            setShowMaterialCenter(true)
                            setShowRack(true)
                            if (Rack.TagMC > 0) {
                                setChecked(true);
                                setmccode(Rack.MCCode)
                                setmcname(Rack.MCName)
                            } else {
                                setChecked(false)
                                setmccode(0)
                                setmcname('')

                            }
                        }}
                    />
                </View>
                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Change Rack Name :</Text>
                </View>
                <View style={{
                    padding: 10, maxWidth: "90%", borderRadius: 10, height: 50, marginBottom: 20,
                    justifyContent: "center", backgroundColor: 'white', top: 10, borderWidth: 1, left: 20, borderRadius: 15, borderColor: 'red'
                }}>
                    <TextInput
                        style={{ maxWidth: '80%', fontSize: 15, height: 70, color: "black" }}
                        placeholder="Enter Rack Name"
                        placeholderTextColor="#003f5c"
                        value={Rack}
                        defaultValue={Rack}
                        onChangeText={text => {
                            setRack(text)
                        }}
                    />
                </View>
                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Check Material Center, if required:</Text>
                </View>
                <View style={{ height: '18%', marginBottom: -18 }}>
                    <View style={{ paddingTop: 4, top: 10, paddingBottom: 5, borderRadius: 15, width: '91%', marginLeft: 15, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', right: 15 }}>
                            <Checkbox
                                style={{}}
                                status={checked ? 'checked' : 'unchecked'}
                                value={checked}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            />
                            <View style={{ right: 60, top: 3 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>Material Center</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Material Center :</Text>
                </View>
                <View style={[styles.container, { height: 100, marginBottom: 10 }]}>
                    {/* {rendermaterialLabel()} */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'red' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={materialcenter}
                        maxHeight={300}
                        labelField="Name"
                        // defaultValue={mcname}
                        // value={mcname}
                        // valueField="Code"
                        placeholder={mcname == '' ? 'Select Material Center' : mcname}
                        // TextInput='Material Center'
                        searchPlaceholder="Search..."
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setmccode(item.Code)
                            setmcname(item.Name)
                        }}
                    />
                </View>
            </ScrollView>
            <View style={{ alignItems: 'flex-end' }} >
                <TouchableOpacity onPress={() => {
                    onClickSave()
                }}
                    style={{ backgroundColor: 'green' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text
                            style={{ padding: 10, width: '100%', fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            SAVE
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <View style={{ justifyContent: 'flex-end', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => {
                        onClickSave()
                    }}
                        style={{ backgroundColor: 'green', top: 70 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text
                                style={{ padding: 5, width: '100%', fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                SAVE
                            </Text>
                        </View>
                    </TouchableOpacity>
            </View> */}
            <Modal visible={isLoading} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size={35} />
                    <Text>Please Wait...</Text>
                </View>
            </Modal>
        </View >
    )
}

export default RackModify

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    inputcontainer: {
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'red',
        borderWidth: 1.0,
        borderRadius: 15,
        paddingHorizontal: 8,
    },
    TextInput: {
        height: 20,
        borderColor: 'green',
        borderWidth: 2.0,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    labelinput: {
        position: 'absolute',
        backgroundColor: 'red',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
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