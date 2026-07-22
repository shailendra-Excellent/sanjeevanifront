import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import DefaultPreference from 'react-native-default-preference';
import DropdownComponent from '../Components/ItemCreateComp/DropDownComp';
import RNBounceable from '@freakycoder/react-native-bounceable';
import { CreatePDF } from './ExhibitionOrderPDF';
import Share from 'react-native-share';
import MultiSelectComponent from '../Components/ItemCreateComp/MultiSelectItem';
import ToasterMsg from '../Components/ToasterMsg';
import BtnComp from './BtnComp';
let arrLength = 250;
let arrLength2 = 500;
let arrLength3 = 750;

let arr1 = []
let arr2 = []
let arr3 = []
let arr4 = []
const HeaderComp = () => {
    return (
        <View>
            <View style={styles.headerCapSty}>
                <Text style={styles.headerTextSty}>Size</Text>
            </View>
            <View style={styles.headerCapSty}>
                <Text style={styles.headerTextSty}>Fair Order</Text>
            </View>
            <View style={styles.headerCapSty}>
                <Text style={styles.headerTextSty}>Available Qty</Text>
            </View>
            <View style={styles.headerCapSty}>
                <Text style={styles.headerTextSty}>Difference</Text>
            </View>
        </View>
    )
}

const ItemRender = memo(({ item, ind, withRemark }) => {
    // console.log('kkkkk')
    // console.log('kkkkk', ind);
    return <View
        style={{}}
    >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.itemNamesty} >{item.ItemName + '( ' + item.Color + ' )'}</Text>
            {withRemark == true ? <Text style={{ fontSize: 13, fontWeight: '700', color: 'green' }}>Qty Without Remark {item.TotalQty - item.OrdQty} </Text> :
                <Text style={{ fontSize: 13, fontWeight: '700', color: 'green' }}>Qty with Remark {item.TotalQty} </Text>}

        </View>

        <View style={{ flexDirection: 'row', }}>
            <HeaderComp />
            <FlatList horizontal={true} data={item.Data}
                renderItem={({ item, index }) => {
                    // console.log('key',index)
                    return <SizeRender item={item} index={index} type={1} />
                }}
            />


        </View>
        <View style={{ flexDirection: 'row' }}>

            <FlatList horizontal={false} data={item.OrdData}
                //   keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {

                    return <OrderRender item={item} />
                }}
            />
        </View>

    </View>
})
const OrderRender = memo(({ item, index }) => {

    return (
        <View style={{}} >
            <Text style={[styles.itemNamesty, { color: '#000', fontSize: 17 }]}>Order Number : {item.OrderNo}</Text>
            <Text style={[styles.itemNamesty, { color: '#3a9108', fontSize: 15 }]}>Remark : {item.Remarks}</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* <HeaderComp /> */}
                <View>
                    <View style={styles.headerCapSty}>
                        <Text style={styles.headerTextSty}>Size</Text>
                    </View>
                    <View style={styles.headerCapSty}>
                        <Text style={styles.headerTextSty}>Qty</Text>
                    </View>
                </View>
                <FlatList horizontal={true} data={item.Data}
                    renderItem={({ item, index }) => {

                        return (

                            <OrdSizeRender item={item} index={index} type={2} />
                        )
                    }}
                />
            </View>

        </View>
    )
})

const OrdSizeRender = memo(({ item, index, type }) => {

    // console.log('aaa' , index);
    return <View>
        <View style={[styles.ValueRenderViewsty, { backgroundColor: '#000', borderColor: '#fff' }]}>
            <Text style={[styles.ValueTextSty, { color: '#fff', fontSize: 14, fontWeight: '700' }]}>{item.Size}</Text>
        </View>
        <View style={styles.ValueRenderViewsty}>
            <Text style={styles.ValueTextSty}>{item.Qty}</Text>
        </View>
    </View>
});

const SizeRender = memo(({ item, index, type }) => {
    // console.log('aaa' , index);
    return <View>
        <View style={[styles.ValueRenderViewsty, { backgroundColor: '#000', borderColor: '#fff' }]}>
            <Text style={[styles.ValueTextSty, { color: '#fff', fontSize: 14, fontWeight: '700' }]}>{item.Size}</Text>
        </View>
        <View style={styles.ValueRenderViewsty}>
            <Text style={styles.ValueTextSty}>{item.Qty}</Text>
        </View>
        {type !== 2 ? <View style={styles.ValueRenderViewsty}>
            <Text style={styles.ValueTextSty}>{item.Stock}</Text>
        </View> : null}
        {type !== 2 ? <View style={styles.ValueRenderViewsty}>
            <Text style={[styles.ValueTextSty, { fontSize: 14, fontWeight: '700' }]}>{item.Diff}</Text>
        </View> : null}

    </View>
});

