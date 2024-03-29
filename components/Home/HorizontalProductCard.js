import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {Card, CardItem, Body} from 'native-base';
import FastImage from 'react-native-fast-image';

const HorizontalProductCard = (props) => {
  const dispatch = useDispatch();

  const {dataN} = props;

  const renderItems = dataN.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');
          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
          props.navigation.navigate('SingleProduct', {product_id: result._id});
        }}>
        <View
          style={{marginLeft: 10, backgroundColor: '#e1e4e8', borderRadius: 5}}>
          {result.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {result.discount}% OFF
              </Text>
            </View>
          )}
          <FastImage
            source={{
              uri: result.main_image,
              priority: FastImage.priority.normal,
            }}
            style={{
              width: 200,
              height: 180,
              borderRadius: 5,
            }}
            resizeMode={FastImage.resizeMode.cover}
            progressiveRenderingEnabled={true}
          />
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.hairProducts}>
      <Card>
        <View style={styles.hairProductsMiddleView}>
          <ScrollView
            horizontal={true}
            style={{marginTop: 17}}
            showsHorizontalScrollIndicator={false}>
            {renderItems}
          </ScrollView>
        </View>

        <View style={styles.hairProductCard}>
          <View style={styles.hairProductsTopView}>
            <Text style={{fontFamily: Fonts.poppins_regular}}>
              {props.heading}
            </Text>
            <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
              {props.text}
            </Text>
          </View>

          <View style={styles.hairProductsBottomView}>
            <TouchableOpacity
              onPress={async () => {
                const userData = await AsyncStorage.getItem('@userData');

                if (!userData) {
                  props.setIsNotAuthenticated(true);
                  return;
                }
                props.navigation.navigate('ProductCategory', {
                  backTitle: 'Home',
                  headerTile: props.heading,
                  main_cat: props.heading,
                  sub_cat_one: '',
                  sub_cat_two: '',
                });
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginTop: 4,
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 16,
                  }}>
                  See more
                </Text>
                <Icon
                  name="ios-arrow-round-forward"
                  size={30}
                  style={{marginLeft: 10}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  discountContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
    marginLeft: 5,
    padding: 2,
    borderRadius: 5,
    opacity: 0.7,
  },
  hairProducts: {
    marginTop: 20,
  },
  hairProductsBottomView: {
    padding: 10,
  },
  hairProductsMiddleView: {
    position: 'absolute',
    marginTop: '20%',
    width: '100%',
    zIndex: 1,
  },
  hairProductCard: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    marginHorizontal: 10,
    height: 330,
  },
  hairProductsTopView: {
    flex: 1,
  },
});

export default HorizontalProductCard;
