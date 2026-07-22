import {StyleSheet } from 'react-native'; 
export const style= StyleSheet.create({
    content:{
        flex:1,alignItems:'center',justifyContent:'center',
    },
    inputView:{
        flexDirection:'row'
    },
    InputSty:{
        height:40,borderWidth:1,borderColor:'#000',borderRadius:5,fontWeight:'500',
        margin:5,padding:3
    },
    buttonText:{
        color:'#fff',fontWeight:'700',fontSize:18
    },
    input: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      },
      inputStyle: { fontSize: 16 },
      labelStyle: { fontSize: 14 },
      placeholderStyle: { fontSize: 16 },
      textErrorStyle: { fontSize: 16 },
      GridSty:{
        height:80,
        borderRightWidth:1,
        alignItems:'center',
        justifyContent:'center'
    },
    footerBtnTouchSty:{
       width:'50%',
       height:40,
       alignItems:'center',
       justifyContent:'center',
       backgroundColor:'#000',
       borderRadius:7
    },
    ListDashBordView:{
        width:'98%',
        marginTop:5,
        backgroundColor:'#D8D6D4',
        borderWidth:0.5,
        borderColor:'#D8D6D4',
        borderTopLeftRadius:7,
        borderTopRightRadius:7
    },
    listHeaderView:{
        backgroundColor:'#000',
        padding:10,
        borderTopLeftRadius:7,
        borderTopRightRadius:7,
        alignItems:'center'
    },
    headerText:{
        color:'#fff',
        fontWeight:'600',
        paddingLeft:3,
        fontSize:13
    },
    showItemViewSty:{
        color:'#167803',
        fontWeight:'600',
        fontSize:15,
        marginBottom:10,
        marginTop:5
    },
    ApproveBtnSty:{
        marginRight:10,
        marginBottom:10,
    },
    itemTextSty:{
        fontSize:16,
        fontWeight:'300',
        padding:10
    },
    alertMsgBtnSty:{
        height:30,
        width:50,
        backgroundColor:'#000',
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:7
    },
    headerItemSty:{
        width:'80%',
        borderRightWidth:1
    },
    IconSty:{
        height:20,
        width:20,
        color:'#000',
        margin:5
    },
    salesmantextsty:{
        color:'#000',
        fontWeight:'400',
        padding:5 
   },
   modalViewSty:{
       height:40,
       borderWidth:0.4,
       alignItems:'center',
       justifyContent:'center',
       padding:5,
       borderRadius:5,
       elevation:5,
       backgroundColor:'#fff'
   },
   searchInput:{
    margin:10,
    backgroundColor:'#ADB0B0',
    width:'100%',
    height:50,
    alignItems:'center',
    justifyContent:'center'
   },
   itemSty:{
    color:'#fff',
    fontSize:20,
    fontWeight:'300'
   },
   StockBtnSty:{
    marginRight:5,
    backgroundColor:'white',
    flexDirection:'row',
    height:30,width:30,
    elevation:6,borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
   },
   modalItemSty:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'50%',marginTop:5
   },
   DateViewSty:{
    height:40,
    width:'35%',
    borderWidth:0.6,
    borderRadius:5,
    margin:5,
    alignItems:'center',
    justifyContent:'center'
   },
   ApproveViewSty:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    padding:5
   },
   EditInputSty:{
    height:40,
    width:80,
    backgroundColor:'#DCD6D9',
    borderRadius:5,
    borderWidth:1,
    borderColor:'#BBB4B7'
   },
   DynamicHeaderSty:{
   color:'#fff',
   fontWeight:'600',
   fontSize:18,
   padding:3,
   borderRightWidth:1,
   borderColor:'#fff'
   },
   DashBordTopView:{
    backgroundColor:'#000',
    height:'20%',
    borderBottomLeftRadius:14,
    borderBottomRightRadius:14,
    alignItems:'center',
    justifyContent:'flex-end',
    elevation:5,
    // alignItems:'flex-end',
   },
   DashBordBoxSty:{
    // borderWidth:10,
    borderRadius:8,
    width:'45%',
    // borderWidth:1,
    marginBottom:5,padding:10,elevation:10,backgroundColor:'#fff',marginRight:10
   },
   dropdown:{
    height: 50,
    borderColor: '#000',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin:4  ,padding:4   
   },  

})