import { useEffect, useState } from "react";
import { View,Text,TouchableOpacity,Image, FlatList,RefreshControl,Modal,TextInput} from "react-native"
import DefaultPreference from 'react-native-default-preference';
import LinearGradient from "react-native-linear-gradient";
import { style } from "./style";
import {useIsFocused } from '@react-navigation/native';
const GUserScanItemScreen=({navigation,route})=>{
  const {ItemCode,ItemName,Id}= route.params;
  const [itemInfo,setItemInfo]= useState({});
  const [Qty,setQty]= useState(0);
  const [ScanData,setScanData] = useState([]);
   const [TQty,setTQty]= useState(0);
   const isFocused = useIsFocused();
   const [refreshing, setRefreshing] = useState(false);
   const [editModal,setEditModal]= useState(false);
   const [BcnVal,setBcnVal]= useState('')
   const [id,setid]= useState(1);
   const [Stock,setStock]= useState()
  useEffect(()=>{
        DefaultPreference.get('OneItemInfo').then(function(OneItemInfo){
        DefaultPreference.get('BaseURL').then(function(BaseUrl) {
        DefaultPreference.get('CompCode').then(function(compCode) {
        DefaultPreference.get('FY').then(function(Fy) {
        DefaultPreference.get('Uname').then(function(uname){
        DefaultPreference.get('McCode').then(function(McCdoe){
        DefaultPreference.get('BCNdata').then(function(BCNVal){
          DefaultPreference.get('Id').then(function(Id){
          setItemInfo(JSON.parse(OneItemInfo)); 
          
            if(Id !=='2'){
              if(BCNVal !==null){
              callAPI(BaseUrl,compCode,Fy,ItemCode,JSON.parse(OneItemInfo),BCNVal)
            }
            }else{
              if(JSON.parse(OneItemInfo).TfrQty >0){
                setTQty(JSON.parse(OneItemInfo).TfrQty)
                setScanData(JSON.parse(OneItemInfo).ParamBCN)
              } 
            }
           
          // }
         
        }) 
  }) 
})
})
})
})
})
})

  },[isFocused]);

  const callAPI=async(BaseUrl,compCode,Fy,ItemCode,ItemInfo,BCN)=>{
    console.log(BaseUrl+'/api/Values/SerachBCN?CompCode='+compCode+'&ItemCode='+ItemCode+'&Color='+ItemInfo.Color +'&Size='+ItemInfo.Size+'&FY='+Fy+'&MCCode=201&BCN='+BCN);
     const res= await fetch(BaseUrl+'/api/Values/SerachBCN?CompCode='+compCode+'&ItemCode='+ItemCode+'&Color='+ItemInfo.Color +'&Size='+ItemInfo.Size+'&FY='+Fy+'&MCCode=201&BCN='+BCN)
     const response= await res.json();
     if(response.Status ==1){
      setStock(response.Stock)
    if(TQty <= response.Stock){
      if(TQty < itemInfo.Qty ){
      let obj={
        BCN:BCN,
        Qty:1
      } 
    
        ItemInfo.TfrQty=1;
      let checkBCN= ScanData.find(item=>
        item.BCN ==obj.BCN,
      );
      let findindex = ScanData.indexOf(checkBCN);
      if(checkBCN !== undefined){
        obj= {
          BCN:checkBCN.BCN,
            Qty:checkBCN.Qty+1
        }
        ScanData.splice(findindex,1,obj);
        setTQty(obj.Qty)
        ItemInfo.ParamBCN=ScanData;
        ItemInfo.TfrQty=obj.Qty;
        DefaultPreference.set('OneItemInfo',JSON.stringify(ItemInfo))       
      }else{
        setTQty(obj.Qty)
        setScanData([...ScanData,obj]);
        ItemInfo.TfrQty=obj.Qty;
        ItemInfo.ParamBCN.push(obj)
        DefaultPreference.set('OneItemInfo',JSON.stringify(ItemInfo));
     
      }
     ItemInfo.ParamBCN = ScanData;
      }
      else{
        alert('Transfer Qty is must be less then Qty !!') 
      }
      
    }else{
      alert('Transfer Qty is must be less then Stock !!')
    }
    
     }else{
      alert(response.Message);
     }
  }
  const EditQtyModal=(item)=>{
    setBcnVal(item.BCN)
    setQty(item.Qty)
  setEditModal(true)
   }
  const onRefresh = () => {
    setRefreshing(true); 
    setRefreshing(false);
  }  
const renderItem=({item,index})=>{
  return(
    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:0.5,height:40}}>
    <Text style={[style.salesmantextsty,{width:'15%',borderRightWidth:1,borderColor:'#000'}]} >{index+1}</Text>
    <Text style={[style.salesmantextsty,{width:'50%',borderRightWidth:1,borderColor:'#000'}]} >{item.BCN}</Text>
    <Text style={[style.salesmantextsty,{width:'20%',borderRightWidth:1,borderColor:'#000'}]} >{item.Qty}</Text>

     <View style={{width:'15%',borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
     
     <TouchableOpacity 
        
     onPress={()=>{
       EditQtyModal(item)
     }}
     >
     <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1250/1250925.png'}} style={{height:20,width:20}} />
     </TouchableOpacity>
     </View>
</View>
  )
}

  return(
    <View style={{flex:1}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={[style.salesmantextsty,{fontSize:16,fontWeight:'600'}]}>{ItemName}</Text>
        <TouchableOpacity style={{margin:10}} onPress={()=>{
          DefaultPreference.clear('BCNdata')
          setid(2)
          navigation.navigate('ScanItem',{Id:2})
          }}>
      <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/1341/1341632.png'}} style={{height:25,width:25,tintColor:'#000',height:30,width:30}} />
        </TouchableOpacity>   
        </View>
  <View style={{height:'30%'}}>
  <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{flexDirection:'row',justifyContent:'space-between',height:50,paddingTop:5}}>
             <Text style={[style.headerText,{width:'30%',borderRightWidth:1,borderColor:'#fff'}]} >Color</Text>
             <Text style={[style.headerText,{width:'25%',borderRightWidth:1,borderColor:'#fff'}]} >Size</Text>
             <Text style={[style.headerText,{width:'20%',borderRightWidth:1,borderColor:'#fff'}]} >Qty</Text>
             <Text style={[style.headerText,{width:'25%',borderRightWidth:1,borderColor:'#fff'}]} >Transfer Qty</Text>
  </LinearGradient>
  <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:0.5,height:40}}>
          <Text style={[style.salesmantextsty,{width:'30%',borderRightWidth:1,borderColor:'#000'}]} >{itemInfo.Color}</Text>
          <Text style={[style.salesmantextsty,{width:'25%',borderRightWidth:1,borderColor:'#000'}]} >{itemInfo.Size}</Text>
          <Text style={[style.salesmantextsty,{width:'20%',borderRightWidth:1,borderColor:'#000'}]} >{itemInfo.Qty}</Text>
          <Text style={[style.salesmantextsty,{width:'25%',borderRightWidth:1,borderColor:'#000'}]} >{TQty}</Text>
   </View>
  </View>
 
    <LinearGradient colors={['#080808', '#272828', '#5C5D5C']} style={{flexDirection:'row',justifyContent:'space-between',height:40}}>
             <Text style={[style.headerText,{width:'15%',borderRightWidth:1,borderColor:'#fff'}]} >SrNo.</Text>
             <Text style={[style.headerText,{width:'50%',borderRightWidth:1,borderColor:'#fff'}]} >Scan Data</Text>
             <Text style={[style.headerText,{width:'20%',borderRightWidth:1,borderColor:'#fff'}]} >Qty</Text>
             <Text style={[style.headerText,{width:'15%',borderRightWidth:1,borderColor:'#fff'}]} >Edit</Text>

  </LinearGradient>
   <FlatList
    data={ScanData} 
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}  
      />
    } 
   renderItem={renderItem}
   />
   <View style={{alignItems:'flex-end',margin:10}}>
    <TouchableOpacity
    onPress={()=>{
      navigation.goBack()
    }}
    style={{backgroundColor:'#000',height:40,width:100,alignItems:'center',justifyContent:'center'}} >
      <Text style={{color:'#fff',fontSize:20}}>Back</Text>
    </TouchableOpacity>
   </View>
     <Modal visible={editModal} transparent={true} onRequestClose={()=>setEditModal(!editModal)} >
    <View style={style.content}>
      <View style={{width:'60%',backgroundColor:'#fff',elevation:5,borderRadius:7}}>
        <Text style={[style.salesmantextsty,{marginTop:6,color:'#000',padding:5}]}>{BcnVal}</Text>
     <View style={{flexDirection:'row',marginTop:6,padding:5}}>
      <Text style={[style.salesmantextsty,{borderColor:'#000',width:50,marginTop:7}]}>Qty: </Text>
      <TextInput
      keyboardType={'numeric'} maxLength={4}
      style={{}} value={Qty.toString()}  onChangeText={(text)=>{setQty(text)}} />
     </View>
      <View style={{alignItems:'center'}}>
        <TouchableOpacity 
          onPress={()=>{
            if(parseInt(Qty) <= itemInfo.Qty){
            let CheakItemName = ScanData.find(
              item => item.BCN.toUpperCase() === BcnVal.toUpperCase(),
            );
            const ind=   ScanData.indexOf(CheakItemName);
           if(CheakItemName !== undefined){
            let obj={
              BCN:BcnVal,
              Qty:Qty
            } 
            setTQty(obj.Qty)
            itemInfo.TfrQty= Qty;
            ScanData.splice(ind, 1, obj);
            setEditModal(false)
          }
        }else{
          alert('Transfer Qty is less then actual qty')
        }
         }}

        style={{backgroundColor:'#000',borderRadius:5,
        alignItems:'center',justifyContent:'center',height:40,width:80,margin:5}}
        >
          <Text style={{color:'#fff'}}>Edit</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
   </Modal>

    </View>
  )
}
export default GUserScanItemScreen