const ExePendingOrderReport = () => {
    const [isLoading, setisLoading] = useState(false);
    const [childLoading, setChildLoading] = useState(false);
    const [MultiItemCode, setMultiItemCode] = useState('');
    const [iCodeArr, setIcodeArr] = useState([])
    const [TotalWithRemark, setTotalWithRemark] = useState(false);
    const [info, setInfo] = useState({

        DepartmentData: [], DepartmentName: 'Select Department', DepartmentCode: '', ItemData: [], ItemCode: '', ItemName: 'Select Design'
    });
    const [refreshing, setRefreshing] = React.useState(false);
    const [Approved, setApproved] = useState(true);
    const [UnApproved, setUnApproved] = useState(false)
    const [Both, setBoth] = useState(false)
    const [IType,setIteype]= useState(2)
    const [Data, setData] = useState([]);
    const [BaseURL, setBaseURL] = useState({ BaseURL: '', CompCode: '', Fy: '' });
    const [exData, setExData] = useState(0)
    useEffect(() => {
        DefaultPreference.get('BaseURL').then(function (BaseURL) {
            DefaultPreference.get('CompCode').then(function (compCode) {
                DefaultPreference.get('FY').then(function (Fy) {
                    setBaseURL((Prival) => ({
                        ...Prival, BaseURL: BaseURL, CompCode: compCode, Fy: Fy
                    }))
                    callItemMasterAPI(BaseURL, compCode, Fy, 5, 0)
                })
            })
        })
    }, []);
    const FileViewFun = async (Data) => {
        // console.log('PDFffffffffffffff',Data)
        let newData =
            setisLoading(true)
        if (Data.length > 0) {
            setisLoading(true)
            let resonse = await CreatePDF(Data, TotalWithRemark == true ? 1 : 0);
            setisLoading(false)

            Share.open({
                title: "Order PDF",
                url: `file://${resonse}`,
                subject: "Report",
            })
                .then((res) => {
                    setisLoading(false);
                })
                .catch((err) => {
                    setisLoading(false);
                    Alert.alert(err.message);
                });
        }



    }
    const callItemMasterAPI = async (BaseURL, compCode, Fy, MasterType, DepartmentCode) => {
        setisLoading(true)
        try {

            console.log(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode);
            const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode)
            // const res = await fetch(BaseURL + '/api/Values/GetBusyMaster?CompCode=' + compCode + '&FY=' + Fy + '&MasterType=' + MasterType + '&ParentGrp=' + DepartmentCode)
            const response = await res.json();
            setisLoading(false)
            if (response.Status == 1) {
                response.Data.sort((firstItem, secondItem) => firstItem.Name - secondItem.Name);
                if (MasterType == 5) {
                    setInfo((PriVal) => ({
                        ...PriVal, DepartmentData: response.Data
                    }));
                } else {
                    setInfo((PriVal) => ({
                        ...PriVal, ItemData: response.Data
                    }));
                }
            } else {
                setisLoading(false)
                alert(response.Message)
            }
        } catch (e) {
            setisLoading(false)
            alert(e)
        }
    };

    const FairOrderReportAPI = async (IGRPCode, Rtype,Itype) => {
        setisLoading(true);
        setChildLoading(true);
        setData([]);
        try {
            console.log(BaseURL.BaseURL + '/api/Values/GetFairMergeOrderReport?CompCode=' + BaseURL.CompCode + '&FY=' + BaseURL.Fy + '&IgrpCode=' + IGRPCode + '&RType=' + Rtype + '&ItemStr=' + MultiItemCode + '&IType='+Itype);
            const res = await fetch(BaseURL.BaseURL + '/api/Values/GetFairMergeOrderReport?CompCode=' + BaseURL.CompCode + '&FY=' + BaseURL.Fy + '&IgrpCode=' + IGRPCode + '&RType=' + Rtype + '&ItemStr=' + MultiItemCode + '&IType='+Itype)
            const response = await res.json();
            if (response.Status == 1) {
                setMultiItemCode('')
                response.Data.forEach(element => {
                    let Qty = 0;
                    let Stock = 0;
                    let Diff = 0;
                    element.Data.forEach(item => {
                        Qty = Qty + item.Qty;
                        Stock = Stock + item.Stock;
                        Diff = Diff + item.Diff;
                    });
                    let obj = {
                        Size: 'Total',
                        Qty: Qty,
                        Stock: Stock,
                        Diff: Diff
                    }
                    element.Data.push(obj);

                    element.OrdData.forEach(orderDT => {
                        let Qty = 0;
                        let Stock = 0;
                        let Diff = 0;
                        orderDT.Data.forEach(item => {
                            item.Diff = item.Stock - item.Qty
                            Qty = Qty + item.Qty;
                            Stock = Stock + item.Stock;
                            Diff = Diff + item.Diff;
                        });
                        let obj2 = {
                            Size: 'Total',
                            Qty: Qty,
                            Stock: Stock,
                            Diff: Diff
                        }

                        orderDT.Data.push(obj2)
                    });
                });
                if (response.Data.length > 0) {
                    setChildLoading(false)
                }
                arr1 = response.Data.slice(0, arrLength);
                arr2 = response.Data.slice(arrLength, arrLength2);
                arr3 = response.Data.slice(arrLength2, arrLength3);
                arr4 = response.Data.slice(arrLength3, arrLength3 + response.Data.length);

                setData(response.Data);
                setisLoading(false);
            } else {
                setisLoading(false);
                Alert.alert(response.Message);
            }
        } catch (e) {
            setisLoading(false);
            setChildLoading(false)
            Alert.alert(e);
        }
    };
    //  const findTotalWihOut=()=>{
    //     let newArr=Data
    //   newArr.forEach(element => {

    //    element.TotalQty=element.TotalQty-element.OrdQty
    //   }); 
    //   console.log(JSON.stringify(newArr))
    //   setData(newArr);
    //  setExData(exData+1);
    //  onRefresh()
    //  }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <>
            {isLoading == true ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} />
                <Text style={{ height: 17 }}>Please Wait...</Text>
            </View> : <ScrollView style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <RNBounceable style={styles.btnsty}
                            onPress={() => {
                                setApproved(true);
                                setUnApproved(false);
                                setBoth(false);
                                setIteype(2)
                                // FairOrderReportAPI(info.DepartmentCode, 3, 2)
                            }}
                        >
                            {Approved == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5291/5291043.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} />
                                : null}
                            <BtnComp Value={'Approved'} />
                        </RNBounceable>
                        <RNBounceable style={styles.btnsty}
                            onPress={() => {
                                setApproved(false);
                                setUnApproved(true);
                                setBoth(false);
                                setIteype(1)
                                // FairOrderReportAPI(info.DepartmentCode, 3, 1)
                            }}
                        >
                            {UnApproved == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5291/5291043.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} />
                                : null}

                            <BtnComp Value={'UnApproved'} />
                        </RNBounceable>
                        <RNBounceable style={styles.btnsty}
                            onPress={() => {
                                setApproved(false);
                                setUnApproved(false);
                                setBoth(true);
                                setIteype(3)
                                // FairOrderReportAPI(info.DepartmentCode, 3, 3)
                            }}
                        >
                            {Both == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5291/5291043.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} />
                                : null}

                            <BtnComp Value={'Both'} />
                        </RNBounceable>
                    </View>
                    <RNBounceable
                        onPress={() => {
                            // setTotalWithRemark(!TotalWithRemark)
                            if (TotalWithRemark == true) {
                                setTotalWithRemark(false)
                            } else {
                                //    findTotalWihOut()
                                setTotalWithRemark(true)
                            }
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RNBounceable style={{ height: 30, width: 30, borderWidth: 1, margin: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            {TotalWithRemark == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5291/5291043.png' }} style={{ height: 20, width: 20 }} /> : null}
                        </RNBounceable>
                        <Text style={{ fontWeight: '700', color: '#000' }}>Show Total Without Remark </Text>
                    </RNBounceable>
                    <DropdownComponent Data={info.DepartmentData} headerCap={'Select Department'} Value={info.DepartmentName} setValue={(Val) => {
                        callItemMasterAPI(BaseURL.BaseURL, BaseURL.CompCode, BaseURL.Fy, 6, Val.Code, 2);
                        // FairOrderReportAPI(Val.Code, 0)
                        setInfo((PrivAl) => ({
                            ...PrivAl, DepartmentCode: Val.Code, DepartmentName: Val.Name
                        }))
                    }} />
                    <MultiSelectComponent Data={info.ItemData} Value={info.ItemName} setValue={(Val) => {
                        setMultiItemCode(Val.toString())
                    }} />
                    <View style={{ alignItems: 'flex-end' }}>
                        <RNBounceable
                            onPress={() => {
                                if (MultiItemCode == '') {
                                    ToasterMsg({ msg: 'Select Design' })
                                } else {
                                    FairOrderReportAPI(info.DepartmentCode, 3,IType)
                                }

                            }}
                            style={{ backgroundColor: '#000', height: 30, width: 80, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Load</Text>
                        </RNBounceable>

                    </View>
                </View>

                {/* <DropdownComponent Data={info.ItemData} headerCap={'Select Item'} Value={info.ItemName} setValue={(Val) => {
                    FairOrderReportAPI(Val.Code, 2)
                    setInfo((PrivAl) => ({
                        ...PrivAl, ItemCode: Val.Code, ItemName: Val.Name
                    }))
                }} /> */}

                {childLoading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator siz e={'large'} />
                        <Text style={{ height: 17 }}>Please Wait...</Text>
                    </View>
                    :
                    <ScrollView horizontal={true} >
                        <View>
                            <FlatList data={Data}
                                extraData={exData}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <ItemRender item={item} ind={index} withRemark={TotalWithRemark} />
                                    )
                                }}
                            />
                        </View>
                    </ScrollView>}
                <View style={{ alignItxems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <RNBounceable
                            onPress={async () => {
                                global.Dep = info.DepartmentName + '(PDF1)'
                                await FileViewFun(arr1)
                            }}
                            style={{
                                width: '32%', backgroundColor: '#000', height: 40, alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: '#fff'
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1384/1384023.png'}} style={{height:20,width:20,tintColor:'#fff'}} /> */}
                                <Text style={{ fontSize: 15, color: '#fff', }}>Share PDF 1</Text>
                            </View>
                        </RNBounceable>
                        {arr2.length > 0 ? <RNBounceable
                            onPress={async () => {
                                global.Dep = info.DepartmentName + '(PDF2)'

                                await FileViewFun(arr2)
                            }}
                            style={{
                                width: '32%', backgroundColor: '#000', height: 40, alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: '#fff'
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1384/1384023.png'}} style={{height:20,width:20,tintColor:'#fff'}} /> */}
                                <Text style={{ fontSize: 15, color: '#fff', }}>Share PDF 2</Text>
                            </View>
                        </RNBounceable> : null}
                        {arr3.length > 0 ? <RNBounceable
                            onPress={async () => {
                                global.Dep = info.DepartmentName + '(PDF3)'
                                await FileViewFun(arr3)
                            }}
                            style={{
                                width: '32%', backgroundColor: '#000', height: 40, alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: '#fff'
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1384/1384023.png'}} style={{height:20,width:20,tintColor:'#fff'}} /> */}
                                <Text style={{ fontSize: 15, color: '#fff', }}>Share PDF 3</Text>
                            </View>
                        </RNBounceable> : null}
                    </View>
                    {arr4.length > 0 ? <RNBounceable
                        onPress={async () => {
                            global.Dep = info.DepartmentName + '(PDF4)'

                            await FileViewFun(arr4)
                        }}
                        style={{
                            width: '32%', backgroundColor: '#000', height: 40, alignItems: 'center', justifyContent: 'center',
                            borderWidth: 1, borderColor: '#fff'
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1384/1384023.png'}} style={{height:20,width:20,tintColor:'#fff'}} /> */}
                            <Text style={{ fontSize: 15, color: '#fff', }}>Share PDF 4</Text>
                        </View>
                    </RNBounceable> : null}
                </View>
            </ScrollView>}

        </>

    )
}

export default ExePendingOrderReport

const styles = StyleSheet.create({
    itemNamesty: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
        color: '#a11b03'
    },
    headerCapSty: {
        width: 110,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#fff',
        alignItems: 'flex-start',
        padding: 5,
        backgroundColor: '#000',
        height: 35

    },
    headerTextSty: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },
    ValueRenderViewsty: {
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        padding: 5,
        width: 60,
        height: 35,
        // backgroundColor:'#000',

    },
    ValueTextSty: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000'
    },
    btnsty: {
        height: 35,
        width: 110,
        backgroundColor: 'red',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
})