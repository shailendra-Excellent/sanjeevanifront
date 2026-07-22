import React, { useEffect, useState } from "react";
import {View,Text,FlatList, TouchableOpacity, Keyboard,Modal,BackHandler,Image, TextInput, ScrollView, KeyboardAvoidingView} from 'react-native';
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
import CustomSearch from "./Components/CustomSearch";
import {UIActivityIndicator} from 'react-native-indicators';
import { ActivityIndicator } from "react-native";
let initialLoadNumber = 20 
// import { Sae } from 'react-native-textinput-effects';
const AddCustomer=({navigation})=>{
    const [CustomerName, setCustomerName]= useState('');
    const [showModal,setshowModal]= useState(false);
    const [alertMsg,setAlertMsg] =useState('');
    const [PartyName,setPartyName]= useState('');
    const [isLoading,setIsloading]= useState(true);
    const [userName,setuserName]= useState('');
    const [BaseURL,setBaseURL]= useState('');
    const [CompCode,setCompCode]= useState('');
    const [Fy,setFy]= useState('');
    const [PCode,setPcode]= useState(0);
    const [CustCode,setCustCode]= useState(0);
    const [CustId,setCustId]= useState(0);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [data,setData]= useState([]);
    const [ShipingPartDT,setShipingDT]= useState([]);
    const [showCustList,setShowCustList]= useState(0);
    const [existingParty,setexistingParty]= useState('');
    const [Transporter,setTransporter]= useState('');
    const [remark,setRemark]= useState('');
    const [BStation,setBStation]= useState('')
     useEffect(()=>{
        
        DefaultPreference.get('BaseURL').then(function(BaseURL) {
        DefaultPreference.get('CompCode').then(function(compCode) {
        DefaultPreference.get('FY').then(function(Fy) {
        DefaultPreference.get('Uname').then(function(uname){
      
         setBaseURL(BaseURL);
         setCompCode(compCode);
         setFy(Fy)
              setuserName(uname)
            })
         callAPI(BaseURL,compCode,Fy)   
    });
});
});
  },[])
    const callAPI=async(BaseURL,compCode,Fy)=>{
        setIsloading(true);
        try{
        //  console.log(BaseURL+'/api/Values/GetAccountList?CompCode='+compCode+'&FY='+Fy)
        const resp= await fetch(BaseURL+'/api/Values/GetAccountList?CompCode='+compCode+'&FY='+Fy);
        const Response= await resp.json();
        setIsloading(false)
        if(Response.Status== 1){
            setMasterDataSource(Response.Data);
            // setData(Response.Data);
        }
       
        }catch(e){
          alert('Catch Error:'+ e)
        }
    }

    // ------------------------Validate Customer Visiting
    const ValidateCustomer=async()=>{
      setIsloading(true)
        try{
          if(CustomerName =='' || PartyName== ''){
            alert('Please select Party First....')
          }else {
            const JSONdata = {
              UserName:userName,
              SAccCode:CustCode,
              SAccName:CustomerName,
              AccCode:PCode,
              AccName:PartyName,
              Transport:Transporter,
              Remarks:remark,
              BStation:BStation,
              FairOrder:global.FairOrder
            }
            console.log(JSONdata)
            const response = await fetch(BaseURL+'/api/Values/PartyIn?CompCode='+CompCode+'&FY='+Fy,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify(JSONdata)
              });
              const json = await response.json();
              setIsloading(false);
              if(json.Status == 1){
                let obj= {
                  Transport: Transporter,
                  Remarks: remark,
                };
                DefaultPreference.set('Partyname',PartyName);
                DefaultPreference.set('ShippingParty',CustomerName);
                DefaultPreference.set('shippingPCode',CustCode.toString());
                DefaultPreference.set('VchCode','0'); 
                DefaultPreference.set('PCode',PCode.toString());
                DefaultPreference.set('TransRemark',JSON.stringify(obj));
                // clearData()    
                navigation.navigate('ScanItemScreen',{Id:1,OType:1,BStation});
                          }else{
                            // clearData();
                            setAlertMsg(json.Msg);
                            setshowModal(true);
                          }      
          }
        }catch(e){
            setIsloading(false)
            alert('Catch Error: '+ e)
        }
    }
    const clearData=()=>{
        setCustomerName('');
        setPartyName('');
        setPcode(0);
        setCustCode(0);
        setTransporter(''),
        setRemark('');
        setBStation('')
    } 
 

    return(
      <KeyboardAvoidingView style={{flex:1}}>
        <View style={{backgroundColor:'#000',justifyContent:'space-between',flexDirection:'row',}}>
        <Text style={{color:'#fff',fontSize:17,fontWeight:'600',marginTop:10,marginLeft:5}}>Order Taken By :   {userName}</Text>
        <TouchableOpacity 
        style={{margin:10}}
        onPress={()=>{
          navigation.navigate('NewParty')
        }}
        >
          <Image  source={require('./Images/add-Party.png')} style={{height:30,width:30,tintColor:'#fff'}} />
        </TouchableOpacity>
        </View>
        <View style={{padding:5}}>
        <CustomSearch data={masterDataSource} placeholder={'Search Shipping Party Here...'}setvalue={(item)=>{
       setCustCode(item.Code)
          setCustomerName(item.Name);
         }}  setcrosValue={()=>{
          setCustCode(0)
         }} setitemDetails={()=>{}} /> 
          <CustomSearch data={masterDataSource} placeholder={'Search Billing Party Here...'}setvalue={(item)=>{
       setPartyName(item.Name);
       setPcode(item.Code);
       setexistingParty(item.BAccName);
       setTransporter(item.Transport);
         }} setcrosValue={()=>{
          setPcode(0);
          setexistingParty('');
          setTransporter('');
         }} 
         setitemDetails={()=>{}} 
         /> 
        </View>
           
       
          <TextInput style={{ borderBWidth:1,borderColor:'#000',borderRadius:5,fontWeight:'500',
        margin:5,borderBottomWidth:1,fontSize:18,fontWeight:'400',color:'#000'}} placeholder="Transporter" value={Transporter} onChangeText={(text)=>{
          setTransporter(text)
        }} />
          <TextInput style={{ borderBWidth:1,borderColor:'#000',borderRadius:5,fontWeight:'500',
        margin:5,borderBottomWidth:1,fontSize:18,fontWeight:'400',color:'#000'}} placeholder="Booking Station" value={BStation} onChangeText={(text)=>{
          setBStation(text)
        }} />
         <TextInput style={{ borderBWidth:1,borderColor:'#000',borderRadius:5,fontWeight:'500',
        margin:5,borderBottomWidth:1,fontSize:18,fontWeight:'400',color:'#000'}} placeholder="Remarks" value={remark} onChangeText={(text)=>{
          setRemark(text)
        }} />
          <Modal visible={isLoading}  >
      <View style={{alignItems:'center',flex:1,justifyContent:'center'}} >
      <ActivityIndicator size={25}  /> 
      <Text>Please Wait...</Text>
         </View> 
        </Modal>
        <Modal visible={showModal} transparent={true} animationType='slide'  >
            <View style={style.content}>
            <View style={{height:'20%',width:'80%',borderWidth:1,backgroundColor:'#fff',borderColor:'#000',elevation:5,borderRadius:10}}>
              <View style={{alignItems:'flex-start'}}>
               <Text style={{margin:5,fontSize:20,fontWeight:'600',color:'#000'}}>Alert</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{color:'#000'}}>{alertMsg}</Text>
              </View>
              <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between'}}>
              <TouchableOpacity style={style.alertMsgBtnSty} 
              onPress={()=>{
                setshowModal(false);
                setAlertMsg('')
              }}>
              <Text style={{color:'#fff'}}>No</Text>
              </TouchableOpacity>
                <TouchableOpacity style={style.alertMsgBtnSty}
                 onPress={()=>{
                  setshowModal(false);
                  setAlertMsg('')
                  ValidateCustomer()
                  }} >
                  <Text style={{color:'#fff'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
             </Modal>
             <View style={{alignItems:'flex-end',justifyContent:'flex-end'}}>
             <TouchableOpacity
                onPress={()=>{
                  if(PCode !== 0 && CustCode !==0){
                    if(PCode ==0 ){
                      alert( '('+PartyName + ')' + ' Party Is Not Exist In Busy, Please Create Party First')
                     }else if(CustCode ==0){
                      alert( '('+CustomerName + ')' + ' Party Is Not Exist In Busy, Please Create Party First')
    
                     }else{
                      ValidateCustomer() 
                     }
                  }else{
                    alert('Please Select Party First')
                  }
              
                }}
                style={[{width:'100%',backgroundColor:'black',alignItems:'center',justifyContent:'center'}]}>
                  <Text style={{color:'#fff',fontSize:17,padding:10}}>
                    Take Order
                  </Text>
                </TouchableOpacity>
             </View>
   
      </KeyboardAvoidingView>
    
    )
}
export default AddCustomer