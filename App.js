import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from './Screens/SplashScreen';
import { ServerInfo } from './Screens/Settings/ServerInfo';
import { Login } from './Screens/Settings/Login';
import DashBord from './Screens/DashBord';
import AddCustomer from './Screens/AddCustomer';
import { StatusBar, AppState, Pressable, Text, Alert } from 'react-native';
import ScanItem from './Screens/ScanItem';
import ScanItemScreen from './Screens/ScanItemScreen';
import CartList from './Screens/CartList';
import ManagerDashbord from './Screens/ManagerDashbord';
import ItemDetails from './Screens/ItemDetails';
import PtyWiseItemDetails from './Screens/PtyWiseItemDetails';
import MDashBordPackerAsign from './Screens/MDashBordPackerAsign';
import AssignVchWisePScreen from './Screens/AssignVchWisePScreen';
import GodownUserDashBord from './Screens/GodownUserDashBord';
import PtWiseOrderInGUser from './Screens/PtWiseOrderInGUser';
import GUserScanItemScreen from './Screens/GUserScanItemScreen';
import PickerUserDashBord from './Screens/PickerUserDashBord';
import ItemWiseOrderPicker from './Screens/ItemWiseOrderPickerUse';
import OrdModifyCancel from './Screens/OrdModifyCancelScreen';
import NewPartyScreen from './Screens/NewPartyScreen';
import UserRightsPage from './Screens/UserRightsDashBord';
import ItemStock from './Screens/ItemStock';
import ItemStockReport from './Screens/ItemStockReport';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import DefaultPreference from 'react-native-default-preference';
import PendingOrderReport from './Screens/Reports/PendingOrderReport';
import GodownTransferReport from './Screens/Reports/GodownTransferReport';
import RackMaster from './Screens/RackMaster';
import RackEntry from './Screens/RackEntry';
import RackModify from './Screens/RackModify';
import RackTransfer from './Screens/RackTransfer';
import RackReport from './Screens/RackReport';
import JantaGaliStockReport from './Screens/Reports/JantaGaliItemStockReport';
// import JantaGaliStockReport from './Screens/Reports/JantaGaliItemStockReport';
import { RootSiblingParent } from 'react-native-root-siblings';
import CreateItem from './Screens/CreateItem';
import ExePendingOrderReport from './Screens/ExhibitionOrder/ExePendingOrderReport';
import ExhibitionORderPDFScreen from './Screens/ExhibitionOrder/ExhibitionORderPDFScreen';
const Stack = createNativeStackNavigator();
const App = () => {
  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });
    checkPermission();
    messageListener();
    // return unsubscribe;
  }, []);
  checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    console.log('enabled ******* ', enabled)
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
      await DefaultPreference.set('tokenId', fcmToken)
      // this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {

      // User has rejected permissions
    }
  };

  messageListener = async () => {
    console.log('inside message listener ****** ')

    messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  };
  //  //foreground message end
     const setNotification=()=>{
      messaging().subscribeToTopic('exc')
      .then(() => console.log('Subscribed to topic!'));
    }

    React.useEffect(() => {
      requestUserPermission()    
     setNotification()
      const unsubscribe = messaging().onMessage(async remoteMessage => {
       console.log("RETURN NOTI MSG="+JSON.stringify(remoteMessage),"############")



  // //////////////////////////



  // // ==========================

  PushNotification.createChannel(
    {
      channelId: 'sanjeevani_notification', // (required)
      channelName: 'sanjeevani', // (required)
      channelDescription: 'send notification through sanjeevani', // (optional) default: undefined.
      playSound:true,
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.

    },
    created => console.log(`createChannel returned '${created}'`),
  );


  PushNotification.configure({
   onAction:(notification)=>{
    console.log("Hi notification click event:",notification)
   }
  });

  PushNotification.localNotification( {
    channelId: 'sanjeevani_notification', // (required)
    channelName: 'sanjeevani',
    //... You can use all the options from localNotifications
    message: remoteMessage.notification.body, // (required)
    title: remoteMessage.notification.title,
    bigPictureUrl: remoteMessage.notification.android.smallIcon,

    // largeIconUrl:"http://www.excellentsoftwares.com/Images/logo.png",
    smallIcon: require('./Screens/Images/logo.png'),
    // bigLargeIcon: require('./Screens/Images/logo.png'),
  });

  //============================

      }); 
      // onDisplayNotification()
      return unsubscribe;
    }, []);
  //   //firebase permission
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }

      const value=await DefaultPreference.get('tokenId')
      if(!value){
             const fcmToken=await messaging().getToken()
          console.log("TOKEN updated+++=>",fcmToken)

        await DefaultPreference.set('tokenId', fcmToken)
      }else{
        console.log("Token not in default preference",value)
      }
    }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <StatusBar backgroundColor={'#000'} />
        <Stack.Navigator initialRouteName='SplashScreen'>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{  headerShown: false }} />
          <Stack.Screen name="ServerInfo" component={ServerInfo} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="UserRightsPage" component={UserRightsPage} options={{
            // headerShown: true,
            // presentation:'modal',
            // animationTypeForReplace: 'push',
            // animation:'slide_from_bottom',
            headerShown: false
          }} />
          <Stack.Screen name="GodounUserDB" component={GodownUserDashBord} options={{
            // headerShown: true,
            // presentation:'modal',
            // animationTypeForReplace: 'push',
            // animation:'slide_from_left',
            headerShown: false
          }} />
          <Stack.Screen name="PtWiseOrderInGUser" component={PtWiseOrderInGUser} options={{ headerShown: false }} />
          <Stack.Screen name="GUserScanItemScreen" component={GUserScanItemScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DashBord" component={DashBord} options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
          }} />
          <Stack.Screen name="AddCustomer" component={AddCustomer} options={{ headerShown: false }} />
          <Stack.Screen name="ScanItem" component={ScanItem} options={{ headerShown: false }} />
          <Stack.Screen name="ScanItemScreen" component={ScanItemScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CartList" component={CartList} options={{ headerShown: false }} />
          <Stack.Screen name="ManagerDashBord" component={ManagerDashbord} options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
          }} />
          <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }} />
          <Stack.Screen name="PtyWiseItemDetails" component={PtyWiseItemDetails} options={{ headerShown: false }} />
          <Stack.Screen name="MDashBordPackerAsign" component={MDashBordPackerAsign} options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
          }} />
          <Stack.Screen name="AssignVchWisePScreen" component={AssignVchWisePScreen} options={{ headerShown: false }} />


          <Stack.Screen name="PickerUserDashBord" component={PickerUserDashBord} options={{
            headerShown: false,
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
          }} />
          <Stack.Screen name="ItemDPickerUser" component={ItemWiseOrderPicker} options={{ headerShown: false }} />
          <Stack.Screen name="OrdModifyCancel" component={OrdModifyCancel} options={{ headerShown: false }} />
          <Stack.Screen name="NewParty" component={NewPartyScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StockStatus" component={ItemStock}
            options={{
              presentation: 'modal',
              animationTypeForReplace: 'push',
              animation: 'slide_from_left',
              title: 'Item List', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
            }}
          />
          <Stack.Screen name="ItemStockReport" component={ItemStockReport} options={{ title: 'Stock Status', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
          <Stack.Screen name="PendingOrderReport" component={PendingOrderReport} options={{ headerShown: false }} />
          <Stack.Screen name="GodownTransferReport" component={GodownTransferReport}
            options={{
              presentation: 'modal',
              animationTypeForReplace: 'push',
              animation: 'slide_from_left',
              title: 'Godown Transfer Report', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
            }}
          />
          <Stack.Screen name="RackMaster" component={RackMaster} options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
            title: 'Rack Master', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
          <Stack.Screen name="RackEntry" component={RackEntry} options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
            title: 'Rack Entry', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
          <Stack.Screen name="RackModify" component={RackModify} options={{
            title: 'Rack Modify', headerShown: true,
            headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
          <Stack.Screen name="RackTransfer" component={RackTransfer} options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
            title: 'Rack Transfer', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
          <Stack.Screen name="RackReport" component={RackReport} options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_left',
            title: 'Rack Report', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
          <Stack.Screen name="JantaGaliReport" component={JantaGaliStockReport} options={{
            title: 'Janta Gali Stock', headerShown: true,
            headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
<Stack.Screen name="CrateItem" component={CreateItem} options={{
            title: 'Create Item', headerShown: true,
            headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
           <Stack.Screen name="ExePendingOrder" component={ExePendingOrderReport} options={{
            title: 'Pending Order', headerShown: true,
            headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
            <Stack.Screen name="ExhibitionPDF" component={ExhibitionORderPDFScreen} options={{
            title: 'Pending Order', headerShown: true,
            headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
};
export default App;