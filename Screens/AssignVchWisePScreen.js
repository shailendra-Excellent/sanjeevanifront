import React, { useState,useEffect } from "react";
import { View,Text, FlatList,Image, TouchableOpacity,Modal,RefreshControl, SafeAreaView} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import DefaultPreference from 'react-native-default-preference';
import { style } from "./style";
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment/moment";
import RNBounceable from "@freakycoder/react-native-bounceable";

import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";

const AssignVchWisePScreen=({navigation,route})=>{
    const {PartyInfo,IType}= route.params;
   const [Data,setData]= useState([])
    const [ApprovelModal,setApprovalModal]= useState(false)
   const [PickerData,setPickerData]= useState([]);
   const [SelectedPicker,setSelectedPicker]= useState('');
   const [isLoading,setisLoading]= useState(true);
   const [BaseURL,setBaseURL]= useState('');
   const [CompCode,setCompCode]= useState('');
   const [Fy,setFy]= useState('');
   const [showModal,setshowModal]= useState(false);
   const [alertMsg,setShowAlertMsg]= useState('');
   const [refreshing, setRefreshing] = React.useState(false);
   const [ItemData,setItemData]=useState([]);
   const [OrdDT,setOrdDT]= useState([]);
   const [userName,setuserName]= useState('');
   const [showGifMod,setshowGifMod]= useState(false)
// --------------------------UseEffect 
   useEffect(()=>{
    if(PartyInfo.Picker ==''){
      setSelectedPicker('Select Picker')
    }else{
      setSelectedPicker(PartyInfo.Picker)
    }
      DefaultPreference.get('BaseURL').then(function(BaseUrl) {
      DefaultPreference.get('CompCode').then(function(compCode) {
      DefaultPreference.get('FY').then(function(Fy) {
      DefaultPreference.get('Uname').then(function(uname){
          setuserName(uname)
        })
        setBaseURL(BaseUrl);
        setCompCode(compCode);
        setFy(Fy)
       CallAPI(BaseUrl,compCode,Fy,PartyInfo.VchCode,IType);
       PickerListAPI(BaseUrl,compCode,Fy)
      });
    });
  });
   },[]);

//--------------------------APProval APICall
const ApprovalAPI=async()=>{
  if(SelectedPicker == '' ||SelectedPicker ==null){
    alert('Please Select Picker Name..')
    // setShowAlertMsg('Please Select Picker Name..');
  }else{
    setisLoading(true)
    try{
      // console.log(BaseURL+'/api/Values/UpdatePickerinOrder?CompCode='+CompCode+'&FY='+Fy+'&VchCode='+PartyInfo.VchCode+'&Picker='+SelectedPicker)
      const response = await fetch(BaseURL+'/api/Values/UpdatePickerinOrder?CompCode='+CompCode+'&FY='+Fy+'&VchCode='+PartyInfo.VchCode+'&Picker='+SelectedPicker);
      const json = await response.json();
      if(json.Status == 1){
        setisLoading(false);
        setshowGifMod(true);
        sendNotification()
        setTimeout(() => {
          setshowGifMod(false);
          navigation.goBack()
          // navigation.replace('MDashBordPackerAsign',{Id:1});
        }, 3000);
      }else{
        setShowAlertMsg(json.Msg);
        setshowModal(true)
      }
      // navigation.replace('MDashBordPackerAsign',{Id:1});
    }catch(e){
      setisLoading(false);
      alert('Catch Error'+ e)
    }
 
  }
  

}  
const sendNotification=async(total)=>{
  let data={
    StageID:3,
    Title:userName,
    Msg:'Total '+PartyInfo.TotalQty+ ' Order Pending For Godown Transfer And Pick This Order by '+SelectedPicker
  }
  const res=await fetch(BaseURL +'/api/values/SendNotification?CompCode='+CompCode+'&FY='+Fy,{

    method: "POST",     
    headers: {
      "Content-Type": "application/json",
      
    },
    body: JSON.stringify(data)
  })

console.log("NOTIFICATION RESULT=>",res)

let result=await res.json();
console.log("NOTIFICATION RESULT WITH JSON=",result)
}
// ------------------------PickerList API call
const PickerListAPI=async(BaseUrl,compCode,Fy)=>{
    setisLoading(true);
    try{
      // console.log(BaseUrl+'/api/Values/GetPickerList?CompCode='+compCode+'&FY='+Fy)
      const res= await fetch(BaseUrl+'/api/Values/GetPickerList?CompCode='+compCode+'&FY='+Fy);
      const Response= await res.json();
      if(Response.Status==1){
        setPickerData(Response.Data);   
      }else{
        alert(Response.Message);
      }
    }catch(e){
              alert('Catch Error'+e)
              setisLoading(false);
             }
    setisLoading(false);
}
// ------------------------Call API
const CallAPI=async(BaseUrl,compCode,Fy,PCode,IType)=>{
  setisLoading(true);
  try{
    // console.log(BaseUrl+'/api/Values/GetConfirmedOrderItemDet?CompCode='+compCode+'&FY='+Fy+'&VchCode='+PCode+'&IType='+IType)
    const res= await fetch(BaseUrl+'/api/Values/GetConfirmedOrderItemDet?CompCode='+compCode+'&FY='+Fy+'&VchCode='+PCode+'&IType='+IType);
    const Response= await res.json();
    if(Response.Status==1){
      setData(Response.Data);   
    }else{
      alert(Response.Message);
    }
  }catch(e){
            alert('Catch Error'+e)
            setisLoading(false);
           }
  setisLoading(false);
    
}
const onRefresh = () => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false)
  }, 50)
}

