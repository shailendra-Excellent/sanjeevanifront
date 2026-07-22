import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Image, Alert } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DefaultPreference from 'react-native-default-preference';
import { style } from "../style";
import { ActivityIndicator } from "react-native";
export const Login = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [UserName, setUserName] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [BaseURL, setBaseURL] = useState('');
  const [Compcode, setCompCode] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [Fy, setFy] = useState('');
  const [Token, setTokan] = useState('')
  useEffect(() => {
    DefaultPreference.get('BaseURL').then(function (url) { setBaseURL(url) });
    DefaultPreference.get('CompCode').then(function (compCode) { setCompCode(compCode) });
    DefaultPreference.get('FY').then(function (Fy) { setFy(Fy) });
    DefaultPreference.get('tokenId').then(function (Token) {

      setTokan(Token)
    })
  }, [])
  const ValidateUser = async () => {
    try {
      if (UserName == '' || UserName == null) {
        setAlertMsg('Please Enter User Name and Password');
        setshowModal(true)
      } else {
        setIsloading(true);
        console.log(BaseURL + '/api/Values/ValidateUser?UName=' + UserName.trim() + '&Pass=' + password.trim() + '&CompCode=' + Compcode + '&FY=' + Fy);
        const res = await fetch(BaseURL + '/api/Values/ValidateUser?UName=' + UserName.trim() + '&Pass=' + password.trim() + '&CompCode=' + Compcode + '&FY=' + Fy);
        const Response = await res.json();
        console.log(Response)
        setIsloading(false);
        if (Response.Validate == true) {
          DefaultPreference.set('Uname', UserName);
          DefaultPreference.set('McCode', Response.Data.IgrpCode.toString())
          DefaultPreference.set('McName', Response.Data.IgrpName);
          DefaultPreference.set('Password', password);
          navigation.replace('UserRightsPage')
          let obj = {
            SuperUser: Response.Data.SuperUser,
            OrdRight: Response.Data.OrdRight,
            OrdCRight: Response.Data.OrdCRight,
            PickerARight: Response.Data.PickerARight,
            TransferRight: Response.Data.TransferRight,
            PickingRight: Response.Data.PickingRight,
          }
          DefaultPreference.set('RightsType', JSON.stringify(obj));
          console.log(Token)
          if (Token) {
            try {
              // console.log("******", BaseURL + '/api/values/UpdateUserTokenID?User=' + UserName + '&TokanID=' + Token + '&UType=1' + '&CompCode=' + Compcode + '&FY=' + Fy)
              const res = await fetch(BaseURL + '/api/values/UpdateUserTokenID?User=' + UserName + '&TokanID=' + Token + '&UType=1' + '&CompCode=' + Compcode + '&FY=' + Fy);
              const result = await res.json() //{"Msg": "Success", "Status": 1}
              // console.log("UpdateUserToken api return Data=> ",result)
              console.log(result)
              if (result.Status == 1) {
                navigation.replace('UserRightsPage')

              } else {
                Alert.alert(result.Msg);
              }
            } catch (e) {
              Alert.alert('catch error', e.message)
            }
          }
        } else {
          setAlertMsg('Invalid user');
          setUserName('');
          setPassword('');
          setshowModal(true);
        }
      }
    } catch (e) {
      setIsloading(false)
      Alert.alert(e.message)
    }

  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity style={{ margin: 5 }} onPress={() => {
          navigation.navigate('ServerInfo')
        }}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2099/2099058.png' }} style={{ height: 35, width: 35 }} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2 }}>
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: '#000', fontSize: 16 }}>Login</Text>
        </View>
        <View style={style.inputView}>
          <TextInput style={[style.InputSty, { width: '70%' }]}
            placeholder='UserName' autoCapitalize="none" onChangeText={(text) => { setUserName(text) }}
            value={UserName} />
        </View>
        <View style={[style.InputSty, { width: '70%', flexDirection: 'row', justifyContent: 'space-between' }]}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => { setPassword(text) }}
            secureTextEntry={hidePass ? true : false} style={{ padding: 5, width: '80%' }} maxLength={10} />
          <FontAwesome5
            color='#000'
            name={hidePass ? 'eye-slash' : 'eye'}
            onPress={() => setHidePass(!hidePass)} style={{ padding: 5 }} size={20} />
        </View>
        <TouchableOpacity
          onPress={() => { ValidateUser() }}
          style={[style.InputSty, { backgroundColor: '#000', width: '70%', marginTop: 10, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>
        <Modal visible={showModal} transparent={true} onRequestClose={() => { setshowModal(false) }} >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ height: '20%', width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ margin: 5, fontSize: 20, fontWeight: '600', color: '#000' }}>Alert</Text>
              </View>
              <View style={{ margin: 5 }}>
                <Text style={{ color: '#000' }}>{alertMsg}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', }}>
                <TouchableOpacity style={{ height: 30, width: 50, backgroundColor: '#000', margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 7 }} onPress={() => { setUserName(''), setPassword(''), setAlertMsg(''), setshowModal(false) }} >
                  <Text style={{ color: '#fff' }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={isLoading} >
          <View style={style.content}  >
            <ActivityIndicator size={'large'} />
            <Text>Please Wait...</Text>
            {/* <UIActivityIndicator size={30} color='#000' /> */}
          </View>
        </Modal>
      </View>
    </View>
  )
}