import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ImageBackground, Modal, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox, Button } from 'react-native-paper';
import DefaultPreference from 'react-native-default-preference';
import RackModify from './RackModify';



const RackMaster = ({ navigation }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [showMaterialCenter, setShowMaterialCenter] = useState(false);
    const [showSave, setShowSave] = useState(false);
    const [showRack, setShowRack] = useState(true);
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

    const rendermaterialLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Material Center
                </Text>
            );
        }
        return null;
    };

    const onClickSave = async () => {
        if (text == "") {
            alert('Please Enter Rack Master Name')
        } else {
            let TagMC = 0
            let MCCode = 0
            if (showMaterialCenter == true) {
                TagMC = 1,
                    MCCode = mccode
            }
            let jsondata = {
                Name: text,
                Code: RackCode,
                MCCode: MCCode,
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
                setmccode(0)
                setmcname('')
                setChecked(false)
                setText('')
                alert(json.Msg)
                getRackMaster(baseURL, compcode, fy)
            } catch (err) {
                setisLoading(false)
                alert(err)
            }
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <ScrollView style={{ backgroundColor: '#fff', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'azure' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10 }}>
                        <Image
                            style={{ width: 35, height: 35 }}
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10747/10747218.png' }}
                        />

                        <Text style={{ width: 100, height: 40, padding: 5, fontSize: 20, fontWeight: 'bold', color: 'black' }} onPress={async () => {
                            navigation.navigate(RackModify)
                        }}>
                            Modify
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Enter Rack Name :</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', padding: 10 }}>
                    <View style={{
                        padding: 10, width: "90%", borderRadius: 10, height: 50,
                        justifyContent: "center", backgroundColor: 'white', borderWidth: 1, borderColor: 'red'
                    }}>
                        {/* {renderLabel()} */}
                        <TextInput
                            style={{ maxWidth: '80%', fontSize: 15, height: 70, color: "black" }}
                            placeholder="Enter Rack"
                            placeholderTextColor="#003f5c"
                            value={text}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChangeText={text => {
                                setText(text)
                                // setshowsavebtn(true)
                            }}
                        />
                    </View>
                </View>


                <View style={{ padding: 10, backgroundColor: '#ced4da' }}>
                    <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Check Material Center, if required:</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                    <Checkbox
                        style={{}}
                        status={showMaterialCenter ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                            setShowMaterialCenter(!showMaterialCenter)

                        }}
                    />
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Material Center</Text>

                </View>

                {/* </View> */}
                <View style={showMaterialCenter == true ? null : { display: "none" }}>
                    <View style={{ padding: 10, top: 10, backgroundColor: '#ced4da' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>Select Material Center :</Text>
                    </View>
                    <View style={{ padding: 16, top: 10 }}>
                        {/* {rendermaterialLabel()} */}
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'red' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            data={materialcenter}
                            maxHeight={300}
                            labelField="Name"
                            valueField="Code"
                            placeholder={'Select Material Center'}
                            TextInput='Material Center'
                            searchPlaceholder="Search..."
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setmccode(item.Code)
                                setmcname(item.Name)
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={{ alignItems: 'flex-end', }}>
                <TouchableOpacity
                    onPress={() => {
                        onClickSave()
                    }}
                    style={{ backgroundColor: 'green', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{ padding: 10, width: '100%', fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                        SAVE
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal visible={isLoading} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size={35} />
                    <Text>Please Wait...</Text>
                </View>
            </Modal>
        </View>
    )
}

export default RackMaster

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'red',
        borderWidth: 1.0,
        borderRadius: 15,
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