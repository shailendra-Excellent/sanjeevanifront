import { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, BackHandler, Alert, Modal, ScrollView } from "react-native";
import GridComponent from "./Components/GridComponent";
import { useNavigation } from '@react-navigation/native'
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
import { useBackHandler } from "@react-native-community/hooks";
import RNBounceable from "@freakycoder/react-native-bounceable";
const UserRightsPage = ({ route, navigation }) => {
  const [UserName, setUserName] = useState('');
  const [alertMsg, setShowAlertMsg] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [UserRights, setUserRights] = useState({});
  const [showTransection, setshowTransection] = useState(true);
  const [ShowReport, setshowReport] = useState(false);
  const [showRackMaster, setShowReackMAster] = useState(false);
  const [ShowExhibition, setShowExhibition] = useState(false)
  // const {exitid}= route.params;
  useEffect(() => {
    DefaultPreference.get('RightsType').then(function (RightsType) {
      global.userRights=JSON.parse(RightsType)
      setUserRights(JSON.parse(RightsType));
    })
    DefaultPreference.get('Uname').then(function (Uname) {
      setUserName(Uname)
    });


  }, [])
  const sendNotification = async (total) => {
    let data = {
      StageID: 1,
      Title: 'Nishu',
      Msg: 'Total ' + total + ' Order Pending For Approval'
    }
    const res = await fetch('http://103.25.128.155:12022/api/values/SendNotification?CompCode=Comp0029&FY=2022', {

      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(data)
    })

    console.log("NOTIFICATION RESULT=>", res)

    let result = await res.json();
    console.log("NOTIFICATION RESULT WITH JSON=", result)
  }
  return <View style={{ flex: 1, backgroundColor: '#B9BABB' }}>
    <View style={{ height: 100, width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#000', borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
      <Text style={{ color: '#fff', fontSize: 20, padding: 10, fontWeight: '600' }}> User: -  {UserName}</Text>
      <TouchableOpacity style={{ margin: 10 }}
        onPress={() => {
          setShowAlertMsg('Are You Sure To Log-Out ?');
          setshowModal(true)
        }}
      >
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9208/9208320.png' }} style={{ height: 35, width: 35, tintColor: '#fff' }} />
      </TouchableOpacity>
    </View>

    {/* </ImageBackground> */}
    <ScrollView style={{}}>
      {/* ------------------------Transcection------------------------------ */}
      <RNBounceable onPress={() => {
        setshowTransection(!showTransection)
      }} >
        <ImageBackground source={require('../assets/shape1.png')} style={{ height: 50, marginTop: 10, width: '90%', alignItems: 'center', paddingLeft: 20, flexDirection: 'row', marginBottom: 5 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17, width: '50%' }}>Transcation</Text>
          {showTransection == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10412/10412452.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} /> :
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4595/4595326.png' }} style={{ height: 15, width: 15, tintColor: '#fff' }} />}


        </ImageBackground>
      </RNBounceable>
      {showTransection == true ? <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
          <RNBounceable
           disabled={UserRights.OrdRight == 1 ? false : true}
            onPress={() => {
              global.FairOrder = 0
              navigation.navigate('DashBord', { Id: 1 });
            }}
            style={UserRights.OrdRight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}>
            <GridComponent blurRadious={UserRights.OrdRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/3211/3211596.png' }} GridType={'Sales Man'} />
          </RNBounceable>
          <RNBounceable disabled={UserRights.OrdCRight == 1 ? false : true}
            onPress={() => {
              global.HoldOrder = 0
              global.FairOrder = 0
              navigation.navigate('ManagerDashBord', { Id: 1 });
            }}
            style={UserRights.OrdCRight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}>
            <GridComponent blurRadious={UserRights.OrdCRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/2954/2954893.png' }} GridType={'Order Approve'} />
          </RNBounceable>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
          <RNBounceable disabled={UserRights.PickerARight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('MDashBordPackerAsign', { Id: 1 });
            }}
            style={UserRights.PickerARight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}>
            <GridComponent blurRadious={UserRights.PickerARight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/1332/1332024.png' }} GridType={'Picker Asign'} />
          </RNBounceable>

          <RNBounceable disabled={UserRights.TransferRight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('GodounUserDB', { Id: 1 });
            }}
            style={UserRights.TransferRight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}>
            <GridComponent blurRadious={UserRights.TransferRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/2821/2821827.png' }} GridType={'Godown'} />
          </RNBounceable>
        </View>
        <View style={{ flexDirection: 'row', height: 120, marginTop: 7, marginLeft: 10 }}>
          <RNBounceable disabled={UserRights.PickingRight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('PickerUserDashBord', { Id: 1 });
            }}
            style={UserRights.PickingRight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}>
            <GridComponent blurRadious={UserRights.PickingRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/9279/9279652.png' }} GridType={'Picker'} />
          </RNBounceable>
        </View>
      </View> : null}
      {/* ------------------------Exhibition-------------------------- */}
      <RNBounceable onPress={() => {
        setShowExhibition(!ShowExhibition)
      }}>
        <ImageBackground source={require('../assets/shape1.png')} style={{ height: 50, width: '90%', alignItems: 'center', paddingLeft: 20, flexDirection: 'row', marginBottom: 5, }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17, width: '50%' }}>Exhibition</Text>
          <Image source={{ uri: ShowExhibition == true ? 'https://cdn-icons-png.flaticon.com/128/10412/10412452.png' : 'https://cdn-icons-png.flaticon.com/128/4595/4595326.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} />
        </ImageBackground>
      </RNBounceable>
      {
        ShowExhibition == true ? <>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
            <RNBounceable
              onPress={() => {
                global.FairOrder = 1
                navigation.navigate('DashBord', { Id: 1 });
              }}
              style={style.DashBordBoxSty}>
              <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/4343/4343889.png' }} GridType={'Exhibition Order'} />
            </RNBounceable>
            <RNBounceable
              onPress={() => {
                global.HoldOrder = 0
                global.FairOrder = 1
                navigation.navigate('ManagerDashBord', { Id: 1 });
              }}
              style={style.DashBordBoxSty}>
              <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/6784/6784655.png' }} GridType={'Order Approve'} />
            </RNBounceable>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
            <RNBounceable disabled={UserRights.PickingRight == 1 || UserRights.PickerARight == 1 ? false : true}

              onPress={() => {
                global.HoldOrder = 0
                global.FairOrder = 0
                navigation.navigate('ExePendingOrder', { Id: 1 });
              }}
              style={[style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }]}
            >
              <GridComponent blurRadious={UserRights.TransferRight == 1 ? 0 : 0} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/17257/17257918.png' }} GridType={'Pending Order'} />
            </RNBounceable>
            <RNBounceable
              onPress={() => {
                global.HoldOrder = 0
                global.FairOrder = 1
                navigation.navigate('ExhibitionPDF', { Id: 1 });
              }}
              style={style.DashBordBoxSty}>
              <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/6784/6784655.png' }} GridType={'Order PDF'} />
            </RNBounceable>
          </View> */}
          <View style={{ flexDirection: 'row', height: 120, marginTop: 7, marginLeft: 10 }}>
            <RNBounceable

              onPress={() => {
                global.HoldOrder = 0
                global.FairOrder = 0
                navigation.navigate('ExePendingOrder', { Id: 1 });
              }}
              style={[style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }]}
            >
              <GridComponent blurRadious={UserRights.TransferRight == 1 ? 0 : 0} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/17257/17257918.png' }} GridType={'Pending Order'} />
            </RNBounceable>
          </View>

        </> : null
      }
      {/*-----------------------------Rack Management------------------------------  */}
      <RNBounceable onPress={() => {
        setShowReackMAster(!showRackMaster)
      }}>
        <ImageBackground source={require('../assets/shape1.png')} style={{ height: 50, width: '90%', alignItems: 'center', paddingLeft: 20, flexDirection: 'row', marginBottom: 5 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17, width: '50%' }}>Rack Management</Text>
          {showRackMaster == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10412/10412452.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} /> :
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4595/4595326.png' }} style={{ height: 15, width: 15, tintColor: '#fff' }} />}


        </ImageBackground>
      </RNBounceable>
      {showRackMaster == true ? <View >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
          <RNBounceable
            onPress={() => {
              navigation.navigate('RackMaster', { Id: 1 });
            }}
            style={style.DashBordBoxSty}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/2704/2704341.png' }} GridType={'Rack Master'} />
          </RNBounceable>
          <RNBounceable
            onPress={() => {
              global.OffLineMode = false
              navigation.navigate('RackEntry', { Id: 1 });
            }}
            style={style.DashBordBoxSty}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/2717/2717124.png' }} GridType={'Rack Entry'} />
          </RNBounceable>
        </View>
        <View style={{ flexDirection: 'row', height: 120, marginTop: 7, marginLeft: 10 }}>
          <RNBounceable
            onPress={() => {
              navigation.navigate('RackTransfer', { Id: 1 });
            }}
            style={style.DashBordBoxSty}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/2879/2879357.png' }} GridType={'Rack Transfer'} />
          </RNBounceable>
        </View>
      </View> : null}


      {/*-----------------------------Reports------------------------------  */}
      <RNBounceable onPress={() => {
        setshowReport(!ShowReport)
      }}>
        <ImageBackground source={require('../assets/shape1.png')} style={{ height: 50, width: '90%', alignItems: 'center', paddingLeft: 20, flexDirection: 'row', marginBottom: 5 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17, width: '50%' }}>Reports</Text>
          {ShowReport == true ? <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10412/10412452.png' }} style={{ height: 20, width: 20, tintColor: '#fff' }} /> :
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4595/4595326.png' }} style={{ height: 15, width: 15, tintColor: '#fff' }} />}


        </ImageBackground>
      </RNBounceable>
      {ShowReport == true ? <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>
          {/* <RNBounceable 
    onPress={()=>{  
        navigation.navigate('StockStatus',{Id:1});
      }}
      style={[style.DashBordBoxSty,{backgroundColor:'#EEF7F5'}]}>
          <GridComponent req={{uri:'https://cdn-icons-png.flaticon.com/128/10103/10103260.png'}}   GridType={'Stock Status'} />
          </RNBounceable> */}
          <RNBounceable
            disabled={UserRights.PickingRight == 1 || UserRights.PickerARight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('PendingOrderReport', { RType: 1, headerName: 'Pending Order Report' });
            }}
            style={UserRights.PickingRight == 1 || UserRights.PickerARight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }]}
          >
            <GridComponent blurRadious={UserRights.TransferRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/10809/10809715.png' }} GridType={'Pending Order Report'} />
          </RNBounceable>
          <RNBounceable
            disabled={UserRights.PickingRight == 1 || UserRights.PickerARight == 1  ||     UserRights.TransferRight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('PendingOrderReport', { RType: 2, headerName: 'Party Pending Order' });
            }}
            style={UserRights.PickingRight == 1 || UserRights.PickerARight == 1  ||     UserRights.TransferRight == 1? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}
          >
            <GridComponent blurRadious={UserRights.PickingRight == 1 || UserRights.PickerARight == 1 || UserRights.TransferRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/6382/6382837.png' }}
              GridType={'Party Pending Order'} />
          </RNBounceable>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 120, marginTop: 7 }}>

          <RNBounceable
            onPress={() => {
              navigation.navigate('StockStatus', { Id: 1 });
            }}
            style={[style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }]}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/10103/10103260.png' }} GridType={'Stock Status'} />
          </RNBounceable>
          <RNBounceable
            disabled={UserRights.TransferRight == 1 ? false : true}
            onPress={() => {
              navigation.navigate('GodownTransferReport', { RType: 2, headerName: '' });
            }}
            style={UserRights.TransferRight == 1 ? [style.DashBordBoxSty, { backgroundColor: '#EEF7F5' }] : [style.DashBordBoxSty]}
          >
            <GridComponent blurRadious={UserRights.TransferRight == 1 ? 0 : 4} req={{ uri: 'https://cdn-icons-png.flaticon.com/128/5581/5581426.png' }}
              GridType={'Godown Transfer Report'} />
          </RNBounceable>

        </View>
        <View style={{ flexDirection: 'row', height: 120, marginTop: 7, marginLeft: 10 }}>
          <RNBounceable
            onPress={() => {
              navigation.navigate('RackReport', { Id: 1 });
            }}
            style={style.DashBordBoxSty}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/3596/3596004.png' }} GridType={'Rack Report'} />
          </RNBounceable>
          <RNBounceable
            onPress={() => {
              navigation.navigate('JantaGaliReport', { Id: 1 });
            }}
            style={style.DashBordBoxSty}>
            <GridComponent req={{ uri: 'https://cdn-icons-png.flaticon.com/128/6054/6054316.png' }} GridType={'Janta Gali Stock'} />
          </RNBounceable>
        </View>
      </View> : null}
    </ScrollView>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 7 }}>
      <Text style={{ fontWeight: '700', fontSize: 14, color: 'black', marginBottom: 5 }}>Version  : 1.3.27</Text>
      <Text style={{ fontWeight: '700', fontSize: 14, color: 'black', marginBottom: 5 }}>FY  : {global.Fy}</Text>
    </View>
    <Modal visible={showModal} transparent={true} animationType='slide'  >
      <View style={style.content}>
        <View style={{ height: '20%', width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ margin: 5, fontSize: 20, fontWeight: '600', color: '#000' }}>Alert</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Text style={{ color: '#000' }}>{alertMsg}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
            <TouchableOpacity style={style.alertMsgBtnSty}
              onPress={() => {
                setshowModal(false);
                setShowAlertMsg('');
              }}>
              <Text style={{ color: '#fff' }}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.alertMsgBtnSty}
              onPress={() => {
                if (alertMsg == 'Do you want to exit this app') {
                  BackHandler.exitApp();
                } else {
                  DefaultPreference.clear('Uname');
                  navigation.replace('Login');
                }
              }} >
              <Text style={{ color: '#fff' }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
}
export default UserRightsPage;