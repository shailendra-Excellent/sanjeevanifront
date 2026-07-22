import React, { useState,useEffect} from "react";
import { View,Text,TouchableOpacity,Image,Modal, FlatList,BackHandler,StyleSheet} from "react-native";
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
import SearchBar from "react-native-dynamic-search-bar";
import {UIActivityIndicator} from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import {useIsFocused } from '@react-navigation/native';
import { Checkbox } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";


const MDashBordPackerAsign=({navigation,route})=>{
const {Id}= route.params;
const [UserName,setUserName]= useState('');
const [showModal,setshowModal]= useState(false);
const [alertMsg,setShowAlertMsg]= useState('');
const [data,setData]= useState([]);
const [masterDataSource, setMasterDataSource] = useState([]);
const [masterDataSource1, setMasterDataSource1] = useState([]);
const [FilterdData,setFilterdData]= useState([])
const [isLoading,setisLoading]= useState(true);
const [search,setsearch]= useState('');
const [BaseURL,setBaseURL]= useState('');
const [CompCode,setCompCode]= useState('');
const [Fy,setFy]= useState('');
const isFocused = useIsFocused();
const [showPendingOrder,setShowPendingOrder]= useState(true);
const [showApprovedOrder,setshowApprovedOrder]= useState(false);
const [id,setId]= useState(1);
const [UPDate,setUPDeta]= useState([])
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
const [FDate,setFDate]= useState(moment(new Date()).format('DD/MMM/YYYY'));
const [APIFDate,setAPIFDate]= useState(moment(new Date()).format('04/01'+Fy));
const [TDate,setTDate]= useState(moment(new Date()).format('DD/MMM/YYYY'));
const [APITDate,setAPITDate]= useState(moment(new Date()).format('DD/MMM/YYYY'));
const [dateId,setDateId]= useState(1);
const [IType,setItype]= useState(1)

// ---------------------useEffect 
useEffect(()=>{
      DefaultPreference.get('BaseURL').then(function(BaseUrl) {
        setBaseURL(BaseUrl)
      DefaultPreference.get('CompCode').then(function(compCode) {
        setCompCode(compCode)
      DefaultPreference.get('FY').then(function(Fy) {
        DefaultPreference.get('Uname').then(function(uname){
          setUserName(uname)
        });
        DefaultPreference.get('Rtype').then(function(Rtype){
         setFy(Fy);

          if(Id== 1){
            CallAPI(BaseUrl,compCode,Fy);
            GetOrdInfoAPI(BaseUrl,compCode,Fy,'04/01/'+Fy,moment(new Date()).format('DD/MMM/YYYY'))
                     }
      });
    });
    });
  });
  // const backAction = () => {
  //   Alert.alert("Alert", "Are you sure to Exit App?", [
  //     {
  //       text: "Cancel",
  //       onPress: () => null,
  //       style: "cancel"
  //     },
  //     { text: "YES", onPress: () => BackHandler.exitApp() }
  //   ]);
  //   return true;
  // };
  // const backHandler = BackHandler.addEventListener(
  //   "hardwareBackPress",
  //   backAction
  // );
  // return () => backHandler.remove();
},[isFocused]);

// ----------------------Call API
const CallAPI=async(BaseUrl,compCode,Fy)=>{

    // console.log(BaseUrl+'/api/Values/GetPendingConfirmOrderforPacker?CompCode='+compCode+'&FY='+Fy);
    setisLoading(true)
    try{
      const res= await fetch(BaseUrl+'/api/Values/GetPendingConfirmOrderforPacker?CompCode='+compCode+'&FY='+Fy)
      const Response= await res.json();
      setisLoading(false);
      if(Response.Status == 1){
        if(Response.Data.length>0){
          setData(Response.Data);
          setMasterDataSource1(Response.Data);
          setFilterdData(Response.Data)
        }else{
          setData([])
         
        }
      
      }
    }catch(e){
      setisLoading(false);
      alert('Catch Error'+e)
    }
}
// ----------------------get Pending order For any stage
const GetOrdInfoAPI=async(BaseURL,CompCode,Fy,APIFDate,APITDate)=>{
  // console.log(BaseURL+'/api/Values/GetConfirmAssignPickerOrder?CompCode='+CompCode+'&FY='+Fy+'&SDate='+APIFDate+'&EDate='+APITDate);
  setisLoading(true)
  try{
    const res= await fetch(BaseURL+'/api/Values/GetConfirmAssignPickerOrder?CompCode='+CompCode+'&FY='+Fy+'&SDate='+APIFDate+'&EDate='+APITDate);
    const Response= await res.json();

    setisLoading(false);
    if(Response.Status == 1){
      setUPDeta(Response.Data);
      setMasterDataSource(Response.Data);
      setFilterdData(Response.Data)
    }
  }catch(e){
    setisLoading(false);
    alert('Catch Error'+e)
  }
}

const showDatePicker = (DateId) => {
  setDatePickerVisibility(true);
};

const hideDatePicker = () => {
  setDatePickerVisibility(false);
};
const handleConfirm = (date) => {
    if(dateId ==1){
      setFDate(moment(date).format('DD/MMM/YYYY'));
      setAPIFDate(moment(date).format('DD/MMM/YYYY'))
    }else{
      setTDate(moment(date).format('DD/MMM/YYYY'));
      setAPITDate(moment(date).format('DD/MMM/YYYY'))
    }
 
  hideDatePicker();
};
const renderItem=({item,index})=>{
  return(
    <TouchableOpacity 
    style={{flexDirection:'row',borderBottomWidth:0.5,}}
    onPress={()=>{
      navigation.navigate('AssignVchWisePScreen',{PartyInfo:item,IType:IType})
    }}
    >
 <Text style={[style.headerText,{width:'10%',borderRightWidth:1,borderColor:'#000',color:'#000',paddingTop:10}]} >{index+1 +'.'}</Text>
 <View style={{width:'40%',borderRightWidth:1,borderColor:'#000',paddingTop:10}}>
 <Text style={[style.headerText,{color:'#000'}]} >{ item.OrderNo} </Text>
 <Text style={[style.headerText,{color:'red',fontWeight:'700'}]}>{moment(item.OrderDate).format('DD/MMM/YYYY')}</Text>
 </View>
  <View style={{width:'35%',}}>
 <Text style={[style.headerText,{borderRightWidth:1,borderColor:'#000',color:'#000',paddingTop:10}]} >{item.AccName}</Text>
  <Text style={[style.headerText,{borderRightWidth:1,borderColor:'#000',color:'green',paddingTop:10}]} >{item.SAccName}</Text>
 </View>
  <Text style={[style.headerText,{width:'15%',borderRightWidth:1,borderColor:'#000',color:'#000',paddingTop:10}]} >{item.TotalQty}</Text>
    </TouchableOpacity>
  )

}
// ---------------------------Search Function call
// const searchFilterFunction = (text) => {
//   if (text) {
  
//     const newData = masterDataSource.filter(
//       function (item) {
//         const itemData = item.Name
//           ? item.Name.toUpperCase()
//           : ''.toUpperCase();
//         const textData = text.toUpperCase();
//         return itemData.indexOf(textData) > -1;
//     });
//     setData(newData);
//     setsearch(text);
//   } else {
//     // Inserted text is blank
//     // Update FilteredDataSource with masterDataSource
//     setData(masterDataSource);
//     setsearch(text);
//   }
// };
const searchFilterFunction = (text) => {
  if(showApprovedOrder== true){
    // console.log(showApprovedOrder)
    if (text) {
  
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.SAccName
            ? item.SAccName.toUpperCase()
            : ''.toUpperCase(); 
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setUPDeta(newData);
      setsearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setUPDeta(masterDataSource);
      setsearch(text);
    }
  }else{
    if (text) {
      const newData = masterDataSource1.filter(
        function (item) {
          const itemData = item.SAccName
            ? item.SAccName.toUpperCase()
            : ''.toUpperCase(); 
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      // console.log(newData)
      setData(newData);
      setsearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(FilterdData);
      setsearch(text);
    }
  }
 
};
const UPRenderItem=({item,index})=>{

  if(item.TotalQty>0){
    return(
  
      <TouchableOpacity 
      style={{flexDirection:'row',borderBottomWidth:0.5,}}
      onPress={()=>{
        navigation.navigate('AssignVchWisePScreen',{PartyInfo:item,IType:2})
      }}
      >
   <Text style={[{width:'10%',borderRightWidth:1,borderColor:'#000',color:'#000',fontSize:12,fontWeight:'600'}]} >{index+1 +'.'}</Text>
   
   
   <View style={{width:'40%',borderRightWidth:1,borderColor:'#000',padding:5}}>
   <Text style={[{color:'#000',fontSize:12,fontWeight:'600'}]} >{ item.OrderNo} </Text>
   <Text style={[{color:'red',fontSize:12,fontWeight:'600'}]}>{item.OrderDate}</Text>
   <Text style={[{color:'#000',fontSize:12,fontWeight:'600'}]} >{ item.Remarks} </Text>
   </View>
   <View style={{width:'35%',borderRightWidth:1,borderColor:'#000',padding:5}}>
   <Text style={[{color:'#000',fontSize:12,fontWeight:'600'}]} >{item.AccName}</Text>
    <Text style={[{color:'green',fontSize:12,fontWeight:'600'}]} >{item.SAccName}</Text>
    <Text style={[{color:'blue',fontSize:12,fontWeight:'600'}]} >{item.Picker}</Text>
  
   </View>
    <Text style={[{width:'15%',borderRightWidth:1,borderColor:'#000',color:'#000',padding:5,fontWeight:'600',fontSize:12}]} >{item.TotalQty}</Text>
      </TouchableOpacity>
    )
  }
  
}
const UNApproveListHeader=({})=>{
  return(
    <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{flexDirection:'row',justifyContent:'space-between',}}>
             <Text style={[style.headerText,{width:'10%',borderRightWidth:1,borderColor:'#fff'}]} >SrNo.</Text>
             <Text style={[style.headerText,{width:'40%',borderRightWidth:1,borderColor:'#fff',}]} >Order No. / Order Date / Remarks</Text>
             <View style={{width:'35%',}}>
             <Text style={[style.headerText,{borderRightWidth:1,borderColor:'#fff'}]} >Party Name</Text>
             <Text style={[style.headerText,{borderRightWidth:1,borderColor:'#fff',color:'#fff'}]} >Shipping Name</Text>
             <Text style={[style.headerText,{borderRightWidth:1,borderColor:'#fff',color:'#fff'}]} >Picker Name</Text>
             </View>
             <Text style={[style.headerText,{width:'15%',borderRightWidth:1,borderColor:'#fff'}]} >Qty</Text>
            </LinearGradient>
  )
}
    return(
       <View style={{flex:1}}>
           <View style={{padding:5,backgroundColor:'#000'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:10}} >
                          <Text style={{color:'#fff',marginTop:5,fontWeight:'700',fontSize:16}}>User: </Text>
                          <Text style={{color:'#fff',marginTop:5,fontWeight:'700',fontSize:16}}>{UserName}</Text>
                  </View>  
                  {/* <TouchableOpacity onPress={()=>{
                    setshowModal(true);
                    setShowAlertMsg('Are You Sure To Log-Out ?');
                  }} >
                  <Image source={require('./Images/logout.png')} style={{height:25,width:25,margin:10,tintColor:'#fff'}} />
                  </TouchableOpacity> */}
                  </View> 
                 
                  <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between',marginLeft:10}}>
                    <Text style={{color:'#fff',marginTop:5,fontWeight:'300',fontSize:17}}>Total Party: </Text>
                    {showPendingOrder==true ?                    <Text style={{color:'#fff',marginTop:5,fontWeight:'300',fontSize:17}}>{data.length}</Text>
:                    <Text style={{color:'#fff',marginTop:5,fontWeight:'300',fontSize:17}}>{UPDate.length}</Text>
}
                </View> 
                  </View>
                  <View style={{padding:10,backgroundColor:'#ADB0B0',borderWidth:1,padding:5}}>
                 <View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
                  <TouchableOpacity 
                  onPress={()=>{
                    if(showPendingOrder==false){
                      setShowPendingOrder(true);
                      setItype(1)
                      setsearch('')
                      setshowApprovedOrder(false)
                      CallAPI(BaseURL,CompCode,Fy)       
                                 }
                                   }}
                  style={{height:40,padding:5,flexDirection:'row'}}
                  >
                    <Text style={{marginTop:5,fontSize:17,color:'#000'}}>Assign Picker</Text>
                    <Checkbox
                           color='#A90848'
                           uncheckedColor='#000'
                           status={showPendingOrder ? 'checked' : 'unchecked'}/>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={()=>{
                    if(showApprovedOrder ==false){
                      setshowApprovedOrder(true);
                      setItype(2)
                      setShowPendingOrder(false);
                      setsearch('')
                      GetOrdInfoAPI(BaseURL,CompCode,Fy,'04/01/'+Fy,moment(new Date()).format('DD/MMM/YYYY'))
                    }
                   
                  }}
                  style={{height:40,padding:5,flexDirection:'row'}}>
                    <Text style={{marginTop:5,fontSize:17,color:'#000'}}>Assigned Order</Text>
                    <Checkbox
                           color='#A90848'
                           uncheckedColor='#000'
                           status={showApprovedOrder ? 'checked' : 'unchecked'}/>
                  </TouchableOpacity>
                </View>
               <SearchBar
                  style={{height:40,width:'100%'}}
                  placeholder="Search here.."
                  textInputStyle={{height:40,margin:10}}
                  onChangeText={(text) =>{searchFilterFunction(text)}}
                  onSearchPress={(text) =>{searchFilterFunction(text)}}
                  value={search}
                />
             </View>
               {/* <View style={{padding:10,backgroundColor:'#D4D5D4'}}>
               <SearchBar
                  backgroundColor="#fff"
                  placeholder="Search here.."
                  textInputStyle={{height:40,margin:10}}
                  onChangeText={(text) =>{searchFilterFunction(text)}}
                  onSearchPress={(text) =>{ searchFilterFunction(text)}}
                  // onPress={() => alert("onPress")}
                  value={search}
                /> 
             </View>*/}
             <ScrollView>
             {showApprovedOrder == false ?  <View style={{width:'100%'}}>
             <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{flexDirection:'row',justifyContent:'space-between',}}>
             <Text style={[style.headerText,{width:'10%',borderRightWidth:1,borderColor:'#fff',padding:5}]} >SrNo.</Text>
             <Text style={[style.headerText,{width:'40%',borderRightWidth:1,borderColor:'#fff',padding:5}]} >Order No. / Order Date /Delivery Date / Remark</Text>
             <View style={{width:'35%',padding:5}}>
             <Text style={[style.headerText,{borderColor:'#fff',}]} >Party Name</Text>
             <Text style={[style.headerText,{borderColor:'#fff',color:'#fff'}]} >Shipping Name</Text>

             </View>
             <Text style={{borderLeftWidth:1,borderColor:'#fff',color:'#fff',width:'15%',textAlign:'center',fontWeight:'600',fontSize:13,padding:5}} >Qty</Text>
            </LinearGradient>
             
          
              {data.map((item,index)=>{
              if(item.TotalQty >0){
                return(
                  <TouchableOpacity 
                  style={item.OLevel==1 ?{flexDirection:'row',borderBottomWidth:0.5,backgroundColor:'#F5B7B1'}:{flexDirection:'row',borderBottomWidth:0.5,backgroundColor:'#fff'}}                  onPress={()=>{
                  
                    navigation.navigate('AssignVchWisePScreen',{PartyInfo:item,IType:IType})
                  }}
                  >
               <Text style={[sty.textSty,{width:'10%'}]} >{index+1 +'.'}</Text>
               <View style={[sty.textSty,{width:'40%',padding:5}]}>
                {/* <View style={{alignItems:'flex-end'}}>
                  {item.OLevel==1 ? <Text style={{fontWeight:'600',margin:5,color:'red'}}>Urgent</Text>:null}
                </View> */}
              
               <Text style={[{fontSize:12,fontWeight:'600',color:'#000'}]} >{ item.OrderNo} </Text>
               <Text style={[{fontSize:12,fontWeight:'600',color:'red'}]}>{item.OrderDate}</Text>
               <Text style={[{fontSize:12,fontWeight:'600',color:'blue'}]}>{item.DeliveryDate}</Text>
               <Text style={[{fontSize:12,fontWeight:'600',color:'#000'}]}>{item.Remarks}</Text>

               </View>
                <View style={{width:'35%',borderRightWidth:1,padding:5}}>
               <Text style={[{fontSize:12,fontWeight:'600',color:'#000'}]} >{item.AccName}</Text>
                <Text style={[{fontSize:12,fontWeight:'600',color:'green'}]} >{item.SAccName}</Text>
               </View>
                <Text style={[{width:'15%',borderRightWidth:1,borderColor:'#000',color:'#000',fontWeight:'600',fontSize:12,textAlign:'center',padding:5}]} >{item.TotalQty}</Text>
                  </TouchableOpacity>
                ) 
              }
              
              })}
            
             {/* <FlatList style={{}} data={data} renderItem={renderItem}
              keyboardShouldPersistTaps={'handled'}
                keyExtractor={(item,Index)=>Index.toString() } /> */}
                
             
             </View>:<View style={{flex:1}}>
                 {/* <View style={style.ApproveViewSty}>
                 <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                  <TouchableOpacity 
                    onPress={()=>{
                      setDateId(1)
                      showDatePicker()
                    }}
                   style={style.DateViewSty}
                  >
                   <Text style={{color:'#A90848',fontWeight:'700'}}>
                 {FDate}
                   </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                   onPress={()=>{
                    setDateId(2)
                    showDatePicker()
                  }}
                    style={style.DateViewSty}
                  >
                    <Text style={{color:'#A90848',fontWeight:'700'}}>
                    {TDate}
                   </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{
                      GetOrdInfoAPI() 
                    }}
                    style={[style.DateViewSty,{width:'15%',backgroundColor:'#A90848',elevation:5}]} >
                      <Text style={{color:'#fff',fontWeight:'600'}}>Load</Text>
                    </TouchableOpacity>
                 </View> */}
                 <View >
                  {UPDate.length > 0 ?
                  <ScrollView>
                  <FlatList data={UPDate} 
                  renderItem={UPRenderItem}
                  ListHeaderComponent={UNApproveListHeader}
                  />
                  </ScrollView>:<View style={{alignItems:'center',borderTopWidth:1}}>
                    <Text style={{fontSize:20,color:'#000'}}>Data Not Found</Text>
                    </View>}
                 
                 </View>
              </View>}
              </ScrollView>
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
                setShowAlertMsg('')
              }}>
              <Text style={{color:'#fff'}}>No</Text>
              </TouchableOpacity>
                <TouchableOpacity style={style.alertMsgBtnSty}
                 onPress={()=>{
                    if(alertMsg =='Do you want to exit this app'){
                        BackHandler.exitApp();
                    }else{
                        DefaultPreference.clear('Uname');
                        navigation.replace('Login'); 
                    }}} >
                  <Text style={{color:'#fff'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
             </Modal>
                 <Modal visible={isLoading} >
                  <View style={style.content} >
                    <ActivityIndicator size={35}  /> 
                     <Text>Please Wait...</Text>
                  </View>
                 </Modal>
               </View>
    )
}
export default MDashBordPackerAsign;

const sty= StyleSheet.create({
  textSty:{
    borderRightWidth:1,borderColor:'#000',color:'#000',fontSize:12,fontWeight:'600'
  }
})