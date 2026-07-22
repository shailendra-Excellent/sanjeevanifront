import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import DefaultPreference from 'react-native-default-preference';
import { style } from "../style";
import { UIActivityIndicator } from 'react-native-indicators';

export const ServerInfo = ({ navigation }) => {
  const [URL, setURL] = useState('');
  const [Port, setPort] = useState('');
  const [compCode, setCompCode] = useState('');
  const [Fy, setFy] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    DefaultPreference.get('URL').then(function (url) { setURL(url) });
    DefaultPreference.get('Port').then(function (Port) { setPort(Port) });
    DefaultPreference.get('CompCode').then(function (compCode) { setCompCode(compCode) });
    DefaultPreference.get('FY').then(function (Fy) { setFy(Fy) });
  }, [])
  // -------------------------Check Server settings function call
  const ValidateURL = async () => {
    try {
      if ((URL == '' || URL == null) || (Port == '' || Port == null)) {
        setAlertMsg('Please Enter URL and Port First...')
        setshowModal(true)
      } else if ((compCode == '' || compCode == null) || (Fy == '' || Fy == null)) {
        setAlertMsg('Please Enter ComCode Code and Fy...')
        setshowModal(true)
      } else {
        try {
          setIsloading(true)
          // console.log(URL+':'+ Port+ '/api/Values/ValidateURL')
          const resp = await fetch(URL + ':' + Port + '/api/Values/ValidateURL');
          const Response = await resp.json();
          setIsloading(false)
          if (Response == true) {
            DefaultPreference.set('URL', URL);
            DefaultPreference.set('Port', Port);
            DefaultPreference.set('BaseURL', URL + ':' + Port);
            DefaultPreference.set('CompCode', compCode);
            DefaultPreference.set('FY', Fy);
            navigation.replace('Login');
          }
        } catch (e) {
          setIsloading(false)
          alert('Catch Error:' + e)
        }

      }

    } catch (ex) {
      alert('catch error Msg', ex);
    }
  }
  return (
    <View style={[style.content, { marginTop: 30, }]}>
      <View style={{ width: '95%', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#000', fontWeight: '600' }}>Write Full server path for LOGIN Starts with http://192.168.1.1:80{' '}
          {'\n'}or{'\n'}http://www.abc.com</Text>
      </View>
      <View style={style.inputView}>
        <TextInput style={[style.InputSty, { width: '60%', textAlign: 'center' }]} placeholder='http://210.43.32.1' autoCapitalize="none" value={URL} onChangeText={(text) => { setURL(text) }} autoFocus={true} />
        <TextInput style={[style.InputSty, { width: '20%', textAlign: 'center' }]} placeholder='Port' autoCapitalize="none" value={Port} onChangeText={(text) => { setPort(text) }} keyboardType={"numeric"} />
      </View>
      <View style={style.inputView}>
        <TextInput style={[style.InputSty, { width: '60%', textAlign: 'center' }]} placeholder='CompCode' autoCapitalize="none" value={compCode} onChangeText={(text) => { setCompCode(text) }} />
        <TextInput keyboardType={'numeric'} style={[style.InputSty, { width: '20%', textAlign: 'center' }]} placeholder='FY' autoCapitalize="none" value={Fy} onChangeText={(text) => { setFy(text) }} />
      </View>
      <TouchableOpacity onPress={() => { ValidateURL() }} style={[style.InputSty, { backgroundColor: '#000', width: '80%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={style.buttonText}>Save</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ height: '16%', width: '80%', borderWidth: 1, backgroundColor: '#fff', borderColor: '#000', elevation: 5, borderRadius: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ margin: 5, fontSize: 20, fontWeight: '600', color: '#000' }}>Alert</Text>
            </View>
            <View style={{ margin: 5 }}>
              <Text style={{ color: '#000' }}>{alertMsg}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', }}>
              <TouchableOpacity style={{ height: 30, width: 50, backgroundColor: '#000', margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 7 }} onPress={() => { setAlertMsg(''), setshowModal(false) }} >
                <Text style={{ color: '#fff' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={isLoading} transparent={true} >
        <View style={style.content} transparent={true} >
          <View style={{ height: 50, width: '70%', elevation: 5, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <UIActivityIndicator size={30} color='#000' />
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start' }}>
              <Text>Please Wait...</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}