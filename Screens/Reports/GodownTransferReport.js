import React, { useState,useEffect} from "react";
import { View,Text,TouchableOpacity,Image,Modal, FlatList,ScrollView} from "react-native";
import { style } from "../style";
import DefaultPreference from 'react-native-default-preference';
import SearchBar from "react-native-dynamic-search-bar";
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import {useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from "react-native";

const GodownTransferReport=()=>{
    const [UserName,setUserName]= useState('');
const [showModal,setshowModal]= useState(false);
const [alertMsg,setShowAlertMsg]= useState('');
const [data,setData]= useState([]);
const [masterDataSource, setMasterDataSource] = useState([]);
const [isLoading,setisLoading]= useState(true);
const [search,setsearch]= useState('');
const [BaseURL,setBaseURL]= useState('');
const [CompCode,setCompCode]= useState('');
const [Fy,setFy]= useState('');
const [McName,setMcName]= useState('');
const [GoDownReport,setGodownReport]= useState(false);
const [GodownReportData,setGodownReportData]= useState([])
    useEffect(()=>{
        DefaultPreference.get('BaseURL').then(function(BaseUrl) {
        DefaultPreference.get('CompCode').then(function(compCode) {
        DefaultPreference.get('FY').then(function(Fy) {
          DefaultPreference.get('McCode').then(function(McCdoe){

              CallReportAPI(BaseUrl,compCode,Fy,McCdoe)

      });
      });
    });
  });
  
  },[]);

    // ----------------------Call Report API
const CallReportAPI = async(BaseUrl,compCode,Fy,McCdoe)=>{
    try{
      // console.log(BaseUrl+'/api/Values/GetTransferDoneList?CompCode='+compCode+'&FY='+Fy+'&IgrpCode='+McCdoe)
      const res= await fetch(BaseUrl+'/api/Values/GetTransferDoneList?CompCode='+compCode+'&FY='+Fy+'&IgrpCode='+McCdoe)
      const Response= await res.json();
      setisLoading(false);
     
      if(Response.Status == 1){
        if(Response.Data.length>0){
          setGodownReportData(Response.Data)
        }else{
          // alert('Data Not Found')
        }
      
      }
    }catch(e){
      alert('Catch Error'+e)
    }
  }
    // ---------------------------Search Function call
const searchFilterFunction = (text) => {
    if (text) {
    
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.OrderNo
            ? item.OrderNo.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setsearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(masterDataSource);
      setsearch(text);
    }
  };
    return(
        <View>
{GodownReportData.length >0 ?<ScrollView>
      {GodownReportData.map((item,index)=>{
let TAmount=0
let TQty=0
    return(
      <View style={{}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:5}}>
       <View style={{flexDirection:'row'}}>
       <Text style={[style.salesmantextsty,{width:100}]}>Order ID :</Text>
         <Text style={[style.salesmantextsty,{fontSize:12,fontWeight:'400'}]}>{item.OrderNo}</Text>
       </View>
       <View style={{flexDirection:'row'}}>
       <Text style={[style.salesmantextsty,{width:50}]}>Date :</Text>
         <Text style={[style.salesmantextsty,{fontSize:12,fontWeight:'400'}]}>{moment(item.OrderDate).format('DD/MMM/YYYY')}</Text>
       </View>   
     </View>
     <View style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
     
   
     </View>
     <ScrollView horizontal={true}>
      <View>
     <View style={{flexDirection:'row',backgroundColor:'#000'}}>
     <Text style={{padding:5,color:'#fff',width:120,borderRightWidth:1,borderRightColor:'#fff'}}>Item Name</Text>
<Text style={{padding:5,color:'#fff',width:70,borderRightWidth:1,borderRightColor:'#fff'}}>Color</Text>
<ScrollView horizontal={true}>
<View style={{minWidth:200}}>
<Text style={{padding:5,color:'#fff',width:'auto',borderRightColor:'#fff',}}>Size/Qty</Text>

</View>

</ScrollView>

     </View>
     {item.OrdItem.map((ItemDT)=>{
        let sizeQty =''
return(
 <View style={{flexDirection:'row',borderBottomWidth:1,minWidth:100}}>
<Text style={{color:'#000',width:120,borderRightWidth:1,borderRightColor:'#000',padding:4,fontSize:12,fontWeight:'400',fontSize:12,fontWeight:'400'}}>{ItemDT.ItemName}</Text>
<Text style={{color:'#000',width:70,borderRightWidth:1,borderRightColor:'#000',padding:4,fontSize:12,fontWeight:'400',fontSize:12,fontWeight:'400'}}>{ItemDT.Color}</Text>

<View   style={{alignItems:'baseline',flexDirection:'row',}}  >
<View  style={{}}>
                 <Text  style={{color:'#000',padding:5,fontWeight:'600',color:'red',fontSize:12,fontWeight:'400'}} >{ItemDT.Size} /{ItemDT.Qty}</Text>
 </View>

</View> 

       
 </View>


)
})} 
</View>
     </ScrollView>
   
     </View>
    )
   
  })}
      </ScrollView>:<View style={{alignItems:'center'}}>
<Text style={{fontSize:19,fontWeight:'600'}}>Data Not Found</Text>
  </View>}
        </View>
    )
}
export default GodownTransferReport