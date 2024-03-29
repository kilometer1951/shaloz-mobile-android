import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import NetworkError from '../components/NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';

import * as appActions from '../store/actions/appActions';

const MyShopSearchScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsloading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [searchInput, setSearchInput] = useState('');

  const openEditProductScreen = (item) => {
    props.navigation.navigate('EditShopProduct', {product_data: item});
  };

  const myShopProducts = useSelector(
    (state) => state.appReducer.myShopProducts,
  );

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setIsloading(true);
        await dispatch(appActions.getMyShopProducts(user._id, 1));
        setIsloading(false);
      } catch (e) {
        setIsloading(false);
        setNetworkError(true);
      }
    };
    fetchShopProducts();
  }, []);

  const startSearch = async () => {
    try {
      if (searchInput !== '') {
        setIsloading(true);
        await dispatch(appActions.searchShopProduct(user._id, searchInput));
        setIsloading(false);
        // setMyShopProducts(response.my_shop_product);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemsCard}>
      <View
        style={{
          padding: 10,
          width: '100%',
          flexDirection: 'row',
          borderBottomColor: Colors.light_grey,
          borderBottomWidth: 0.5,
        }}>
        <View style={{width: '80%', flexDirection: 'row'}}>
          <View style={{width: '30%'}}>
            <FastImage
               source={{
                uri: item.main_image,
                priority: FastImage.priority.high,
              }}
              style={{
                width: '100%',
                height: 100,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={{width: '70%', marginLeft: 5}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
              {item.product_name}
            </Text>
            <View
              style={{
                padding: 5,
                backgroundColor: '#fbe9e7',
                marginTop: 5,
                borderRadius: 20,
                width: 150,
              }}>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                Qty available : {item.product_qty}
              </Text>
            </View>
            <View
              style={{
                padding: 5,
                marginTop: 5,
              }}>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                {Moment(new Date(item.date)).format('MMM Do, YYYY')}
              </Text>
            </View>
          </View>
        </View>
        <View style={{width: '20%', alignSelf: 'flex-end'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              alignSelf: 'flex-end',
            }}>
            ${item.product_price}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={openEditProductScreen.bind(this, item)}>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  let view;
  if (myShopProducts.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_light,
            fontSize: 20,
            fontWeight: '300',
            textAlign: 'center',
          }}>
          No product found for: {searchInput} try searching
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <FlatList
          style={{marginTop: 10}}
          renderItem={renderItem}
          data={myShopProducts}
          keyExtractor={(item) => item._id}
          extraData={myShopProducts}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View>
          <View style={styles.search}>
            <View style={{width: '5%'}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(appActions.getMyShopProducts(user._id, 1));
                  props.navigation.goBack();
                }}>
                <View>
                  <Icon
                    name="ios-arrow-back"
                    size={20}
                    style={{marginRight: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{width: '90%'}}>
              <TextInput
                placeholder={'Search'}
                onChangeText={(value) => setSearchInput(value)}
                value={searchInput}
                autoFocus={true}
                style={{fontFamily: Fonts.poppins_regular, width: '100%'}}
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  startSearch();
                }}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  startSearch();
                }}>
                <View>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </SafeAreaView>

      {isLoading ? <MaterialIndicator color={Colors.purple_darken} /> : view}
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemsCard: {
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginTop: 5,
    marginHorizontal: 2,
  },
  searchContainer: {
    height: 80,
    padding: 10,
  },

  search: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 0.5},
    elevation: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
});

export default MyShopSearchScreen;
