import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useState } from 'react';

const ChilldComponents = ({counter}) => {

    return (
        <View className="bg-blue-200 p-[10px] m-[10px] rounded-[5px]">
            <Text>Chilld Component Counter: {counter}</Text>
        </View>
    )
}

export default ChilldComponents;