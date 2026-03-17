import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useState } from 'react';

const ChilldComponents = ({counter}) => {

    return (
        <View style={styles.ChilldComponents}>
            <Text>Chilld Component Counter: {counter}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    ChilldComponents: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
});

export default ChilldComponents;