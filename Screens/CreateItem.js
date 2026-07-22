import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Hoshi } from 'react-native-textinput-effects';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DropdownComponent from './Components/ItemCreateComp/DropDownComp';
import ItemCreateInputCom from './Components/ItemCreateComp/ItemCreateInputCom';
import { FlatList } from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import ListInputComp from './Components/ItemCreateComp/ListInputComp';
import ToasterMsg from './Components/ToasterMsg';
import ItemSearchComp from './Components/ItemCreateComp/ItemSearchComp';
import SizeComp from './Components/ItemCreateComp/SizeComp';
import ColorList from './Components/ItemCreateComp/ColorList';

const CreateItem = ({ }) => {
    const [ItemInfo, setItemInfo] = useState({
        ItemName: '', ItemGroupName: 'Select Department', ItemGroupCode: '', ItemGroupData: [],
        unit: '', Price: '', itemData: [], itemCode: 0, FilterData: [], ColorName: 'Select Colour'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [colorData, setcolordata] = useState([])
    const [SizeData, setSizeData] = useState([])
    const [exData, setExData] = useState(1);
    const [colorDataexVal, setcolorDataexVal] = useState(1);
    const [ItemData, setItemData] = useState([]);
    const [NewColorData, setNewColorData] = useState([]);
    useEffect(() => {
        callItemMasterAPI(5, 0);
        CallColorSizeAPI(1);
        CallColorSizeAPI(2)
    }, [])
    const callItemMasterAPI = async (MasterType, Code) => {
        setIsLoading(true)
        //   console.log(global.BaseURL+'/api/Values/GetBusyMaster?CompCode='+global.CompCode+'&FY='+global.Fy+'&MasterType='+MasterType+'&ParentGrp='+Code);
        const res = await fetch(global.BaseURL + '/api/Values/GetBusyMaster?CompCode=' + global.CompCode + '&FY=' + global.Fy + '&MasterType=' + MasterType + '&ParentGrp=' + Code)
        const response = await res.json();
        setIsLoading(false)
        if (response.Status == 1) {
            if (MasterType == 5) {
                setItemInfo((PriVal) => ({
                    ...PriVal, ItemGroupData: response.Data
                }));
            } else {
                setItemInfo((PriVal) => ({
                    ...PriVal, FilterData: response.Data
                }));
            }

        } else {
            alert(response.Message)
        }

    }
    const CallColorSizeAPI = async (PType) => {
        setIsLoading(true)
        console.log(global.BaseURL + '/api/Values/GetBusyItemParameter?CompCode=' + global.CompCode + '&FY=' + global.Fy + '&ParamType=' + PType);
        const res = await fetch(global.BaseURL + '/api/Values/GetBusyItemParameter?CompCode=' + global.CompCode + '&FY=' + global.Fy + '&ParamType=' + PType,)
        const response = await res.json();
        setIsLoading(false);
        console.log(response);

        if (response.Status == 1) {
            if (PType == 1) {
                setcolordata(response.Data);
            } else {
                response.Data.forEach(element => {
                    element.Status = false
                });
                setSizeData(response.Data)
            }
            //         setItemInfo((PriVal)=>({
            //             ...PriVal,ItemGroupData:response.Data
            //           }));
            //     }else{
            //         setItemInfo((PriVal)=>({
            //             ...PriVal,FilterData:response.Data
            //           }));
        } else {
            alert(response.Message)
        }

    }
    const CheckInfoFun = () => {
        let ParamDT = [];
        SizeData.map((item, index) => {
            if (item.Color !== '' && item.Size !== '') {
                ParamDT.push(item)
            }
        })
        if (ItemInfo.ItemName == '' || ItemInfo.ItemName == null) {
            ToasterMsg({ msg: 'Please Enter Item Name' });
            return
        }
        if (ItemInfo.ItemGroupCode == '' || ItemInfo.ItemGroupCode == null) {
            ToasterMsg({ msg: 'Sekect Department First' });
            return
        }
        if (ItemInfo.ItemGroupCode == '' || ItemInfo.ItemGroupCode == null) {
            ToasterMsg({ msg: 'Sekect Department First' });
            return
        }
        if (ParamDT.length == 0) {
            ToasterMsg({ msg: 'Enter Item Color Information' });
            return
        }

        Alert.alert('Wait !', 'Do You Want to Create Item', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => SaveItem(ParamDT) },
        ]);
    }
    const SaveItem = async (ParamDT) => {
        //    console.log(ParamDT);
        setIsLoading(true)
        let json = {
            Name: ItemInfo.ItemName,
            ParentGrp: ItemInfo.ItemGroupName,
            Unit: ItemInfo.unit,
            SalePrice: ItemInfo.Price,
            ParamDT: NewColorData
        }
        console.log(JSON.stringify(json))
        try {
            setIsLoading(true);
            const response = await fetch(BaseURL + '/api/Values/CreateItem?CompCode=' + global.CompCode + '&FY=' + global.Fy, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json)
            });
            const res = await response.json();
            setIsLoading(false);
            console.log(res)
            ToasterMsg({ msg: res.Message })
            // CalerData()  

            if (res.Sucess == 1) {
                // setClearItem(clearitem+1) 
                setNewColorData([])
                setItemInfo((Prival) => ({
                    ...Prival, ItemName: '', ItemGroupName: 'Select Department', ItemGroupCode: '',
                    unit: '', Price: ''
                }))
            }
        } catch (e) {
            setIsLoading(false);
            Alert.alert('Catch Erro', e)
        }

    }
    const SizeHandler = (index) => {

        let LocArr = SizeData;
        LocArr[index]['Status'] = !LocArr[index]['Status'];
        setSizeData(LocArr);
        setExData(exData + 1)
    }
    // const CalerData=useMemo(()=>{
    // setItemInfo({ ItemName: '', ItemGroupName: 'Select Department', ItemGroupCode: '',
    //     unit:'',Price:''})
    // },[]);
    const CreateColorFun = () => {
        let newSizeData = [];
        SizeData.map((item, index) => {

            if (item.Status == true) {
                let obj = {
                    Size: item.Name
                }
                newSizeData.push(obj)
            }
        });

        if (ItemInfo.ColorName == 'Select Colour') {
            ToasterMsg({ msg: 'Select Colour First' });
            return;
        }
        if (newSizeData.length == 0) {
            ToasterMsg({ msg: 'Select Size First' });
            return;
        }
        let obj = {
            Color: ItemInfo.ColorName,
            SizeData: newSizeData
        };
        NewColorData.push(obj);
        setcolorDataexVal(colorDataexVal + 1)
        clearColorData()
    };
    const clearColorData = () => {
        setItemInfo((Prival) => ({
            ...Prival, ColorName: 'Select Colour'
        }));
        SizeData.forEach(element => {
            element.Status = false
        });
        setExData(exData + 1)
    }
    return <>
        {isLoading == true ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} />
            <Text>Please Wait....</Text>
        </View> : <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* <View style={{
                alignItems:'center'
            }}> */}

            <DropdownComponent Data={ItemInfo.ItemGroupData} headerCap={'Select Department'} Value={ItemInfo.ItemGroupName} setValue={(Val) => {
                callItemMasterAPI(6, Val.Code)
                setItemInfo((PrivAl) => ({
                    ...PrivAl, ItemGroupCode: Val.Code, ItemGroupName: Val.Name
                }))
            }} />
            <View style={{ alignItems: 'center', width: '100%' }}></View>
            <ItemSearchComp data={ItemInfo.itemData} FilterData={ItemInfo.FilterData} Value={ItemInfo.ItemName}
                setIVal={(Val) => {
                    setItemInfo((PrivAl) => ({
                        ...PrivAl, ItemName: Val
                    }));
                }}
                setValue={(Val) => {
                    console.log('checl')
                    console.log(Val);
                    setItemData(Val)

                }} setData={(Val) => {

                }} />
            <View style={{ alignItems: 'center' }}>
                <FlatList data={ItemData} keyboardShouldPersistTaps={'handled'} style={{ width: '100%' }}
                    keyExtractor={(item, index) => `_key${index.toString()}`}
                    listKey={(item, index) => `_key${index.toString()}`}
                    renderItem={({ item, index }) => {
                        return <View key={index} style={{ alignItems: 'center' }}>
                            <RNBounceable onPress={() => {
                                setItemInfo((PrivAl) => ({
                                    ...PrivAl, itemCode: item.Code, ItemName: item.Name,
                                    unit: item.Unit, Price: item.Price
                                }));
                                setItemData([])
                            }} style={{ borderBottomWidth: 1, borderColor: 'gray', width: '90%', height: 40, justifyContent: 'flex-end' }}>
                                <Text style={{ fontWeight: '500', fontSize: 15 }}>{item.Name}</Text>
                            </RNBounceable>
                        </View>


                    }}
                />
            </View>



            <View style={{ alignItems: 'center' }}>
                {/* <ItemCreateInputCom lable={'Unit'} Value={ItemInfo.unit} setValue={(Val)=>{
             setItemInfo((PriVal) => ({ ...PriVal, unit: Val }))
           }} /> */}
                <ItemCreateInputCom lable={'Price'} keyBorder='numeric' Value={ItemInfo.Price} setValue={(Val) => {
                    setItemInfo((PriVal) => ({ ...PriVal, Price: Val }))
                }} />
            </View>
            <DropdownComponent Data={colorData} headerCap={'Select Colour'} Value={ItemInfo.ColorName} setValue={(Val) => {

                setItemInfo((PrivAl) => ({
                    ...PrivAl, ColorName: Val.Name
                }))
            }} />
            {ItemInfo.ColorName !== 'Select Colour' ? <SizeComp data={SizeData} exData={exData} setdata={(Val) => {
                SizeHandler(Val)
            }}
                selectAllSize={() => {
                    SizeData.forEach(element => {
                        element.Status = true;

                    });
                    setExData(exData + 1)
                }}

            /> : null}

            <View style={{ alignItems: 'flex-end', margin: 10 }}>

                <RNBounceable style={{ backgroundColor: '#000', width: '35%', borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        // CheckInfoFun();
                        CreateColorFun()
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Add Colour</Text>
                </RNBounceable>
            </View>
            {NewColorData.length > 0 ? <View style={{ width: '100%', height: 40, backgroundColor: '#000', flexDirection: 'row' }}>
                <View style={{ width: '25%', borderRightWidth: 1, borderColor: '#fff', alignItems: "center", justifyContent: 'center' }}>
                    <Text style={styles.HeaderCapctionSty}>Colour</Text>
                </View>
                <View style={{ width: '75%', borderColor: '#fff', alignItems: "center", justifyContent: 'center' }}>
                    <Text style={styles.HeaderCapctionSty}>Size</Text>
                </View>
            </View> : null}

            <FlatList data={NewColorData} extraData={colorDataexVal}
                keyExtractor={(item, index) => `_key${index.toString()}`}
                listKey={(item, index) => `_key${index.toString()}`}
                renderItem={({ item, index }) => {
                    return <ColorList Itn={item} Ind={index} />

                }}
            />
            {NewColorData.length > 0 ? <View style={{ alignItems: 'center', marginTop: 5 }}>
                <RNBounceable style={{ backgroundColor: '#000', width: '45%', borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        CheckInfoFun()
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Save Item</Text>
                </RNBounceable>
            </View> : null}

        </ScrollView>}
    </>


}

export default CreateItem

const styles = StyleSheet.create({
    ListHeaderViewsty: {
        backgroundColor: "#000",
        flexDirection: 'row',
        // justifyContent:'space-between',
        marginTop: 7
    },
    CapctionVaiesty: {
        width: '25%',
        borderWidth: 0.5,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    HeaderCapctionSty: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffff'
    },
    ListMainViewSty: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    MoreBtnView: {
        height: 40, width: '40%',
        backgroundColor: '#000',
        borderRadius: 10
    },
    SaveBtnViewSty: {

    }
})