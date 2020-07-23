import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
  ActionSheetIOS,
  Text,Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const Test = (props) => {
  const [shopImageObject, setShopImageObject] = useState({});
  const [imageSelected, setImageSelected] = useState({});

  const handleBrowsePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };

          setShopImageObject(data);
          setImageSelected(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const goToSection = async () => {
    try {
      console.log(shopImageObject);

      let formData = new FormData();
      formData.append('photo', shopImageObject);
      const response = await fetch(`http://192.168.1.69:5002/test/test_`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <View>
          <TouchableOpacity onPress={handleBrowsePicker}>
            {Object.entries(imageSelected).length === 0 ? (
              <View style={styles.image}>
                <Icon
                  name="md-add-circle"
                  size={30}
                  color={Colors.pink}
                  style={{alignSelf: 'center', marginTop: '40%'}}
                />
              </View>
            ) : (
              <Image source={imageSelected} style={styles.image} />
            )}
          </TouchableOpacity>

          {Object.entries(imageSelected).length !== 0 && (
            <TouchableWithoutFeedback
              onPress={() => {
               
                goToSection();
              }}>
              <View style={styles.button}>
                <Icon name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});

export default Test;
