import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropdownComponent from '../Components/ItemCreateComp/DropDownComp';
import { setGestureState } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import DefaultPreference from 'react-native-default-preference';

const ExhibitionORderPDFScreen = () => {
    const [DepartmentData,setDepartmentData]= useState([]);
    const [DepartmentName,setdEaprtmntNAme]= useState('Select Department');
    const [DepCdtode,setDepCode]= useState('');
    const [ItemDT,setItemdT]=useState([]);
    const [ItemName,setItemName]= useState('Select Design');
    const [Icode,setIcode]= useState('');
    const [OrderData,setOrderData]= useState([]);
    const [BaseURL,setBaseURL]= useState('');
    const [CompCode,setCompCode]= useState('');
    const [Fy,setFy]= useState('');
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        DefaultPreference.get('BaseURL').then(function (BaseURL) {
            DefaultPreference.get('CompCode').then(function (compCode) {
                DefaultPreference.get('FY').then(function (Fy) {
                    // setBaseURL((Prival)=>({
                    //   ...Prival,BaseURL:BaseURL,CompCode:compCode,Fy:Fy
                    // }))
                    setBaseURL(BaseURL);
                    setCompCode(compCode);
                    setFy(Fy)
                    callItemMasterAPI(BaseURL,compCode,Fy,5,0)
                })
            })
        })
    },[]);
    const callItemMasterAPI=async(BaseURL,compCode,Fy,MasterType,DepartmentCode)=>{
        setIsLoading(true)
        try{
             // console.log(BaseURL+'/api/Values/GetBusyMaster?CompCode='+compCode+'&FY='+Fy+'&MasterType='+MasterType+'&ParentGrp='+DepartmentCode);
         const res = await fetch(BaseURL+'/api/Values/GetBusyMaster?CompCode='+compCode+'&FY='+Fy+'&MasterType='+MasterType+'&ParentGrp='+DepartmentCode)
         const response = await res.json();
         setIsLoading(false)
         if(response.Status== 1){
       response.Data.sort((firstItem, secondItem) => firstItem.Name - secondItem.Name);
     
       if (MasterType == 5) {
        setDepartmentData(response.Data)
        // setInfo((PriVal) => ({
        //     ...PriVal, DepartmentData: response.Data
        // }));
    } else {
        setItemdT(response.Data)
        // setInfo((PriVal) => ({
        //     ...PriVal, ItemData: response.Data
        // }));
    }
         }else{
           setIsLoading(false)
           alert(response.Message)
         }
        }catch(e){
         setIsLoading(false)
          alert(e)
        }
    
   
   };
  return (
    <View style={{flex:1}}>
{/* {isLoading==} */}
    </View>
    
  )
}

export default ExhibitionORderPDFScreen

const styles = StyleSheet.create({})