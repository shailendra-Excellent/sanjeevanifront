import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text,Image, TouchableOpacity, ScrollView, TextInput} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import EffectiveTextInput from "./Components/EffectCustTInput";
import DefaultPreference from 'react-native-default-preference';
import { Dropdown } from 'react-native-element-dropdown';
import {ActivityIndicator, Modal} from 'react-native-paper'
import { style } from "./style";

const NewPartyScreen=({navigation})=>{
    const [PartyInfo,setPartyInfo]=useState({
        Name:'',Address1:'',Address2:'',ContactPerson:'',MoblieNo:'', Email:'',GSTN:'',State:'',
        BaseUrl:'',Compcode:'',Fy:'',Uname:'',StateData:[],StateName:'',stateCode:'',SucessMsg:false,
        isLoading:false
    });
    const [BaseURL,setBaseurl]= useState('');
    const [fy,setFy]= useState('');
    const [compcode,setCompcode]= useState('')
        useEffect(()=>{  
            DefaultPreference.get('BaseURL').then(function(BaseURL) {
            DefaultPreference.get('CompCode').then(function(compCode) {
            DefaultPreference.get('FY').then(function(Fy) {
            DefaultPreference.get('Uname').then(function(uname){
                setPartyInfo({
                    ...PartyInfo,BaseUrl:BaseURL,
                    Compcode:compCode,Fy:Fy
                });
                setBaseurl(BaseURL);
                setCompcode(compCode);
                setFy(Fy)
                CallBusyMasterAPI(BaseURL,compCode,Fy,uname)
            });
        })
    })
})
const CallBusyMasterAPI=async(BaseURL,compCode,Fy)=>{
    // console.log(BaseURL+'/api/Values/GetBusyMaster?CompCode='+compCode+'&FY='+Fy+'&MasterType=56&ParentGrp=0');
    const res = await fetch(BaseURL+'/api/Values/GetBusyMaster?CompCode='+compCode+'&FY='+Fy+'&MasterType=56&ParentGrp=0')
    const response = await res.json();
    if(response.Status== 1){
       
        setPartyInfo({...PartyInfo,StateData:response.Data})
    //   (response.Data)
    }else{
      alert(response.Message)
    }
}

    },[]);
    const PostInBusy=async()=>{
        if(PartyInfo.Name==''){
            alert('Please Enter Name First')
        } else if(PartyInfo.StateName == ''){
            alert('Please Select State First')
        }else{
            setPartyInfo({...PartyInfo,Name:'',Address1:'',Address2:'',
        ContactPerson:'',MoblieNo:'',Email:'',GSTN:'',StateName:''})
            const JSONdata={
                Name: PartyInfo.Name,
                Contact:PartyInfo.ContactPerson,
                Address1:PartyInfo.Address1,
                Address2:PartyInfo.Address2,
                MobileNo:PartyInfo.MoblieNo,
                EMail:PartyInfo.Email,
                GSTN:PartyInfo.GSTN,
                State: PartyInfo.StateName
            }
  
        setPartyInfo({...PartyInfo,isLoading:true})
        const response = await fetch(BaseURL+'/api/Values/SaveAccountMasterInBusy?CompCode='+compcode+'&FY='+fy,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(JSONdata)
        }); 
        const json = await response.json(); 
        console.log('====================================');
        console.log(json);
        console.log('====================================');
        setPartyInfo({...PartyInfo,isLoading:false})
       if(json.Sucess== 1){
        setPartyInfo({...PartyInfo,Name:'',Address1:'',Address2:'',
        ContactPerson:'',MoblieNo:'',Email:'',GSTN:'',StateName:''})
        setPartyInfo({...PartyInfo, SucessMsg:true});
        setTimeout(() => {
          setPartyInfo({...PartyInfo, SucessMsg:false})  
           navigation.goBack()
        }, 2000);
       }else{
        alert(json.Message)
       }      
 

}
      
       
   

    }
    return(
        <View style={{flex:1}}>
            <View style={{height:'10%',backgroundColor:'#000',justifyContent:'center',}}>
                <View style={{marginTop:10}}>
                    <TouchableOpacity 
                    onPress={()=>{
                        navigation.goBack();
                    }}
                    >
                    <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/271/271220.png'}} style={{height:20,width:20,tintColor:'#fff'}} />
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',fontSize:20,fontWeight:'600'}}>Create New Party</Text>
                </View>
            </View>
            <ScrollView>
         <EffectiveTextInput maxLength={40} type={'Name'} Value={PartyInfo.Name} setValue={(text)=>{setPartyInfo({...PartyInfo,Name:text})}}  placeHolder={'Name'} />     
         <EffectiveTextInput maxLength={40} type={'Address1'} Value={PartyInfo.Address1} setValue={(text)=>{setPartyInfo({...PartyInfo,Address1:text})}}  placeHolder={'Address1'}/>     
         <EffectiveTextInput maxLength={40} type={'Address2'} Value={PartyInfo.Address2} setValue={(text)=>{setPartyInfo({...PartyInfo,Address2:text})}}  placeHolder={'Address2'}/>     
         <EffectiveTextInput maxLength={40} placeHolder={'Contact Person'} type={'Contact Person'} Value={PartyInfo.ContactPerson} setValue={(text)=>{setPartyInfo({...PartyInfo,ContactPerson:text})}} />     
         <EffectiveTextInput maxLength={10} placeHolder={'Mobile No.'} keyboardType={'numeric'}  type={'Mobile No.'} Value={PartyInfo.MoblieNo} setValue={(text)=>{setPartyInfo({...PartyInfo,MoblieNo:text})}} />     
         <EffectiveTextInput maxLength={30} keyboardType="email-address" placeHolder={'Email'}  type={'Email'}  Value={PartyInfo.Email} setValue={(text)=>{setPartyInfo({...PartyInfo,Email:text})}} />     
         <EffectiveTextInput maxLength={15} placeHolder={'GSTN'} type={'GSTN'} Value={PartyInfo.GSTN} setValue={(text)=>{setPartyInfo({...PartyInfo,GSTN:text})}} />     
       
         <Dropdown
      style={style.dropdown}
      data={PartyInfo.StateData}
      labelField="Name"
      valueField="Code"
      search={false}
      maxHeight={300}
      placeholder={'Select State'}
      onChange={item => {
      setPartyInfo({...PartyInfo,StateName:item.Name,stateCode:item.Code})
      }}
     
    />
            </ScrollView>
            <TouchableOpacity 
            onPress={()=>{
              PostInBusy()  
            }}
            style={{justifyContent:'flex-end',height:'8%',backgroundColor:'#000',
         alignItems:'center'
        }}>
               <Text style={{color:'#fff',padding:10,fontSize:20}}>Save</Text>
            </TouchableOpacity>
         <Modal visible={PartyInfo.SucessMsg} >
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <View style={{backgroundColor:'#fff',height:50,width:'50%',alignItems:'center',justifyContent:'center',borderRadius:10}}>
                    <Text style={{fontSize:16}}>Save SucessFully</Text>
                </View>

            </View>
         </Modal>
         <Modal visible={PartyInfo.isLoading} >
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <ActivityIndicator color="red"  size={35} />
            </View>
         </Modal>
        </View>
    )
}
export default NewPartyScreen