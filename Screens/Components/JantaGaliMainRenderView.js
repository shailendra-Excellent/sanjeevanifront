import {View,Text,FlatList} from 'react-native';
const SecondRenderComponent=({item,index,Color ,SizeWise})=>{
    // console.log(index, item) 
    return(
        <View >
           <View style={{flexDirection:'row',padding:5,}}>
   
    <Text >{Color + ' '+ '/'+' '+item.Qty +','}</Text>
 </View>
  
            
        </View>
 
    )
  }
const MainRenderList=({Item,index,sizeWise})=>{
    return(
      <View style={{flexDirection:'row',borderBottomWidth:1}}>
        <Text style={{width:150,borderRightWidth:1,padding:7 }}>{Item.ItemName}</Text>
        <Text style={{width:100,borderRightWidth:1,padding:7 }}>{sizeWise ==true?Item.Qty:Item.Color}</Text> 
         <View style={{flexDirection:'row'}}>
            {sizeWise ==true? <FlatList horizontal={sizeWise==true?true:false} data={Item.ItemParamDT} renderItem={({item,index})=>{
           return(
            <SecondRenderComponent item={item} index={index} Color={Item.Color} sizeWise={sizeWise} />
           ) 
          }} />:<Text style={{fontWeight:'600',fontSize:14,color:'green'}}>{' '+ Item.Qty}</Text>  }
         
         </View>
        {/* <Text style={{width:'35%',borderRightWidth:1,padding:7 }}>{sizeWise ==true?item.Color +'/'+item.ItemParamDT[index].Size:item.Qty}</Text> */}
      </View>
    )
  }
  export default MainRenderList