import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,Modal,BackHandler,Alert
} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import {SkypeIndicator} from 'react-native-indicators';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
class ScanItem extends Component {
   
  
  state={
    ShowIndicator : false,
    Id: 0
  }  
  onSuccess = e => {

  const d=  Linking.openURL(e.data);
  this.MoveToScreen(e.data)
 
    // catch(err =>
    //   console.error('An error occured', err)
    // );
  };
  MoveToScreen=(e)=>{
    if(this.props.route.params.Id == 2){
      DefaultPreference.set('BCNdata',e)
      DefaultPreference.set('Id','1')
      this.props.navigation.goBack();
    }else{
      this.props.navigation.replace('ScanItemScreen', {
        BCN: e,OType:this.props.route.params.OType,BStation:this.props.route.params.BStation
      });
    }
   
  }
  backAction = () => {
    if(this.props.route.params.Id==2){
      DefaultPreference.set('Id','2')

      this.props.navigation.goBack();
    }else{  
      this.props.navigation.replace('ScanItemScreen', {
        BCN: 0,Id:this.props.route.params.Id,OType:this.props.route.params.OType,BStation:this.props.route.params.BStation
      });
    }
   
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  render() {
    const Id = this.props.route.params.Id;
    return (
      <View style={{flex:1}}>
         <QRCodeScanner
        onRead={this.onSuccess}
        showMarker={true}
        reactivate={true}
        fadeIn={true}
        reactivateTimeout={600}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.centerText}>
          Scan QR. Code
          </Text> 
        }
      />
      
      </View>
     
    );
  }
}
export default ScanItem
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
