import { View, Text, FlatList } from 'react-native'
const RenderItem = ({ Item }) => {
  // console.log(Item)  
  return (

    <View style={{}}>
      <View style={{ flexDirection: 'row' }}>
        {Item.item.OrderNo == '' ? <Text style={{ fontSize: 15, fontWeight: '700', padding: 5 }}> {Item.item.ItemName}  </Text> : null}
        {Item.item.OrderNo !== '' ? <Text style={{ fontSize: 15, fontWeight: '700', padding: 5, }}> {'( ' + Item.item.OrderNo + ' )'}  </Text> : null}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
        <Text style={{ padding: 5, color: '#fff', width: 100, borderRightWidth: 1, borderRightColor: '#fff' }}>Color</Text>
        <Text style={{ padding: 5, color: '#fff', width: 80, borderRightWidth: 1, borderRightColor: '#fff' }}>Total Qty</Text>
        <View style={{ minWidth: 300 }}>
          <Text style={{ padding: 5, color: '#fff', width: 'auto', borderRightColor: '#fff', }}>Size/Qty</Text>
        </View>


      </View>
      <View>

        <FlatList data={Item.item.IColorDT}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: 'row' }}>
                {/* <Text style={{width:150,padding:5,borderRightWidth:1,borderBottomWidth:1,}}>{Item.item.ItemName}</Text> */}

                <Text style={{ width: 100, padding: 5, borderRightWidth: 1, borderBottomWidth: 1 }}>{item.Color}</Text>
                <Text style={{ width: 80, padding: 5, borderRightWidth: 1, borderBottomWidth: 1 }}>{item.Qty}</Text>


                <View style={{ alignItems: 'baseline', flexDirection: 'row', minWidth: 300, borderBottomWidth: 1 }}  >
                  <FlatList data={item.SizeDT}
                    horizontal={true}
                    renderItem={({ item }) => {
                      sizeQty = item.Size + '/' + item.CQty + ' ,'
                      if (item.CQty > 1) {
                        return (
                          <View style={{}}>
                            <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{sizeQty} </Text>
                          </View>

                        )
                      } else {
                        return (
                          <View>

                            <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{item.Size + ', '}</Text>

                          </View>
                        )
                      }
                    }}
                  />

                </View>
              </View>
            )
          }} />


      </View>

    </View>
  )
}
export default RenderItem