//    ------------------------------Flatlist Render Item
const renderItem=({item,index})=>{

 setItemData(item.ItemParamDT);
  return(
  
    <View style={{width:'100%'}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:5}}>
   </View>
  
      <View style={{flexDirection:'row',borderBottomWidth:0.5,}}>
      <Text style={[style.salesmantextsty,{width:'30%',borderRightWidth:1,borderColor:'#000'}]}>{item.ItemName}</Text>
      <Text style={[style.salesmantextsty,{width:'20%',borderRightWidth:1,borderColor:'#000'}]} >{item.Color}</Text>
   {/* <ScrollView horizontal={true}> */}
   <View style={{flexDirection:'row',minWidth:400}}> 
   {item.ItemParamDT.map((item)=>{
    return(
        <Text style={[style.salesmantextsty,{color:'red',fontWeight:'600',padding:5}]} >{item.Size +"/"+item.Qty}</Text>

)
   })}

</View>
{/* </ScrollView>  */}
</View>
    </View>  
  
  )
}

    return(
        <View style={{flex:1,}}>
            {/* --------------------Party Info In Header----------------------- */}

              <View style={{padding:5,backgroundColor:'#000'}}>
                <View style={{flexDirection:'row',paddingLeft:10,justifyContent:'space-between',marginTop:10}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#fff',marginTop:5,fontWeight:'600',fontSize:12,width:110}}>Order ID:</Text>
                        <Text style={{color:'#fff',marginTop:5,fontWeight:'400',fontSize:12}}>{PartyInfo.OrderNo}</Text>
                    </View>
                </View>
                 <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',marginTop:10}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:10}} >
                          <Text style={{color:'#fff',marginTop:5,fontWeight:'600',fontSize:12,width:110}}>Party Name:</Text>
                          <View style={{alignItems:'flex-start'}}>
                          <Text style={{color:'#fff',marginTop:5,fontWeight:'400',fontSize:12}}>{PartyInfo.AccName}</Text>
                          </View>
                  </View> 
                  </View> 
                    <View style={{flexDirection:'row',paddingLeft:10,justifyContent:'space-between',marginTop:5}}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#fff',marginTop:5,fontWeight:'600',fontSize:12,width:110}}>Total Order:</Text>
                          <Text style={{color:'#fff',marginTop:5,fontWeight:'400',fontSize:12}}>{PartyInfo.TotalQty}</Text>
                    </View>
                    <View style={{flexDirection:'row',paddingLeft:5}}>
                        <Text style={{color:'#fff',marginTop:5,fontWeight:'600',fontSize:12,width:100}}>Order Date:</Text>
                        <Text style={{color:'#fff',marginTop:5,fontWeight:'400',fontSize:12}}>{PartyInfo.OrderDate}</Text>
                    </View>
                </View>
                  </View>
                  <View style={{height:'10%',alignItems:'center'}}>
                    {/* --------------Picker Dropdown------------------------- */}
                 {PickerData.length > 0 ? <SelectDropdown
                  defaultValue={PartyInfo.Picker}
                  buttonStyle={{height:30,marginTop:10,width:'98%' ,borderRadius:7}}
                  buttonTextStyle={{fontSize:15,fontWeight:'700',alignItems:'flex-start',
                  borderBottomWidth:1,
                  alignContent:'flex-start'}}
	                data={PickerData}
                    dropdownStyle={{width:'95%'}}
                    defaultButtonText={SelectedPicker}
	                onSelect={(selectedItem, index) => {
                      setSelectedPicker(selectedItem.Name)  
            	}}
            	buttonTextAfterSelection={(selectedItem, index) => {
            		 return selectedItem.Name
            	}}
                renderSearchInputRightIcon={'arrow-left'}
            	rowTextForSelection={(item, index) => {
            		 return item.Name
            	}}/>:<View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:18,color:'red'}}>No Any Picker User for Assign Order</Text>
                </View>}
                 
                  </View>
                <ScrollView horizontal={true}>
                  <View>
                  <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{flexDirection:'row',minWidth:400}}>
             <Text style={[style.headerText,{width:'30%',borderRightWidth:1,borderColor:'#fff'}]} >Item Name</Text>
             <Text style={{width:'20%' , color:'#fff',fontSize:15,borderRightWidth:1,borderColor:'#fff',padding:5}}>Color </Text>
             <Text style={[style.headerText,{borderColor:'#fff'}]} >Size/Qty</Text>
      </LinearGradient>

                  <FlatList
                     data={Data}
                     refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                     renderItem={renderItem}
                      keyExtractor={(item,Index)=>{
                        Index.toString();
                    }} />
                    </View>
                    </ScrollView>
                   <View style={{flexDirection:'row'}}>
                      <RNBounceable 
                      onPress={()=>{
                         navigation.goBack()
                          }}
                      style={{alignItems:'center',justifyContent:'center',backgroundColor:'red',
                      borderWidth:1,borderColor:'#fff',width:'50%'
                    }}>
                      <Text style={{color:'#fff',fontWeight:'600',fontSize:14,padding:7}}>Quit</Text>
                    </RNBounceable>
                    <RNBounceable style={{alignItems:'center',justifyContent:'center',backgroundColor:'green',
                      borderWidth:1,borderColor:'#fff',width:'50%'
                    }}  
                    onPress={()=>{
                      ApprovalAPI()
                        }}
                    >
                      <Text style={{color:'#fff',fontWeight:'600',fontSize:14,padding:5}}>Assign User</Text>
                    </RNBounceable>
                
                  </View>
                  <Modal visible={ApprovelModal} >
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',height:'100%',width:'100%'}}>
                    <Image source={{uri:'https://i.pinimg.com/originals/35/f3/23/35f323bc5b41dc4269001529e3ff1278.gif'}} style={{height:'100%',width:'100%'}} />
                    </View>
                  </Modal>
                  <Modal visible={isLoading}>
                    <View style={style.content}>
                    <ActivityIndicator size={25}  /> 
                     <Text>Please Wait...</Text>
                    </View>
                  </Modal>
                  {/* ---------------------Modal for Approvel------------------------------- */}
             <Modal visible={showModal} transparent={true} animationType='slide'  >
              <View style={style.content}>
              <View style={{height:'20%',width:'80%',borderWidth:1,backgroundColor:'#fff',borderColor:'#000',elevation:5,borderRadius:10}}>
              <View style={{alignItems:'flex-start'}}>
               <Text style={{margin:5,fontSize:20,fontWeight:'600',color:'#000'}}>Alert</Text>
              </View>
              <View style={{margin:5}}>
                <Text style={{color:'#000'}}>{alertMsg}</Text>
              </View>
              <View style={{width:'90%',alignItems:'flex-end'}}>
         
                <TouchableOpacity style={style.alertMsgBtnSty}
                 onPress={()=>{
                  setshowModal(false);
                  setShowAlertMsg('')
                  }} >
                  <Text style={{color:'#fff'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
             </Modal>
             <Modal transparent={true}
             visible={showGifMod}
             >
              <View style={style.content}>
                <View style={style.modalViewSty}>
                  <Text style={{}} >Order Transfer to next process..</Text>
              </View>
              </View>
             </Modal>
        </View>
    )
}
export default AssignVchWisePScreen